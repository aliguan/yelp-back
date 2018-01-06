module.exports = {
    // ------------- Misc functions

    getRndInteger: function(min, max) { // icluding min, excluding max
        return Math.floor(Math.random() * (max - min)) + min;
    },

    // Returns a date string in the YYYY-MM-DDTHH:MM:SS format with date x days ahead of today
    getDate: function(daysAhead) {
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
    },

    isEmpty: function(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    },

    // Processes the lat/long string and returns an array of two floats
    processLocationString: function(locStr) {
        var splitLocStr = locStr.split(',');
        var lat = parseFloat(splitLocStr[0]);
        var long = parseFloat(splitLocStr[1]);
        var latLonArray = [lat, long];
        return latLonArray;
    },

    // Get the military time out from the date
    // input format is like: Sun Dec 31 2017 10:00:00 GMT-0500 (STD)
    processTime: function (time) {
        time = time.substring(16,21); // hard coded !!! may want to do some checks
        return time = time.replace(":","");
    }
}
