const eventbrite = require('node-eventbrite');
const token = process.env.EVENTBRITE_TOKEN;
const misc = require('../miscfuncs/misc.js');

module.exports = {
    getEventbriteData: function(term_query, latlon, city=false) {
        // ACCESS EVENTBRITE API
        try {
            var ebapi = eventbrite({
                token: token,
                version: 'v3'
            });
        } catch (e) {
            console.log('EVENTBRITE AUTH ERROR -----> ' + e.message);
        }

        var coordinates = misc.processLocationString(latlon);

        var latitude = coordinates[0];
        var longitude = coordinates[1];
        console.log(latitude,longitude);
        // SEARCH EVENTBRITE API
        //FIRST API CALL TO FIND NUMBER OF PAGES OF RESULTs
        ebapi.search({
            q: term_query,
            location: {
                latitude: latitude,
                longitude: longitude,
                within: '25 mi',
            },
            start_date: {
                keyword: 'today'
            },
            page: 1,
        }, function(e, data) {
                // Handle first api call
                if(e) {
                    console.log('EVENTBRITE FIRSTCALL ERROR ----> ' + e.message);
                } else {
                    var eventbriteEvents = [];

                    data.events.forEach(function(event) {
                        var item = {
                            name: event.name.text,
                            cost: 0,
                            rating: 2.5,
                            // time: event.start,
                            // url: event.url,
                        }
                        eventbriteEvents.push(item);
                    });
                    console.log(data.pagination);
                    var pages = data.pagination.page_count;

                    for(var i = 2; i <= pages; i++ ) {
                        ebapi.search({
                            q: term_query,
                            location: {
                                latitude: latitude,
                                longitude: longitude,
                                within: '25 mi'
                            },
                            start_date: {
                                keyword: 'today'
                            },
                            page: i
                        }, function(e, data) {
                            console.log('------------------ page ---' + data.pagination.page_number);
                            data.events.forEach(function(event) {
                                var item = {
                                    name: event.name.text,
                                    cost: 0,
                                    rating: 2.5,
                                    // time: event.start,
                                    // url: event.url,
                                }
                                console.log(event.name.text);
                            });
                        });
                    }
                    // console.log(eventbriteEvents);
                }
            }
        );
    },
}
