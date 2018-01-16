const token = process.env.EVENTBRITE_TOKEN;
const misc = require('../miscfuncs/misc.js');
const request = require('request');

module.exports = {
    getEventbriteData: function(term_query, latlon, city) {
        // ACCESS EVENTBRITE API

        var base_url = 'https://www.eventbriteapi.com/v3/'

        var latlongarray = misc.processLocationString(latlon);

        var latitude = latlongarray[0];
        var longitude = latlongarray[1];

        var options = {
            url: base_url + 'events/search',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            qs: {'q': term_query, 'location.latitude': latitude, 'location.longitude': longitude, 'start_date.keyword': 'today' }
            // qs: {'q': term_query, 'location.city': city }
        };

        function callback(error, response, body) {
          if (!error && response.statusCode == 200) {
                console.log(JSON.stringify(response));
                console.log(body);
            } else {
                console.log(error);
            }
        }

        request(options, callback);

    },
}
