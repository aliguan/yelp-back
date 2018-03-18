// Currently only returns 20 results max, and only searches for parks within a 50 mile radius
// Only searching parks because it is difficult to price the other returned places because there 
// is no pricing data 


const misc = require('../miscfuncs/misc.js');
var GooglePlaces = require('googleplaces');
const GOOGLE_PLACES_OUTPUT_FORMAT = "json"
var googlePlaces = new GooglePlaces(process.env.GOOGLE_API_KEY, GOOGLE_PLACES_OUTPUT_FORMAT);
const RADIUS = 80467.2; //meters (50 miles)
const GPRATING_BASE = 10.5; // Base rating for a google place event
const RATING_INCR = 0.0;

module.exports = {
    getGooglePlacesData: function (location_in) {
        return new Promise(function (resolve, reject) {
            try {
                console.log(location_in)
                var googlePlacesEvent = {
                    Event1: [],
                    Event2: [],
                    Event3: [],
                    Event4: []
                };

                var parameters = {
                    location: location_in,
                    type: "park",
                    radius: RADIUS,
                };
                googlePlaces.placeSearch(parameters, function (error, response) {
                    if (error) {
                        console.log(error);
                        reject(-1);
                    } else {

                        var numOfPlaces = response.results.length;
                        var placeCnt = 0;
                        var cost = 20;
                        var rating = 0;
                        var url = '';
                        var logoUrl = '';
                        var description = 'Park/Outdoors';
                        var name = '';
                        var date = '';
                        var placeLocation = '';

                        for (var i = 0; i < numOfPlaces; i++) {

                            // Collect the name of the event
                            if (response.results[i].name) {
                                name = response.results[i].name;
                            }

                            // Collect location information
                            if (response.results[i].location) {

                                if (response.results[i].location.lat) {                                    
                                    placeLocation = {
                                        lat: response.results[i].location.lat,
                                        lng: response.results[i].location.lon
                                    }
                                } 
                            }

                            if (response.results[i].rating) {
                                rating = response.results[i].rating;
                            }
                            rating = misc.round2NearestHundredth(rating);

                            var timernd = Math.floor(Math.random() * 2); //random number: 0 or 1

                            if (timernd == 1) {
                                time = '0700';
                            }
                            else {
                                time = '1500';
                            }

                            var item = {
                                name: "gp: " + time + "/" + date+", " + name + ", " + url,
                                cost: cost,
                                rating: GPRATING_BASE,
                                url: url,
                                time: time,
                                date: date,
                                thumbnail: logoUrl,
                                description: description,
                                location: placeLocation, // lat lon
                            }

                            if (time && rating > 4.0) {
                                // Categorize the events by time
                                if (time <= 200) {
                                    googlePlacesEvent.Event4.push(item);
                                    placeCnt++;
                                }
                                else if (time <= 900) {
                                    googlePlacesEvent.Event1.push(item);
                                    placeCnt++;
                                }
                                else if (time <= 1200) {
                                    googlePlacesEvent.Event2.push(item);
                                    placeCnt++;
                                }
                                else if (time <= 1800) {
                                    googlePlacesEvent.Event3.push(item);
                                    placeCnt++;
                                }
                                else if (time < 2400) {
                                    googlePlacesEvent.Event4.push(item);
                                    placeCnt++;
                                }
                            }                            
                        }
                        console.log("number of google places: " + placeCnt)
                        resolve(googlePlacesEvent);
                    }
                });
            }
            catch (e) {
                console.log(e);
                console.log('error in getGooglePlacesData')
                reject(-1);
            }
        });

    }
}