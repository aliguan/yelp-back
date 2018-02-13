module.exports = {

    // Get data from Yelp and format it
    getYelpData: function (total_in, term_in, location_in, client) {
        return new Promise(function (resolve, reject) {

            var total = total_in;
            if (total > 250) {
                total = 250;
            }
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
                    var url = '';
                    var logoUrl = '';
                    var description = '';
                    var name = '';
                    var time = '';
                    var date = '';
                    var businessLocation ='';
                    response.jsonBody.businesses.forEach(business => {
                        // if (count==0) {
                        //     console.log(business)
                        //     count=1;
                        // }
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

                        // Collect url
                        if (business.url) {
                            url = business.url;
                        }

                        // Collect image
                        if (business.image_url) {
                            logoUrl = business.image_url;
                        }

                        // Collect description
                        if (business.phone) {
                            description = business.phone;
                        }

                        // Collect location information
                        businessLocation = location_in;

                        if (business.location) {
                            if (business.coordinates) {
                                // businessLocation = business.coordinates.latitude + "," + business.coordinates.longitude;
                                businessLocation = {
                                    lat: business.coordinates.latitude,
                                    lng: business.coordinates.longitude
                                }
                            } else if (business.location.address1 &&
                                business.location.city &&
                                business.location.state &&
                                business.location.zip_code) {
                                businessLocation = business.location.address1 + "," +
                                    business.location.city + "," +
                                    business.location.state + "," +
                                    business.location.zip_code;
                            } else {
                                businessLocation = location_in
                            }

                        }


                        var item = {
                            name: business.name,
                            cost: business.price,
                            rating: business.rating,
                            url: url,
                            time: time,
                            date: date,
                            thumbnail: logoUrl,
                            description: description,
                            location: businessLocation,
                        }
                        businesses.push(item);
                    });
                    count++;

                    if (count == Math.floor(total / 50)) {
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
