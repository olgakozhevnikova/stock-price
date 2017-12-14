// Alphavantage API key T6UEJETEQRVGDJS9

const alpha = require('alphavantage')({ key: 'T6UEJETEQRVGDJS9' });
 
// Simple examples
alpha.data.intraday(`MSFT`).then(data => {
  console.log(data);
});

