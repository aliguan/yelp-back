const misc = require('../miscfuncs/misc.js');

const meetup = require('../node_modules/meetup-api/lib/meetup')({
    key: process.env.MEETUP_KEY
});
const MURATING_FACT = 1*0/100; // The bigger this is, the more the price of the event increases the rating
const MURATING_BASE = 10.5; // Base rating for a meetup event
const RATING_INCR = 0.0;
const LATENIGHT_TIME = 400; //event 4 time slot (4 a.m.)
const EVENT1_TIME = 900;
const EVENT2_TIME = 1200;
const EVENT3_TIME = 1800;
const EVENT4_TIME = 2400;

module.exports = {
    // ------------- Meetup API Stuff
    // Get  data from Meetup
    getMeetupData: function (location_in, date_in) {
        //Meetup
        return new Promise(function (resolve, reject) {
            try {
                //Initialize
                var latLongArray = misc.processLocationString(location_in);
                var meetupEvents = {
                    Event1: [],
                    Event2: [],
                    Event3: [],
                    Event4: []
                };
                var dateEnd = misc.getDate(date_in, 0); // returns a string with a date in the format:
                // YYYY-MM-DDTHH:MM:SS of the date_in + 1 date at 2:00 am
                // i.e. if date_in is wed, jan 10, 2018, 9 pm.
                // The returned date is jan 11, 2018, 2 am.
                var today = misc.getDate(date_in, -1);
                var meetupFee;

                // API call
                meetup.getUpcomingEvents({
                    lat: latLongArray[0],
                    lon: latLongArray[1],
                    radius: 'smart',
                    order: 'time',
                    end_date_range: dateEnd,
                    start_date_range: today, // default start date and time is the current date and time
                    page: 100,
                }, function (error, events) {
                    if (error) {
                        console.log(error);
                        reject(-1);
                    } else {
                        var numOfEvents = events.events.length;
                        var eventCnt = 0;
                        var cost = 0;
                        var rating = 0;
                        var url = '';
                        var logoUrl = '';
                        var description = '';
                        var name = '';
                        var date = '';
                        var eventLocation = '';

                        for (var i = 0; i < numOfEvents; i++) {

                            // Get the event time
                            var time = events.events[i].local_time;
                            if (time) {
                                time = misc.processTimeMU(time,0,5);
                            }
                            else {
                                time = events.events[i].time+events.events[i].utc_offset;
                                //console.log(events.events[i])
                                if (time) {
                                    var dateObj = new Date(time);
                                    //console.log(dateObj)
                                    time = misc.processTimeMU(dateObj.toUTCString(),17,22); //Sat, 12 May 2018 18:00:00 GMT
                                }
                                else {
                                    time = '9999';
                                }
                            }
                            var timeFloat = parseFloat(time);

                            // Get the event fee/cost
                            meetupFee = 0;
                            // Some meetups don't cost anything. Only set meetupFee to fee parameter if there is one
                            if (!misc.isEmpty(events.events[i].fee)) {
                                meetupFee = events.events[i].fee.amount;
                            }
                            meetupFee = misc.round2NearestHundredth(meetupFee);

                            // Give the event a rating
                            rating = MURATING_BASE; // base rating for a meetup event
                            url = '';
                            logoUrl = '';
                            description = '';
                            name = '';
                            date = '';
                            eventLocation = '';
                            rating = rating + meetupFee*MURATING_FACT;

                            if (events.events[i].link && events.events[i].link !== '') {
                                rating = rating + RATING_INCR;
                                url = events.events[i].link;
                            }

                            if (events.events[i].description && !misc.isEmpty(events.events[i].description)) {
                                if (events.events[i].description.length) {
                                    if (events.events[i].description.length <= 1000 && events.events[i].description.length > 0) {
                                        description = events.events[i].description;
                                    }
                                }

                            }

                            // Collect the name of the event
                            if (events.events[i].name && events.events[i].group.name) {
                                name = events.events[i].group.name + ": " + events.events[i].name;
                            }
                            else if (events.events[i].name || events.events[i].group.name) {
                                if (events.events[i].name) {
                                    name = events.events[i].name;
                                }
                                else {
                                    name = events.events[i].group.name;
                                }

                            }

                            // Collec the date
                            if (events.events[i].local_date) {
                                date = events.events[i].local_date;
                            }

                            // Collect location information
                            if (events.events[i].venue) {

                                if (events.events[i].venue.lat) {
                                    // eventLocation = events.events[i].venue.lat + "," + events.events[i].venue.lon;
                                    eventLocation = {
                                        lat: events.events[i].venue.lat,
                                        lng: events.events[i].venue.lon
                                    }
                                } else if (events.events[i].venue.address_1 && events.events[i].venue.city &&
                                events.events[i].venue.state && events.events[i].venue.zip) {
                                    eventLocation = events.events[i].venue.address_1 + "," +
                                    events.events[i].venue.city + "," +
                                    events.events[i].venue.state + "," +
                                    events.events[i].venue.zip;
                                }
                                rating =rating + RATING_INCR;
                            }
                            else if (events.events[i].group) {
                                if (events.events[i].group.lat ) {
                                    // eventLocation = events.events[i].group.lat + "," + events.events[i].group.lon;
                                    eventLocation = {
                                        lat: events.events[i].group.lat,
                                        lng: events.events[i].group.lon
                                    }
                                    rating = rating + RATING_INCR/2.0;
                                }
                            }

                            rating = misc.round2NearestHundredth(rating);
                            var item = {
                                name: "mu: " + time + "/" + date+ ", "+ name + ", " + url,
                                cost: meetupFee,
                                rating: rating,
                                url: url,
                                time: time,
                                date: date,
                                thumbnail: logoUrl,
                                description: description,
                                location: eventLocation, // either lat lon or address of venue, or lat lon or group
                            }

                            if (events.events[i].local_time || events.events[i].time) {
                                // Categorize the events by time
                                if (time <= LATENIGHT_TIME) {
                                    meetupEvents.Event4.push(item);
                                    eventCnt++;
                                }
                                else if (time <= EVENT1_TIME) {
                                    meetupEvents.Event1.push(item);
                                    eventCnt++;
                                }
                                else if (time <= EVENT2_TIME) {
                                    meetupEvents.Event2.push(item);
                                    eventCnt++;
                                }
                                else if (time <= EVENT3_TIME) {
                                    meetupEvents.Event3.push(item);
                                    eventCnt++;
                                }
                                else if (time < EVENT4_TIME) {
                                    meetupEvents.Event4.push(item);
                                    eventCnt++;
                                }
                            }

                        }

                        console.log("number of meetup events: " + eventCnt)
                        // resolve the promise
                        // returned object is a object of arrays of objects with keys:
                        //  Event1 ... Event4
                        resolve(meetupEvents);
                    }
                });
            }
            catch (e) {
                console.log(e);
                console.log('error in getMeetupData')
                reject(-1);
            }
        });
    }

}
