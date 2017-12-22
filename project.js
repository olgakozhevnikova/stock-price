// Alphavantage API key 8TKKZE0GET944FMW

$(function() {
  var loadedStocks = $("#loadedStocks"),
      API = 'https://www.alphavantage.co/query',
      symbols = ['AAPL', 'MSFT', 'CSCO', 'FB', 'AMZN', 'GOOG', 'INTC', 'KHC', 'NVDA', 'AVGO'];

  symbols.forEach(symbol => makeAjaxCall(symbol));

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
    if(hh < 10) hh = '0' + hh;
    if(min < 10) min = '0' + min;
    d = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':00'; //format: 2017-12-01 08:15:00
    var dmy = dd + '.' + mm + '.' + yyyy, //format: 01.12.2017
        price = timeSeries[nd],
        //the following variables define data which will be displayed when stock exchange is closed 
        dateKeys = Object.keys(timeSeries),
        firstElem = dateKeys[0],
        lastWord = firstElem.lastIndexOf(" "),
        properDate = firstElem.substring(0, lastWord);
   
    //each modal should have a unique ID. Example: chartModal-AAPL
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

    if (timeSeries[Object.keys(timeSeries)[d]]) {
     /* var priceList1 = '';
      //getting pairs of property:value from object timeSeries
      Object.getOwnPropertyNames(price).forEach(  
        function (val, idx, array) {
          priceList1 += val + ': ' + price[val] + '<br>';
        }
      );*/
      loadedStocks.append(
        '<table class="table">' + 
          '<tbody><tr>' + 
            '<td><a href="#" data-stock="' + symbol + '">' + symbol + '</a></td>' + 
            '<td>' + dmy + '</td>' + 
            '<td>' + timeSeries[Object.keys(timeSeries)[d]]['1. open'] + '</td>' + 
            '<td>' + timeSeries[Object.keys(timeSeries)[d]]['2. high'] + '</td>' + 
            '<td>' + timeSeries[Object.keys(timeSeries)[d]]['3. low'] + '</td>' + 
            '<td>' + timeSeries[Object.keys(timeSeries)[d]]['4. close'] + '</td>' + 
            '<td>' + timeSeries[Object.keys(timeSeries)[d]]['5. volume'] + '</td>' + 
          '</tbody>' + 
        '</table>' + modal);
    }
    //when the stock exchange is closed, the last data of a day will be displayed on the page
    else {
      /*var priceList2 = '';
      Object.getOwnPropertyNames(lastDate).forEach(  function (val, idx, array) {
          priceList2 += val + ': ' + lastDate[val] + '<br>';
        }
      );*/
      //HTML5-data attribute to store the stock value 
      loadedStocks.append(
        '<table class="table">' + 
          '<tbody><tr>' + 
            '<td><a href="#" data-stock="' + symbol + '">' + symbol + '</a></td>' + 
            '<td>' + properDate + '</td>' + 
            '<td>' + timeSeries[Object.keys(timeSeries)[0]]['1. open'] + '</td>' + 
            '<td>' + timeSeries[Object.keys(timeSeries)[0]]['2. high'] + '</td>' + 
            '<td>' + timeSeries[Object.keys(timeSeries)[0]]['3. low'] + '</td>' + 
            '<td>' + timeSeries[Object.keys(timeSeries)[0]]['4. close'] + '</td>' + 
            '<td>' + timeSeries[Object.keys(timeSeries)[0]]['5. volume'] + '</td>' + 
          '</tbody>' + 
        '</table>' + modal);
    }

    var datasetsValues = Object.values(timeSeries),
        datasetsValuesReverse = datasetsValues.reverse(),
        highPrice = Object.values(datasetsValuesReverse).map(o => o["4. close"]),
        dateKeys = Object.keys(timeSeries),
        datesReverse = dateKeys.reverse(),
        last = loadedStocks.find('.line-chart').last()[0]; //last element

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
  $(document).on('click', 'a[data-stock]', function showChart(e) {
    e.preventDefault();
    //find modal based on this link's stock value
    $('#chartModal-' + this.dataset.stock).modal('show');
  });
});