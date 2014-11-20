angular.module("dashboard", ["dashboard.controllers", "dashboard.services"])

.constant("dbUrl", "https://schedu:G3tSch3dU@schedu.cloudant.com/")

.constant("dayLetterColors", {
  "A": "#D362E8",
  "B": "#2ecc71",
  "C": "#e67e22",
  "D": "#9b59b6",
  "E": "#e74c3c",
  "F": "#f1c40f",
  "G": "#3498db",
  "Sp": "#34495e"
})

.constant("dayLetters", [
  "a", "b", "c", "d", "e", "f", "g"
])

.directive("periodBlock", function () {

  return {
    restrict: 'EA', // Can only be called by element and attribute name
    scope: {
      period: '='
    },
    replace: true,
    link: function (scope, element, attrs) {
      if (scope.period.length == 1) {
        scope.period = scope.period.toUpperCase();
      } else {
        scope.period = "Sp"; // Special
      }
    },
    template: '<li class="period-block inline-block center {{period | lowercase}}-period">{{period}}</li>'
  };
})

.directive("submitButton", function () {

  return {
    restrict: 'E', // Can only be called by element name
    scope: {
      text: '@text',
      classes: '@classes'
    },
    replace: true,
    templateUrl: 'templates/submit-button.html'
  };
})


.filter('titleCase', function() {
  return function(s) {
    s = ( s === undefined || s === null ) ? '' : s;
    return s.toString().toLowerCase().replace( /\b([a-z])/g, function(ch) {
        return ch.toUpperCase();
    });
  };
})

.filter('date', function () {
      
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
});
