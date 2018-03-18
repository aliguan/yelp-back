const MISC = require('../miscfuncs/misc.js');

module.exports = {

    // Get data from Yelp and format it
    getYelpData: function (term_in, location_in, client, date, string_date, hours_offset) {
        return new Promise(function (resolve, reject) {
            const HOURS_TO_SECONDS = 3600;

            var date_substring = string_date.substring(4,16);
            var unix_time = new Date(date_substring).getTime()/1000 + hours_offset*HOURS_TO_SECONDS;
            unix_time = parseInt(unix_time);
            // console.log("term_in: " + term_in)
            // console.log("location_in: " + location_in)
            // console.log("date_substring: " + date_substring)
            var businesses = [];

                client.search({
                    term: term_in,
                    //open_at: unix_time,
                    location: location_in,                    
                    limit: 50,
                    offset: 0,
                }).then(response => {
                    var url = '';
                    var logoUrl = '';
                    var description = '';
                    var name = '';
                    var time = '';
                    var date = '';
                    var businessLocation ='';
                    //console.log(response)
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
                            name: "ye: " + business.name,
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

                    resolve(businesses);

                }).catch(e => {
                    console.log(e);
                    reject(-1);
                });
        });
    }
}
