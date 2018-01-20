const token = process.env.EVENTBRITE_TOKEN;
const misc = require('../miscfuncs/misc.js');
const request = require('request');

module.exports = {
    getEventbriteData: function(term_query, latlon, city, date_in) {
        return new Promise(function (resolve, reject) {
            // ACCESS EVENTBRITE API

            var base_url = 'https://www.eventbriteapi.com/v3/'

            var latlongarray = misc.processLocationString(latlon);

            var latitude = latlongarray[0];
            var longitude = latlongarray[1];

            var today = misc.getDate(date_in, -1);
            var dateEnd = misc.getDate(date_in, 0);

            var options = {
                url: base_url + 'events/search',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                qs: {
                    // 'q': term_query,
                    'location.latitude': latitude,
                    'location.longitude': longitude,
                    'start_date.range_start': today,
                    'start_date.range_end': dateEnd,
                    'price': 'free',
                }
                // qs: {'q': term_query, 'location.city': city }
            };

            var eventbriteEvents = {
                Event1: [],
                Event2: [],
                Event3: [],
                Event4: []
            };

            var eventCnt = 0;

            function callback(error, response, body) {
              if (!error && response.statusCode == 200) {
                    // console.log(response);
                    var events = JSON.parse(response.body);

                    if(events.events.length > 0 ) {
                        var eventbriteItems = [];
                        var cost;

                        events.events.forEach(function(event, index, array) {
                            var time = event.start.local;

                            if (time) {
                                time = misc.processTimeSG(time);
                            } else {
                                time = '9999';
                            }

                            var timeFloat = parseFloat(time);
                            if(event.is_free == false) {
                                cost = 10;
                            } else {
                                cost = 0;
                            }
                            var item = {
                                name: "eb " + event.name.text + ", " + time,
                                cost: cost,
                                rating: (cost * 2) + 5,
                            };

                            // Categorize the events by time and push to seatgeekEvents
                            if (time <= 200) {
                                eventbriteEvents.Event4.push(item);
                                eventCnt++;
                            }
                            else if (time <= 900) {
                                eventbriteEvents.Event1.push(item);
                                eventCnt++;
                            }
                            else if (time <= 1200) {
                                eventbriteEvents.Event2.push(item);
                                eventCnt++;
                            }
                            else if (time <= 1800) {
                                eventbriteEvents.Event3.push(item);
                                eventCnt++;
                            }
                            else if (time < 2400) {
                                eventbriteEvents.Event4.push(item);
                                eventCnt++;
                            }

                            if(events.events.length == index + 1) {
                                console.log("number of eventbrite events: " + eventCnt)
                                resolve(eventbriteEvents);
                            }
                        });

                    }

                    // body.top_match_events.foreach(function(event) {
                    //     console.log(event.name.text);
                    // });
                } else {
                    console.log(error);
                    reject(false);
                }
            }

            request(options, callback);
        });
    },
}
