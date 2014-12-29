controllers.controller("ScheduleController", ['$scope', function ($scope) {
  $scope.currentScheduleId = "";
  $scope.$watch("currentScheduleId", function (currentScheduleId) {
    $scope.currentSchedule = _.findWhere($scope.$parent.allSchedules, {'_id': currentScheduleId} );
  });
}]);
