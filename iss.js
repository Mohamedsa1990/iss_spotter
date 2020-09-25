const request = require('request');


const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://api64.ipify.org?format=json', function(error, response, body) {
    if (error) {
      callback(error, null);
      return;
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      const data = JSON.parse(body).ip;
      callback(null, data);
    }
  });
};


const fetchCoordsByIP = function(Ip, callback) {
  request(`https://ipvigilante.com/${Ip}`, function(error, response, body) {
    if (error) {
      callback(error, null);
      return;
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      const { latitude, longitude} = JSON.parse(body).data;
      callback(null, {latitude, longitude});
    }
  });

};


const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(url, function(error, response, body) {
    if (error) {
      callback(error, null);
      return;
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      const passes = JSON.parse(body).response;
      callback(null, passes);
    }
  });
};

const nextISSTimesForMyLocation = function(callback) {
    fetchMyIP((error, ip) => {
      if (error) {
        return callback(error, null);
      }
      fetchCoordsByIP(ip, (error, coords) => {
        if (error) {
          return callback(error, null)
        }
        fetchISSFlyOverTimes(coords, (error,passes)=>{
          if (error) {
            callback(error, null);
            return;
          }
          callback(null, passes);
        });
      });
    });
};






module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation
};