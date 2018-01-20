'use strict';
const express = require('express');
const apiRouter = express.Router();
const yelp = require('yelp-fusion');
const genAlgo = require('../GA.js');
const yelpApi = require('../externalApis/yelpapi.js');
const meetupApi = require('../externalApis/meetupapi.js');
const seatgeekApi = require('../externalApis/seatgeekapi.js');
const eventbriteApi = require('../externalApis/eventbriteapi.js');
const yelpEventApi = require('../externalApis/yelpeventsapi.js');
const misc = require('../miscfuncs/misc.js');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
let client = yelp.client(process.env.API_KEY);

//Search for business
apiRouter.post('/', (req, res, next) => {

    var yelpItemsGlobal;
    var meetupItemsGlobal;
    var seatgeekItemsGlobal;
    var yelpEventsGlobal;
    var eventbriteGlobal
    var date = new Date(req.body.date);

    // Promise Chain of API calls

    // 1. fulfilled promise returned from getYelpDataLength is the total businesses returned from the query
    getYelpDataLength(req.body.term, req.body.latlon).then(
        function (yelpTotal) {
            // 2. fulfilled promise returned from getYelpData is an array of object arrays
            return yelpApi.getYelpData(yelpTotal, req.body.term, req.body.latlon, client);
        }, function (err) {
            return err;
        })
        .catch(function (e) {
            console.log(e)
        })
        .then(function (yelpItems) {
            yelpItemsGlobal = yelpItems;
            // 3. fulfilled promise returned from getMeetupData is an array of object arrays
            return meetupApi.getMeetupData(req.body.latlon, date);
        }, function (err) {
            return err;
        }).catch(function (e) {
            console.log(e)
        })
        .then(function (meetupEvents) {
            meetupItemsGlobal = meetupEvents;
            // 4. fulfilled promise returned from getSeatGeekData is an array of object arrays
            return seatgeekApi.getSeatGeekData(req.body.city, date);
        }, function (err) {
            return err;
        }).catch(function (e) {
            console.log(e)
        })
        .then(function (seatgeekEvents) {

            seatgeekItemsGlobal = seatgeekEvents;
           // return yelpEventApi.getYelpEventData(date, req.body.latlon, client);
           return 1;
        }, function (err) {
            return err;
        }).catch(function (e) {
            console.log(e)
        })
        .then(function (yelpEvents) {

            return eventbriteApi.getEventbriteData(req.body.term, req.body.latlon, req.body.city, date);

        }, function (err) {
            return err;
        }).catch(function (e) {
            console.log(e)
        }).then(function(eventbriteEvents) {

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
            console.log(yelpItemsGlobal[0]);
            console.log(yelpItemsGlobal[1]);
            console.log(yelpItemsGlobal[2]);
            console.log(yelpItemsGlobal[3]);
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
            events.Event1 = seatgeekItemsGlobal.Event1.concat(meetupItemsGlobal.Event1).concat(eventbriteGlobal.Event1);
            events.Event2 = seatgeekItemsGlobal.Event2.concat(meetupItemsGlobal.Event2).concat(eventbriteGlobal.Event2);
            events.Event3 = seatgeekItemsGlobal.Event3.concat(meetupItemsGlobal.Event3).concat(eventbriteGlobal.Event3);
            events.Event4 = seatgeekItemsGlobal.Event4.concat(meetupItemsGlobal.Event4).concat(eventbriteGlobal.Event4);

            var itineraries = formatAllData(yelpItemsGlobal, events);
            if (!misc.isEmpty(itineraries) && itineraries!= -1) {
                res.send(genAlgo.doGA(itineraries, req.body.budgetmax, req.body.budgetmin));
            }
            else {
                res.send(['No Itineraries found.','','','','','',''])
            }


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
function formatAllData(yelpItems, events) {
    try {
        var numYelpItems = yelpItems.length;
        var numEvent1  = events.Event1.length;
        var numEvent2  = events.Event2.length;
        var numEvent3  = events.Event3.length;
        var numEvent4  = events.Event4.length;
        console.log("---------------------formatAllData Function---------------------")
        console.log("numYelpItems: " + numYelpItems)
        console.log("events1: " + numEvent1)
        console.log("events2: " + numEvent2)
        console.log("events3: " + numEvent3)
        console.log("events4: " + numEvent4)
        var itemIntervalYelp = Math.floor(numYelpItems / 3);
        var itineraries = [];

        var noneItem = {
            name: "None/Free Itinerary Slot",
            cost: 0,
            rating: 2.5,
        }
        if (numYelpItems > 3 && numEvent1 > 0 && numEvent2 > 0 && numEvent3 > 0 && numEvent4 > 0) {
            var items;
            var key;
            for (var i = 0; i <= 7; i++) {
                if (i == 0) {
                    key = 'Event1';
                    items = events.Event1;
                } else if (i == 2) {
                    key = 'Event2';
                    items = events.Event2;
                } else if (i == 4) {
                    key = 'Event3';
                    items = events.Event3;
                } else if (i == 6) {
                    key = 'Event4';
                    items = events.Event4;
                } else if (i == 1) {
                    key = 'Breakfast';
                    var tempYelpItems = yelpItems.slice(0, itemIntervalYelp);
                    // Add a none itinerary item at the end
                    tempYelpItems.push(noneItem);
                    items = tempYelpItems;
                } else if (i == 3) {
                    key = 'Lunch';
                    var tempYelpItems = yelpItems.slice(itemIntervalYelp, itemIntervalYelp * 2);
                    // Add a none itinerary item at the end
                    tempYelpItems.push(noneItem);
                    items = tempYelpItems;
                } else {
                    key = 'Dinner';
                    var tempYelpItems = yelpItems.slice(itemIntervalYelp * 2, numYelpItems);
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
