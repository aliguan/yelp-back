
var seatgeek = require("../seatgeek/seatgeek");
const MISC = require('../miscfuncs/misc.js');
const CLIENT_ID = process.env.SEATGEEK_ID;
const CLIENT_KEY = process.env.SEATGEEK_KEY;

module.exports = {
    getSeatGeekData: function (city_in, date_in) {
        return new Promise(function (resolve, reject) {
            try {
                var seatgeekFee;

                // Initialize the object that will hold the seatgeek event data categorized by time
                var seatgeekEvents = {
                    Event1: [],
                    Event2: [],
                    Event3: [],
                    Event4: []
                };

                // Determine the date to query the events
                var dateEnd = MISC.getDate(date_in, 0); // returns a string with a date in the format:
                // YYYY-MM-DDTHH:MM:SS of the date_in + 1 date at 2:00 am
                // i.e. if date_in is wed, jan 10, 2018, 9 pm. 
                // The returned date is jan 11, 2018, 2 am.
                var today = MISC.getDate(date_in, -1);
                console.log("sg location: " + city_in)

                //Do the seatgeek API call using seatgeek.js
                seatgeek.events({
                    'datetime_utc.gte': today,    //gte = greater than or equal to
                    'datetime_utc.lte': dateEnd,  //lte = less than or equal to
                    'venue.city': city_in,
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_KEY
                }, function (error, events) {
                    if (error) {
                        console.log(error);
                        reject(-1);
                    }
                    else {
                        // Check if events != null (events is returned by the API call)
                        if (events && events !== null) {
                            var numOfEvents = events.events.length;
                            var eventCnt = 0;
                            // console.log(events.events[0])
                            for (var i = 0; i < numOfEvents; i++) {
                                

                                // Get the event time
                                var time = events.events[i].datetime_local;
                                if (time) {
                                    time = MISC.processTimeSG(time);
                                }
                                else {
                                    time = '9999';
                                }
                                var timeFloat = parseFloat(time);

                                // Get the event fee/cost
                                seatgeekFee = -1.0;
                                if (!MISC.isEmpty(events.events[i].stats)) {
                                    if (events.events[i].stats.lowest_price) {
                                        // Average price. do we want max price? or give user a choice?
                                        seatgeekFee = events.events[i].stats.lowest_price;
                                    }
                                    else if (events.events[i].stats.average_price) {
                                        seatgeekFee = events.events[i].stats.average_price;
                                    }
                                }

                                // !!!only push the event to the array IF there is an accurate fee returned
                                if (seatgeekFee != -1) {
                                    //console.log(events.events[i].stats)

                                    // Construct the event item to be pushed/appened to seatgeekEvents
                                    var item = {
                                        name: "seatgeek: " + events.events[i].title +
                                            ", " + events.events[i].url +
                                            ", Date/Time: " + MISC.processDateSG(events.events[i].datetime_local) + "/" + time,
                                        cost: seatgeekFee,
                                        rating: seatgeekFee * 2 + 5, //need to change!!!!
                                    }

                                    // Categorize the events by time and push to seatgeekEvents
                                    if (time <= 200) {
                                        seatgeekEvents.Event4.push(item);
                                        eventCnt++;
                                    }
                                    else if (time <= 900) {
                                        seatgeekEvents.Event1.push(item);
                                        eventCnt++;
                                    }
                                    else if (time <= 1200) {
                                        seatgeekEvents.Event2.push(item);
                                        eventCnt++;
                                    }
                                    else if (time <= 1800) {
                                        seatgeekEvents.Event3.push(item);
                                        eventCnt++;
                                    }
                                    else if (time < 2400) {
                                        seatgeekEvents.Event4.push(item);
                                        eventCnt++;
                                    }
                                }
                            }

                            console.log("number of seatgeek events: " + eventCnt)
                            resolve(seatgeekEvents);
                        }
                        else {
                            resolve(0);
                        }
                    }
                });
            }
            catch (e) {
                console.log(e);
                console.log('error in getSeatGeekData')
                reject(-1);
            }
        })
    }
}