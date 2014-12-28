dashboard.directive("periodBlock", [function () {

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
}])

.directive("submitButton", [function () {

  return {
    restrict: 'E', // Can only be called by element name
    scope: {
      text: '@text',
      classes: '@classes'
    },
    replace: true,
    templateUrl: 'html/_submit-button.html'
  };
}]);
