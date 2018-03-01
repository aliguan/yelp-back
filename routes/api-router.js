'use strict';
const express = require('express');
const apiRouter = express.Router();
const yelp = require('yelp-fusion');
const yelpApi = require('../externalApis/yelpapi.js');
const meetupApi = require('../externalApis/meetupapi.js');
const seatgeekApi = require('../externalApis/seatgeekapi.js');
const eventbriteApi = require('../externalApis/eventbriteapi.js');
const yelpEventApi = require('../externalApis/yelpeventsapi.js');
const misc = require('../miscfuncs/misc.js');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
let client = yelp.client(process.env.API_KEY);

const noneItem = {
    name: "None/Free Itinerary Slot",
    cost: 0,
    rating: 4.4,
    time: "9999",
    location: {},
}
const noneItemEvent = {
    name: "None/Free Itinerary Slot",
    cost: 0,
    rating: 10.5,
    time: "9999",
    location: {},
}

//Search for business
apiRouter.post('/', (req, res, next) => {

    // API calls toggles (if true, do the API call)
    var doYelpBreakfastCalls = true;
    var doYelpLunchCalls = true;
    var doYelpDinnerCalls = true;
    var doYelpEventCalls = false;
    var doMeetupCalls = true;
    var doEventbriteCalls = true;
    var doSeatgeekCalls = true;

    // Variables for returned data
    var yelpBreakfastItemsGlobal;
    var yelpLunchItemsGlobal;
    var yelpDinnerItemsGlobal;
    var meetupItemsGlobal;
    var seatgeekItemsGlobal;
    var yelpEventsGlobal;
    var eventbriteGlobal
    var date = new Date(req.body.date);
    var string_date = req.body.string_date

    // Yelp API Inputs
    const BREAKFAST_HOUR = 9; // hours from 12:00am
    const LUNCH_HOUR = 13;  // 1 pm
    const DINNER_HOUR = 18; // 6 pm
    const BREAKFAST = "Breakfast";
    const LUNCH = "Lunch";
    const DINNER = "Dinner";

    // Promise Chain of API calls

    // Start with breakfast restaurants
    yelpApi.getYelpData(BREAKFAST, req.body.latlon, client, date, string_date, BREAKFAST_HOUR).then(
        function (yelpBreakfastItems) {
            yelpBreakfastItemsGlobal = yelpBreakfastItems;

            // Find yelp businesses with 'lunch' term
            if (doYelpLunchCalls) {
                return yelpApi.getYelpData(LUNCH, req.body.latlon, client, date, string_date, LUNCH_HOUR);
            }
            else {
                return noneItem;
            }

        }, function (err) {
            return err;
        })
        .catch(function (e) {
            console.log(e)
        }) // -------------------------- End yelp lunch restaurants search
        .then(function (yelpLunchItems) {
            yelpLunchItemsGlobal = yelpLunchItems;

            if (doYelpDinnerCalls) {
                return yelpApi.getYelpData(DINNER, req.body.latlon, client, date, string_date, DINNER_HOUR);
            }
            else {
                return noneItem;
            }

        }, function (err) {
            return err;
        }).catch(function (e) {
            console.log(e)
        }) // -------------------------- End yelp dinner restaurants search
        .then(function (yelpDinnerItems) {
            yelpDinnerItemsGlobal = yelpDinnerItems;

            if (doMeetupCalls) {
                // Fulfilled promise returned from getMeetupData is an array of object arrays
                return meetupApi.getMeetupData(req.body.latlon, date);
            }
            else {
                var meetupEvents = {
                    Event1: [],
                    Event2: [],
                    Event3: [],
                    Event4: []
                }; 
                meetupEvents.Event1.push({})
                meetupEvents.Event2.push({})
                meetupEvents.Event3.push({})
                meetupEvents.Event4.push({})
                return meetupEvents;
            }

        }, function (err) {
            return err;
        }).catch(function (e) {
            console.log(e)
        }) // -------------------------- End meetup event search
        .then(function (meetupEvents) {
            meetupItemsGlobal = meetupEvents;

            if (doSeatgeekCalls) {
                // Fulfilled promise returned from getSeatGeekData is an array of object arrays
                return seatgeekApi.getSeatGeekData(req.body.city, date);
            }
            else {
                var seatgeekEvents = {
                    Event1: [],
                    Event2: [],
                    Event3: [],
                    Event4: []
                }; 
                seatgeekEvents.Event1.push({})
                seatgeekEvents.Event2.push({})
                seatgeekEvents.Event3.push({})
                seatgeekEvents.Event4.push({})
                return seatgeekEvents;
            }

        }, function (err) {
            return err;
        }).catch(function (e) {
            console.log(e)
        })  // -------------------------- End seatgeek event search
        .then(function (seatgeekEvents) {
            seatgeekItemsGlobal = seatgeekEvents;

            if (doYelpEventCalls) {
                return yelpEventApi.getYelpEventData(date, req.body.latlon, client);
            }
            else {
                var yelpEvents = {
                    Event1: [],
                    Event2: [],
                    Event3: [],
                    Event4: []
                }; 
                yelpEvents.Event1.push({})
                yelpEvents.Event2.push({})
                yelpEvents.Event3.push({})
                yelpEvents.Event4.push({})
                return yelpEvents;
            }

        }, function (err) {
            return err;
        }).catch(function (e) {
            console.log(e)
        })  // -------------------------- End yelp event search
        .then(function (yelpEvents) {
            yelpEventsGlobal = yelpEvents;

            if (doEventbriteCalls) {
                return eventbriteApi.getEventbriteData(req.body.term, req.body.latlon, req.body.city, date);
            }
            else {
                var eventbriteEvents = {
                    Event1: [],
                    Event2: [],
                    Event3: [],
                    Event4: []
                }; 
                eventbriteEvents.Event1.push({})
                eventbriteEvents.Event2.push({})
                eventbriteEvents.Event3.push({})
                eventbriteEvents.Event4.push({})
                return eventbriteEvents;
            }

        }, function (err) {
            return err;
        }).catch(function (e) {
            console.log(e)
        })  // -------------------------- End eventbrite event search
        .then(function (eventbriteEvents) {

            eventbriteGlobal = eventbriteEvents;

            console.log("---------------------Seatgeek API returned data check---------------------")
            console.log(seatgeekItemsGlobal.Event1[0]);
            console.log(seatgeekItemsGlobal.Event2[0]);
            console.log(seatgeekItemsGlobal.Event3[0]);
            console.log(seatgeekItemsGlobal.Event4[0]);
            console.log("---------------------meetup API returned data check---------------------")
            console.log(meetupItemsGlobal.Event1[0]);
            console.log(meetupItemsGlobal.Event2[0]);
            console.log(meetupItemsGlobal.Event3[0]);
            console.log(meetupItemsGlobal.Event4[0]);
            console.log("---------------------yelp API returned data check---------------------")
            console.log(yelpBreakfastItemsGlobal[0]);
            console.log(yelpLunchItemsGlobal[0]);
            console.log(yelpDinnerItemsGlobal[0]);
            console.log("---------------------eventbrite API returned data check---------------------")
            console.log(eventbriteGlobal.Event1[0]);
            console.log(eventbriteGlobal.Event2[0]);
            console.log(eventbriteGlobal.Event3[0]);
            console.log(eventbriteGlobal.Event4[0]);

            // Consolidate all events by concatenation
            var events = {
                Event1: [],
                Event2: [],
                Event3: [],
                Event4: []
            };

            if (doMeetupCalls) {
                events.Event1 = events.Event1.concat(meetupItemsGlobal.Event1);
                events.Event2 = events.Event2.concat(meetupItemsGlobal.Event2);
                events.Event3 = events.Event3.concat(meetupItemsGlobal.Event3);
                events.Event4 = events.Event4.concat(meetupItemsGlobal.Event4);
            }
            if (doYelpEventCalls) {
                events.Event1 = events.Event1.concat(yelpEventsGlobal.Event1);
                events.Event2 = events.Event2.concat(yelpEventsGlobal.Event2);
                events.Event3 = events.Event3.concat(yelpEventsGlobal.Event3);
                events.Event4 = events.Event4.concat(yelpEventsGlobal.Event4);
            }
            if (doEventbriteCalls) {
                events.Event1 = events.Event1.concat(eventbriteGlobal.Event1);
                events.Event2 = events.Event2.concat(eventbriteGlobal.Event2);
                events.Event3 = events.Event3.concat(eventbriteGlobal.Event3);
                events.Event4 = events.Event4.concat(eventbriteGlobal.Event4);
            }
            if (doSeatgeekCalls) {
                events.Event1 = events.Event1.concat(seatgeekItemsGlobal.Event1);
                events.Event2 = events.Event2.concat(seatgeekItemsGlobal.Event2);
                events.Event3 = events.Event3.concat(seatgeekItemsGlobal.Event3);
                events.Event4 = events.Event4.concat(seatgeekItemsGlobal.Event4);
            }


            var itineraries = formatAllData(yelpBreakfastItemsGlobal,
                yelpLunchItemsGlobal,
                yelpDinnerItemsGlobal,
                events);

            if (!misc.isEmpty(itineraries) && itineraries != -1) {
                res.send(itineraries);
            }
            else {
                res.send([])
            }

        }, function (err) {
            return err;
        }).catch(function (e) {
            console.log(e)
        });
});


// ------------- Yelp API Stuff

// Get initial data length from Yelp
function getYelpDataLength(term_in, latlon_in) {
    return new Promise(function (resolve, reject) {
        client.search({
            term: term_in,
            location: latlon_in,
            limit: 50,
        }).then(response => {
            var total = response.jsonBody.total;
            console.log("yelp total: " + total)
            resolve(total);
        }).catch(e => {
            console.log(e);
            reject(-1);
        });
    });
}


// Format all data
function formatAllData(yelpBreakfastItems, yelpLunchItems, yelpDinnerItems, events) {
    try {
        var numYelpBreakfastItems = yelpBreakfastItems.length;
        var numYelpLunchItems = yelpLunchItems.length;
        var numYelpDinnerItems = yelpDinnerItems.length;
        var numEvent1 = events.Event1.length;
        var numEvent2 = events.Event2.length;
        var numEvent3 = events.Event3.length;
        var numEvent4 = events.Event4.length;
        console.log("---------------------formatAllData Function---------------------")
        console.log("numYelpBreakfastItems: " + numYelpBreakfastItems)
        console.log("numYelpLunchItems: " + numYelpLunchItems)
        console.log("numYelpDinnerItems: " + numYelpDinnerItems)
        console.log("events1: " + numEvent1)
        console.log("events2: " + numEvent2)
        console.log("events3: " + numEvent3)
        console.log("events4: " + numEvent4)
        var itineraries = [];

        if (numYelpBreakfastItems >= 0 &&
            numYelpLunchItems >= 0 &&
            numYelpDinnerItems >= 0 &&
            numEvent1 >= 0 &&
            numEvent2 >= 0 &&
            numEvent3 >= 0 &&
            numEvent4 >= 0) {
            var items;
            var key;
            for (var i = 0; i < 7; i++) {
                if (i == 0) {
                    key = 'Event1';
                    items = events.Event1;
                    items.push(noneItemEvent);
                } else if (i == 2) {
                    key = 'Event2';
                    items = events.Event2;
                    items.push(noneItemEvent);
                } else if (i == 4) {
                    key = 'Event3';
                    items = events.Event3;
                    items.push(noneItemEvent);
                } else if (i == 6) {
                    key = 'Event4';
                    items = events.Event4;
                    items.push(noneItemEvent);
                } else if (i == 1) {
                    key = 'Breakfast';
                    var tempYelpItems = yelpBreakfastItems;
                    // Add a none itinerary item at the end
                    tempYelpItems.push(noneItem);
                    items = tempYelpItems;
                } else if (i == 3) {
                    key = 'Lunch';
                    var tempYelpItems = yelpLunchItems;
                    // Add a none itinerary item at the end
                    tempYelpItems.push(noneItem);
                    items = tempYelpItems;
                } else {
                    key = 'Dinner';
                    var tempYelpItems = yelpDinnerItems;
                    // Add a none itinerary item at the end
                    tempYelpItems.push(noneItem);
                    items = tempYelpItems;
                }
                var itemObj = {};
                itemObj[key] = items;
                itineraries.push(itemObj);
            }
            return itineraries;
        } else {
            console.log("Not enough items")
            return -1;
        }
    }
    catch (e) {
        console.log('error in formatAllData')
        console.log(e)
    }
}



module.exports = apiRouter;
