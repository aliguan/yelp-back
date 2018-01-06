const misc = require('../miscfuncs/misc.js');

var meetup = require('../node_modules/meetup-api/lib/meetup')({
    key: process.env.MEETUP_KEY
});

module.exports = {
    // ------------- Meetup API Stuff
    // Get  data from Meetup
    getMeetupData: function(location_in) {
        //Meetup

        console.log(meetup);
        return new Promise(function (resolve, reject) {
            try {
                //Initialize
                var latLongArray = misc.processLocationString(location_in);
                var meetupEventsTest = [];
                var meetupEvents = {
                    Event1: [],
                    Event2: [],
                    Event3: [],
                    Event4: []
                };
                var count = 0;
                var date = misc.getDate(20); // a date x days from now (need to change to get input from user)
                var meetupFee;

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
                        for (var i = 0; i < numOfEvents; i++) {

                            // Get the event time
                            var time = events.events[i].time;
                            if (time) {
                                var dateObj = new Date(time);
                                time = misc.processTime(dateObj.toString());
                            }
                            else {
                                time = '9999';
                            }
                            var timeFloat = parseFloat(time);

                            // Get the event fee/cost
                            meetupFee = 0;
                            // Some meetups don't cost anything. Only set meetupFee to fee parameter if there is one
                            if (!misc.isEmpty(events.events[i].fee)) {
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
                console.log(e);
                console.log('error in getMeetupData')
                reject(-1);
            }
        });
    }

}
