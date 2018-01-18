module.exports = {

    // Get data from Yelp and format it
    getYelpData: function(total_in, term_in, location_in, client) {
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
}
