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
	if (timeSeries[nd]) {
		document.getElementById("loadedStocks").innerHTML = metaData["2. Symbol"];
		Object.getOwnPropertyNames(price).forEach(  function (val, idx, array) {
				document.getElementById("stockPrices").innerHTML += val + ': ' + price[val] + '<br>';
				}
		);
		document.getElementById("symbol").innerHTML = metaData["2. Symbol"] + ' ' + dmy;
	}
	//when the stock exchange is closed, the last data of a day will be displayed on the page
	else {
	document.getElementById("loadedStocks").innerHTML = metaData["2. Symbol"] + ' ' + properDate;
	Object.getOwnPropertyNames(lastDate).forEach(  function (val, idx, array) {
				document.getElementById("stockPrices").innerHTML += val + ': ' + lastDate[val] + '<br>';
				}
		);
	document.getElementById("symbol").innerHTML = metaData["2. Symbol"] + ' ' + properDate;
	}
	//in a line chart horizontal line will display date and time, vertical line stock prices
	//for that I need to place data in 2 different arrays
	var datasetsValues = Object.values(timeSeries),
		datasetsValuesReverse = datasetsValues.reverse();
		highPrice = Object.values(datasetsValuesReverse).map(o => o["4. close"]),
		//common = dateKeys.map(a => [...a]).reduce((a, b) => a.map((v, i) => v === b[i] ? v : null)).filter(Boolean),
		//result = dateKeys.map(a => [...a].filter((v, i) => v !== common[i]).join('')),
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

	};