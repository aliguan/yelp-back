const token = process.env.EVENTBRITE_TOKEN;
const misc = require('../miscfuncs/misc.js');
const request = require('request');
const EBRATING_BASE = 10.5; // Base rating for a meetup event
const RATING_INCR = 0.5;

module.exports = {
    getEventbriteData: function (term_query, latlon, city, date_in) {
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

                    var events = JSON.parse(response.body);
                    var cnt = 1;
                    if (events.events.length > 0) {
                        var cost = 0;
                        var rating = 0;
                        var url = '';
                        var logoUrl = '';
                        var description = '';
                        var name = '';
                        var date = '';
                        var eventLocation='';

                        events.events.forEach(function (event, index, array) {
                            var time = event.start.local;

                            if (time) {
                                time = misc.processTimeSG(time);
                            } else {
                                time = '9999';
                            }

                            var timeFloat = parseFloat(time);
                            if (event.is_free == false) {
                                cost = 10;
                            } else {
                                cost = 0;
                            }

                            // Give the event a rating
                            rating = EBRATING_BASE; // base rating for a eventbrite event
                            url = '';
                            logoUrl = '';
                            description = '';
                            name = '';
                            date = '';
                            eventLocation='';
                            if (event.url !== null && event.url !== '') {
                                rating = rating + RATING_INCR;
                                url = event.url;
                            }

                            if (event.logo !== null) {
                                if (event.logo.url !== null && event.logo.url !== '') {
                                    logoUrl = event.logo.url;
                                }
                            }

                            if (event.description !== null) {
                                if (event.description.text !== null && event.description.text !== '') {
                                    if (event.description.text.length <= 1000 && event.description.text.length > 0) {
                                        description = event.description.text;
                                    }
                                }
                            }

                            // Collect the name of the event
                            if (event.name !== null) {
                                if (event.name.text !== null) {
                                    name = event.name.text;
                                }
                            }

                            // Collec the date
                            if (event.start !== null) {
                                if (event.start.local !== null) {
                                    date = date_in;
                                }
                            }

                            // Collect location information
                            if (event.venue_id !== null) {
                                // eventLocation = event.venue_id;
                                eventLocation = latlon;
                                rating = rating + RATING_INCR;
                            }


                            rating = misc.round2NearestHundredth(rating);
                            var item = {
                                name: "eb " + name + ", " + time,
                                cost: cost,
                                rating: rating,
                                url: url,
                                time: time,
                                date: date,
                                thumbnail: logoUrl,
                                description: description,
                                location: eventLocation,
                            };

                            if (event.start !== null) {
                                if (event.start.local !== null) {
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
                                }
                            }

                            if (events.events.length == index + 1) {
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
