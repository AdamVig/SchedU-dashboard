controllers.controller("ScheduleController", ['$scope', function ($scope) {
  
  var schedules = this;
  schedules.currentScheduleId = "";
  $scope.$watch(angular.bind(schedules, function () {
    return schedules.currentScheduleId;
  }), function (currentScheduleId) {
    schedules.currentSchedule = _.findWhere($scope.main.allSchedules, {'_id': schedules.currentScheduleId} );
  });
}]);
