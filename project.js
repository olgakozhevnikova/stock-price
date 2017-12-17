// Alphavantage API key T6UEJETEQRVGDJS9
/*setTimeout(function(){
    location.reload();
}, 15000);*/

var stocks = [];
window.onload = function() {
    var symbols = ['AAPL', 'MSFT', 'CSCO', 'FB', 'AMZN', 'GOOG', 'INTC', 'KHC', 'NVDA', 'AVGO'];

    symbols.forEach( symbol => makeAjaxCall(symbol));

}

function makeAjaxCall(param){
	$.ajax({
	    type: "GET",
	    url: "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + param + "&interval=1min&apikey=T6UEJETEQRVGDJS9",
	    success: function(result){
	        stocks = result;
	        getPrices(); 
	    }
	});
}

function getPrices() {
	var metaData = stocks["Meta Data"];
	var timeSeries = stocks["Time Series (1min)"];
	//presenting local date and time as a string in a format similar to "Time series" in JSON file
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

		myHtml =    '<div class="button col-3 align-self-center">' + 
						'<a role="button" class="btn btn-success btn-block text-white" onclick="showChart()">Show chart</a>' + 
					'</div>';
		myMdl1 = 	'<div class="modal-dialog modal-lg" role="content">' + 
						'<div class="modal-content">' + 
							'<div class="modal-header" id="modalHeader"><h4>',
		myMdl2 =          		'</h4><button type="button1" class="close" data-dismiss="modal">&times;</button>' + 
							'</div>' + 
							'<div class="modal-body" id="modalBody">' + 
								'<div class="container-canvas">' + 
									'<canvas id="line-chart" width="400" height="250"></canvas>' + 
								'</div>' + 
							'</div>' + 
						'</div>' + 
					'</div>';
		

		

	if (timeSeries[nd]) {
		var priceList1 = '';
		Object.getOwnPropertyNames(price).forEach(  function (val, idx, array) {
				priceList1 += val + ': ' + price[val] + '<br>';
				}
		);
		document.getElementById("loadedStocks").innerHTML += '<div>' + metaData["2. Symbol"] + '<br>' + priceList1 + '</div>' + myHtml;
		document.getElementById("chartModal").innerHTML += myMdl1 + metaData["2. Symbol"] + ' ' + dmy + myMdl2;
	}
	//when the stock exchange is closed, the last data of a day will be displayed on the page
	else {
		var priceList2 = '';
		Object.getOwnPropertyNames(lastDate).forEach(  function (val, idx, array) {
				priceList2 += val + ': ' + lastDate[val] + '<br>';
			}
		);
		document.getElementById("loadedStocks").innerHTML += '<div>' + metaData["2. Symbol"] + ' ' + properDate + '<br>' + priceList2 + '</div>' + myHtml;
		document.getElementById("chartModal").innerHTML += myMdl1 + metaData["2. Symbol"] + ' ' + properDate + myMdl2;
	}
	//in a line chart horizontal line will display date and time, vertical line stock prices
	//for that I need to place data in 2 different arrays
	var datasetsValues = Object.values(timeSeries),
		datasetsValuesReverse = datasetsValues.reverse();
		highPrice = Object.values(datasetsValuesReverse).map(o => o["4. close"]),
		datesReverse = dateKeys.reverse();
	new Chart(document.getElementById("line-chart"), {
		type: 'line',
		data: {
			labels: datesReverse,
			datasets: [{
				data: highPrice,
				borderColor: "#00BFFF",
				label: "Close",
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
function showChart() {
		//console.log('working');
		$('#chartModal').modal();

}

function handleSearch(event) {
    var searchText = event.currentTarget.value.toUpperCase(),
    	content = document.getElementById("loadedStocks");
    for (i = 0; i < content.length; i++) {
        if (content.innerHTML.toUpperCase().indexOf(searchText) > -1)
            content.style.display = "";
        else 
            content.style.display = "none";
    }
}