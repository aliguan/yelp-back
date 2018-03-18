const MISC = require('../miscfuncs/misc.js');
const LATENIGHT_TIME = 400; //event 4 time slot (4 a.m.)
const EVENT1_TIME = 900;
const EVENT2_TIME = 1200;
const EVENT3_TIME = 1800;
const EVENT4_TIME = 2400;
module.exports = {

    // Get event data from Yelp and format it
    getYelpEventData: function (date_in, location_in, client) {
        return new Promise(function (resolve, reject) {

            var yelpEvents = {
                Event1: [],
                Event2: [],
                Event3: [],
                Event4: []
            };            
            var dateEnd = MISC.getDate(date_in, 0); 
            var dateEndObj = new Date(dateEnd);
            var dateEndFloat = Math.floor(dateEndObj.getTime() / 1000);
            //console.log(dateEnd)
            //console.log(dateEndFloat)

            var today = MISC.getDate(date_in, -1);
            var todayObj = new Date(today);
            var todayFloat = Math.floor(todayObj.getTime() / 1000);
            //console.log(today)
            //console.log(todayFloat)

            client.eventsearch({
                location: location_in,
                limit: 50, // maximum is 50 but can use offset to increase returned results
                start_date: todayFloat,
                end_date: dateEndFloat,
            }).then(response => {
                var eventCnt = 0;
                response.jsonBody.events.forEach(event => {
                    //console.log(event);

                    // Get the event time
                    var time = event.time_start;
                    if (time) {
                        var dateObj = new Date(time);
                        time = MISC.processTime(dateObj.toString());
                    }
                    else {
                        time = '9999';
                    }
                    var timeFloat = parseFloat(time);

                    var eventCost = 0.0;
                    if (!event.is_free) {
                        if (event.cost_max) {
                            eventCost = event.cost_max; // prioritize max event cost
                        }
                        else if (event.cost) {
                            eventCost = event.cost;
                        }
                    }
                    var item = {
                        name: "yelp evnt: " + event.name + ", " + event.event_site_url + ", " + event.time_start +"/" + event.time_end,
                        cost: eventCost,
                        rating: eventCost * 0 + 5
                    }

                    // Categorize the events by time
                    if (time <= LATENIGHT_TIME) {
                        yelpEvents.Event4.push(item);
                        eventCnt++;
                    }
                    else if (time <=  EVENT1_TIME) {
                        yelpEvents.Event1.push(item);
                        eventCnt++;
                    }
                    else if (time <= EVENT2_TIME) {
                        yelpEvents.Event2.push(item);
                        eventCnt++;
                    }
                    else if (time <= EVENT3_TIME) {
                        yelpEvents.Event3.push(item);
                        eventCnt++;
                    }
                    else if (time < EVENT4_TIME) {
                        yelpEvents.Event4.push(item);
                        eventCnt++;
                    }

                });
console.log("number of yelp events: " + eventCnt);
                resolve(yelpEvents);

            }).catch(e => {
                console.log(e);
                reject(-1);
            });

        });
    }
}
