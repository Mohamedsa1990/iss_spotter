const request = require('request');


const fetchMyIP = function(callback) { 
  // use request to fetch IP address from JSON API
    request('https://api64.ipify.org?format=json', function (error, response, body) {
     if (error) {
       callback(error, null);
       return;
     } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
     } else {
       const data = JSON.parse(body);
       callback(null, data.ip);
      }
    });
}

module.exports = { fetchMyIP };