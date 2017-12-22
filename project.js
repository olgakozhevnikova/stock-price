// Alphavantage API key 8TKKZE0GET944FMW
// , 'MSFT', 'CSCO', 'FB', 'AMZN', 'GOOG', 'INTC', 'KHC', 'NVDA', 'AVGO'
$(function() {
  //cache elements that I will re-use
  var loadedStocks = $("#loadedStocks");
  var API = 'https://www.alphavantage.co/query';

  function makeAjaxCall(param) {
    $.getJSON(API, {
      'function': 'TIME_SERIES_INTRADAY',
      'symbol': param,
      'interval': '1min',
      'apikey': '8TKKZE0GET944FMW',
    }, getPrices);
  }

  function getPrices(stocks) {
    var metaData = stocks["Meta Data"],
      timeSeries = stocks["Time Series (1min)"],
      symbol = metaData["2. Symbol"];

var d = new Date(), //date object for current location
      localTime = d.getTime(), //convert to msec since Jan 1, 1970
      localOffset = d.getTimezoneOffset() * 60000, //get local UTC offset (in min) and convert to msec
      //1 sec = 1000 msec, 1 min = 60 sec
      utc = localTime + localOffset, //obtain UTC time in msec
      offset = -5.5, //NY timezone
      ny = utc + 3600000 * offset, //time in NY in msec
      //1 hour = 3600 sec
      nd = new Date(ny), //convert NY time in msec to date string
      dd = nd.getDate(),
      mm = nd.getMonth()+1,
      yyyy = nd.getFullYear(),
      hh = nd.getHours(),
      min = nd.getMinutes();
      if(dd < 10) dd = '0' + dd;
      if(mm < 10) mm = '0' + mm;
      if(min < 10) min = '0' + min;
      d = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':00',
      dOpt = yyyy + '-' + mm + '-' + dd;
      dmy = dd + '.' + mm + '.' + yyyy,
      price = timeSeries[nd],
      //the following variables define data which will be displayed when stock exchange is closed 
      dateKeys = Object.keys(timeSeries),
      firstElem = dateKeys[0],
      lastWord = firstElem.lastIndexOf(" "),
      properDate = firstElem.substring(0, lastWord),
      lastDate = timeSeries[Object.keys(timeSeries)[0]];
      var priceList2 = '';
      Object.getOwnPropertyNames(lastDate).forEach(  function (val, idx, array) {
          priceList2 += val + ': ' + lastDate[val] + '<br>';
        }
      );
      

    //each modal should have a unique ID e.g. chartModal-AAPL
    var modal =
      '<div id="chartModal-' + symbol + '" class="modal fade" role="dialog" style="display:none">' +
      '<div class="modal-dialog modal-lg" role="content">' +
      '<div class="modal-content">' +
      '<div class="modal-header">' +
      '<h4>' + symbol + '</h4>' +
      '<button type="button1" class="close" data-dismiss="modal">&times;</button>' +
      '</div>' +
      '<div class="modal-body" id="modalBody">' +
      '<div class="container-canvas">' +
      '<canvas class="line-chart" width="400" height="250"></canvas>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>';

    //HTML5-data attribute to store the stock value 
    loadedStocks.append('<div class="eachStock"><a href="#" data-stock="' + symbol + '">' + symbol + '</a></div>' + properDate + priceList2 + modal);

    var datasetsValues = Object.values(timeSeries),
      datasetsValuesReverse = datasetsValues.reverse(),
      highPrice = Object.values(datasetsValuesReverse).map(o => o["4. close"]),
      dateKeys = Object.keys(timeSeries),
      datesReverse = dateKeys.reverse();

    var last = loadedStocks.find('.line-chart').last()[0]; // simplified

    new Chart(last, {
      type: 'line',
      data: {
        labels: datesReverse,
        datasets: [{
          data: highPrice,
          borderColor: "#FF4500",
          label: "Close",
          fillset: "#FFDAB9"
        }],
        pointStyle: "cross",
      },
      options: {
        title: {
          display: true,
          text: "Stock's close price changes"
        }
      }
    });
  }

  //a click handler on the dynamically-created link
  $(document).on('click', '.eachStock a[data-stock]', function showChart(e) {
    e.preventDefault();
    //find modal based on this link's stock value
    $('#chartModal-' + this.dataset.stock).modal('show');
  });

  //start
  ['AAPL', 'MSFT', 'FB'].forEach(symbol => makeAjaxCall(symbol));
});

