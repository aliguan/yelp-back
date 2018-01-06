
var seatgeek = require("../seatgeek/seatgeek");
const MISC = require('../miscfuncs/misc.js');
const CLIENT_ID = process.env.SEATGEEK_ID;
const CLIENT_KEY = process.env.SEATGEEK_KEY;

module.exports = {
    getSeatGeekData: function (city_in) {
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
                var date = MISC.getDate(0); // a date x days from now (need to change to get input from user)
                var today = MISC.getDate(-1);

                //Do the seatgeek API call using seatgeek.js
                seatgeek.events({
                    'datetime_utc.gte': today, //gte = greater than or equal to
                    'datetime_utc.lte': date,  //lte = less than or equal to
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
                                seatgeekFee = 0;
                                if (!MISC.isEmpty(events.events[i].stats)) {
                                    if (events.events[i].stats.average_price) {
                                        // Average price. do we want max price? or give user a choice?
                                        seatgeekFee = events.events[i].stats.average_price;
                                    }
                                }

                                // Construct the event item to be pushed/appened to seatgeekEvents
                                var item = {
                                    name: events.events[i].title + " Time: " + time,
                                    cost: seatgeekFee,
                                    rating: seatgeekFee*2 + 5, //need to change!!!!
                                }
    
                                // Categorize the events by time and push to seatgeekEvents
                                if (time <= 200) {
                                    seatgeekEvents.Event4.push(item);
                                }
                                else if (time <= 900) {
                                    seatgeekEvents.Event1.push(item);
                                }
                                else if (time <= 1200) {
                                    seatgeekEvents.Event2.push(item);
                                }
                                else if (time <= 1800) {
                                    seatgeekEvents.Event3.push(item);
                                }
                                else if (time < 2400) {
                                    seatgeekEvents.Event4.push(item);
                                }
                            }

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