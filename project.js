// Alphavantage API key T6UEJETEQRVGDJS9
/*setTimeout(function(){
    location.reload();
}, 15000);*/

var stocks = [];

window.onload = function() {
	function toTimeZone(time, zone) {
	    var format = 'YYYY/MM/DD HH:mm:ss ZZ';
	    return moment(time, format).tz(zone).format(format);
	};
	$.ajax({
		type: "GET",
		url: "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=AAPL&interval=1min&apikey=T6UEJETEQRVGDJS9",
		success: function(result){
			stocks = result;
			getPrices();
			
		}
	});
}

/*window.onload = function() {
	$.ajax({
		type: "GET",
		url: "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=T6UEJETEQRVGDJS9",
		success: function(result){
			stocks = result;
			getPrices();
		}
	});
}*/

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
		ddPrev = nd.getDate()-1,
		mm = nd.getMonth()+1,
		yyyy = nd.getFullYear(),
		hh = nd.getHours(),
		min = nd.getMinutes();
		if(dd < 10) dd = '0' + dd;
		if(mm < 10) mm = '0' + mm;
		if(min < 10) min = '0' + min;
		if(ddPrev < 10) ddPrev = '0' + ddPrev;
		d = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':00';
	var dOpt = yyyy + '-' + mm + '-' + ddPrev + ' 16:00:00';
		//console.log(d);
	//var d = "2017-12-14 16:00:00";
	var price = timeSeries[nd],
		priceOpt = timeSeries[dOpt];
	if (timeSeries[nd]) {
		Object.getOwnPropertyNames(price).forEach(  function (val, idx, array) {
				document.getElementById("stockPrices").innerHTML += val + ': ' + price[val] + '<br>';
				}
		);
		document.getElementById("loadedStocks").innerHTML = metaData["2. Symbol"];
	}
	//when the stock exchange is closed, the data of closing time of previous day will be displayed on the page
	//variable ddPrev = d.getDate()-1 has such value, because of time difference with NY
	else {
	alert("Stock exchange is closed");
	document.getElementById("loadedStocks").innerHTML = metaData["2. Symbol"] + ' ' + dOpt;
	Object.getOwnPropertyNames(priceOpt).forEach(  function (val, idx, array) {
				document.getElementById("stockPrices").innerHTML += val + ': ' + priceOpt[val] + '<br>';
				}
		);
	}
	//in a line chart horizontal line will display date and time, vertical line stock prices
	//for that I need to place data in 2 different arrays
	var labelsValues = Object.keys(timeSeries);
	var datasetsValues = Object.values(timeSeries);
	var highPrice = Object.values(datasetsValues).map(o => o["2. high"]);
	console.log(highPrice);
	new Chart(document.getElementById("line-chart"), {
		type: 'line',
		data: {
			labels: labelsValues,
			datasets: [{
				data: highPrice,
				label: "Highest price",
				borderColor: "#8e5ea2",
				fill: false
			}]
		},
		options: {
			title: {
				display: true,
				text: 'Stock prices chart'
			}
		}
	});
}