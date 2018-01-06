'use strict';

const express = require('express');
const yelpRouter = express.Router();
const yelp = require('yelp-fusion');
const genAlgo = require('../GA.js');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
let client = yelp.client(process.env.API_KEY);

//Meetup
var meetup = require('../node_modules/meetup-api/lib/meetup')({
    key: process.env.MEETUP_KEY
});

//Search for business
yelpRouter.post('/', (req, res, next) => {

    var yelpItemsGlobal;
    var meetupItemsGlobal;

    // Promise Chain of API calls

    // 1. fulfilled promise returned from getYelpDataLength is the total businesses returned from the query
    getYelpDataLength(req.body.term, req.body.location).then(function (yelpTotal) {
        // 2. fulfilled promise returned from getYelpData is an array of object arrays        
        return getYelpData(yelpTotal, req.body.term, req.body.location);
    }, function (err) {
        return err;
    }).catch(function (e) {
        console.log(e)
    }).then(function (yelpItems) {
        yelpItemsGlobal = yelpItems;
        // 3. fulfilled promise returned from getYelpData is an array of object arrays
        return getMeetupData(req.body.location);
    }, function (err) {
        return err;
    }).catch(function (e) {
        console.log(e)
    }).then(function (meetupEvents) {
        var itineraries = formatAllData(yelpItemsGlobal,meetupEvents);
        if (!isEmpty(itineraries)) {            
            res.send(genAlgo.doGA(itineraries, req.body.budgetmax, req.body.budgetmin));
        }
    },function (err) {
        return err;
    }).catch(function (e) {
        console.log(e)
    });

    

});

// ------------- Meetup API Stuff

// Get  data from Meetup 
function getMeetupData(location_in) {
    return new Promise(function (resolve, reject) {
        try {

            //Initialize
            var latLongArray = procressLocationString(location_in);
            var meetupEventsTest = [];
            var meetupEvents = {
                Event1: [],
                Event2: [],
                Event3: [],
                Event4: []
            };
            var count = 0;
            var date = getDate(20); // a date x days from now (need to change to get input from user)
            var meetupFee;

            console.log("latLongArray[0]" + latLongArray[0])
            console.log("latLongArray[1]" + latLongArray[1])
            // API call
            meetup.getUpcomingEvents({
                lat: latLongArray[0],
                lon: latLongArray[1],
                radius: 'smart',
                order: 'time',
                end_date_range: date, 
                page: 50,
            }, function (error, events) {
                if (error) {
                    console.log(error);
                    reject(-1);
                } else {
                    var numOfEvents = events.events.length;                    
                    console.log(events.events[0])
                    for (var i = 0; i < numOfEvents; i++) {
                        
                        
                        // Get the event time
                        var time = events.events[i].time;
                        if (time) {                            
                            var dateObj = new Date(time);
                            time = processTime(dateObj.toString());
                        }
                        else {                            
                            time = '9999';
                        }
                        var timeFloat = parseFloat(time);

                        // Get the event fee/cost
                        meetupFee = 0;
                        // Some meetups don't cost anything. Only set meetupFee to fee parameter if there is one
                        if (!isEmpty(events.events[i].fee)) {
                            meetupFee = events.events[i].fee.amount;
                        }
                        var item = {
                            name: events.events[i].group.name+ ": " + events.events[i].name + " Time: " + time,
                            cost: meetupFee, 
                            rating: meetupFee*2 + 5, //need to change!!!!
                        }

                        // Categorize the events by time
                        if (time <= 200) {
                            meetupEvents.Event4.push(item);
                        }
                        else if (time <= 900) {
                            meetupEvents.Event1.push(item);
                        }
                        else if (time <= 1200) {
                            meetupEvents.Event2.push(item);
                        }
                        else if (time <= 1800) {
                            meetupEvents.Event3.push(item);
                        }
                        else if (time < 2400) {
                            meetupEvents.Event4.push(item);
                        }

                        // Add a "none" itinerary item
                        if (i == numOfEvents - 1) {
                            item = {
                                name: "None/Free Itinerary Slot",
                                cost: 0, 
                                rating: 2.5,
                            }
                            meetupEvents.Event1.push(item);
                            meetupEvents.Event2.push(item);
                            meetupEvents.Event3.push(item);
                            meetupEvents.Event4.push(item);
                        }
                    }

                    // resolve the promise
                    // returned object is a object of arrays of objects with keys:
                    //  Event1 ... Event4
                    resolve(meetupEvents);
                }
            });
        }
        catch (e) {
            console.log('error in getMeetupData')
            reject(-1);
        }
    });
}


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

// Get data from Yelp and format it
function getYelpData(total_in, term_in, location_in) {
    return new Promise(function (resolve, reject) {
        var total = total_in;
        var count = 0;
        var businesses = [];
        var itineraries = [];
        var numOfBiz = Math.floor(total / 50);
        var count = 0;

        for (var i = 0; i < total; i += 50) {
            client.search({
                term: term_in,
                location: location_in,
                limit: 50,
                offset: i,
            }).then(response => {
                response.jsonBody.businesses.forEach(business => {
                    switch (business.price) {
                        case '$':
                            business.price = 10;
                            break;
                        case '$$':
                            business.price = 20;
                            break;
                        case '$$$':
                            business.price = 46;
                            break;
                        case '$$$$':
                            business.price = 65;
                            break;
                        default:
                            business.price = 20;
                    }
                    var item = {
                        name: business.name,
                        cost: business.price,
                        rating: business.rating
                    }
                    businesses.push(item);
                });
                count++;

                if (count == Math.floor(total/50) ) {
                    resolve(businesses);
                }
                else if (numOfBiz == 0) {
                    resolve(businesses);
                }

            }).catch(e => {
                console.log(e);
                reject(-1);
            });
        }
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



// ------------- Misc functions

function getRndInteger(min, max) { // icluding min, excluding max
    return Math.floor(Math.random() * (max - min)) + min;
}

// Returns a date string in the YYYY-MM-DDTHH:MM:SS format with date x days ahead of today
function getDate(daysAhead) {
    var today = new Date();
    today.setDate(today.getDate() + daysAhead + 1);
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }
    return yyyy + '-' + mm + '-' + dd + 'T02:00:00'; // 2:00 am the next day
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

// Procresses the lat/long string and returns an array of two floats
function procressLocationString(locStr) {
    var splitLocStr = locStr.split(',');
    var lat = parseFloat(splitLocStr[0]);
    var long = parseFloat(splitLocStr[1]);
    var latLonArray = [lat, long];
    return latLonArray;
}

// Get the military time out from the date
// input format is like: Sun Dec 31 2017 10:00:00 GMT-0500 (STD)
function processTime(time) {
    time = time.substring(16,21); // hard coded !!! may want to do some checks
    return time = time.replace(":","");    
}
module.exports = yelpRouter;
