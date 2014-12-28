filters.filter('titleCase', [function() {
  return function(s) {
    s = ( s === undefined || s === null ) ? '' : s;
    return s.toString().toLowerCase().replace( /\b([a-z])/g, function(ch) {
      return ch.toUpperCase();
    });
  };
}])

.filter('date', [function () {

  return function (date) {

    if (!date) return '';

    var formattedDate = date;

    var month = date.substring(0,2);
    var day = date.substring(2, 4);
    var year = date.substring(4, 6);

    if (day) {
      formattedDate = month + "-" + day;
    }
    if (year) {
      formattedDate += "-" + year;
    }

    return formattedDate;
  };
}]);
