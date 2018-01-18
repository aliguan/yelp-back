module.exports = {

    // Get event data from Yelp and format it
    getYelpEventData: function (date_in, location_in, client) {
        return new Promise(function (resolve, reject) {

            var events = [];

            client.eventsearch({
                location: location_in,
                limit: 50,
            }).then(response => {

                response.jsonBody.events.forEach(event => {
                    console.log(event)
                    var eventCost = 0.0;
                    if (event.cost) {
                        eventCost = event.cost;
                    }
                    var item = {
                        name: event.name,
                        cost: eventCost,
                        rating: eventCost * 2 + 5
                    }
                    events.push(item);
                });

                resolve(events);

            }).catch(e => {
                console.log(e);
                reject(-1);
            });

        });
    }
}
