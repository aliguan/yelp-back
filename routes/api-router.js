'use strict';

const express = require('express');
const apiRouter = express.Router();
const yelp = require('yelp-fusion');
const genAlgo = require('../GA.js');
const yelpApi = require('../externalApis/yelpapi.js');
const meetupApi = require('../externalApis/meetupapi.js');
const misc = require('../miscfuncs/misc.js');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
let client = yelp.client(process.env.API_KEY);

//Search for business
apiRouter.post('/', (req, res, next) => {

    var yelpItemsGlobal;
    var meetupItemsGlobal;

    // Promise Chain of API calls

    // 1. fulfilled promise returned from getYelpDataLength is the total businesses returned from the query
    getYelpDataLength(req.body.term, req.body.location).then(
        function (yelpTotal) {
            // 2. fulfilled promise returned from getYelpData is an array of object arrays
            return yelpApi.getYelpData(yelpTotal, req.body.term, req.body.location, client);
        }, function (err) {
            return err;
        })
        .catch(function (e) {
            console.log(e)
        })
        .then(function (yelpItems) {
            yelpItemsGlobal = yelpItems;
            // 3. fulfilled promise returned from getYelpData is an array of object arrays
            return meetupApi.getMeetupData(req.body.location);
        }, function (err) {
            return err;
        }).catch(function (e) {
            console.log(e)
    }).then(function (meetupEvents) {
        var itineraries = formatAllData(yelpItemsGlobal,meetupEvents);
        if (!misc.isEmpty(itineraries)) {
            res.send(genAlgo.doGA(itineraries, req.body.budgetmax, req.body.budgetmin));
        }
    },function (err) {
        return err;
    }).catch(function (e) {
        console.log(e)
    });



});


// ------------- Yelp API Stuff

// Get initial data length from Yelp
function getYelpDataLength(term_in, location_in) {
    return new Promise(function (resolve, reject) {
        client.search({
            term: term_in,
            location: location_in,
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
function formatAllData(yelpItems, meetupItems) {
    try {
        var numYelpItems = yelpItems.length;
        var numEvent1  = meetupItems.Event1.length;
        var numEvent2  = meetupItems.Event2.length;
        var numEvent3  = meetupItems.Event3.length;
        var numEvent4  = meetupItems.Event4.length;
        console.log("numYelpItems: " + numYelpItems)
        console.log("numMeetupItems1: " + numEvent1)
        console.log("numMeetupItems2: " + numEvent2)
        console.log("numMeetupItems3: " + numEvent3)
        console.log("numMeetupItems4: " + numEvent4)
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
                    items = meetupItems.Event1;
                } else if (i == 2) {
                    key = 'Event2';
                    items = meetupItems.Event2;
                } else if (i == 4) {
                    key = 'Event3';
                    items = meetupItems.Event3;
                } else if (i == 6) {
                    key = 'Event4';
                    items = meetupItems.Event4;
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
            return itineraries;
        }
    }
    catch (e) {
        console.log('error in formatAllData')
        console.log(e)
    }
}



module.exports = apiRouter;
