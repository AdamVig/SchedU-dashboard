controllers.controller("AddScheduleController", ['$scope', 'DataService', 'ScheduleFactory', 'ParseService', 'dayLetters', function ($scope, DataService, ScheduleFactory, ParseService, dayLetters) {

  // Set default value
  $scope.addSchedule = {};
  $scope.addSchedule.dayType = "normal";
  $scope.errorMessage = "";
  $scope.lastSchedule = {};

  // Format date on change
  $scope.$watch("addSchedule.date", function (date){
    $scope.addSchedule.date = ParseService.formatDate(date);
  });

  // Format first period on change
  $scope.$watch("addSchedule.firstPeriod", function (period) {
    period = period || "";
    $scope.addSchedule.firstPeriod = period.replace(/[^a-g]+/g, '');
  });

  // Display inputted data as schedule as it is entered
  $scope.$watchCollection("addSchedule", function (addSchedule) {
    $scope.schedule = ScheduleFactory.make(addSchedule);
  });

  $scope.submit = function () {

    $scope.loading = true;

    DataService.addSchedule($scope.schedule).then(function (response) {
      console.log(response);
      $scope.loading = false;
    });

    // Reset values
    $scope.addSchedule = {};
    $scope.addSchedule.dayType = "normal";
  };
}]);
