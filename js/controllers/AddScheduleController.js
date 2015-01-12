controllers.controller("AddScheduleController", ['$scope', 'DataService', 'ScheduleFactory', 'ParseService', 'dayLetters', 'DatabaseFactory', function ($scope, DataService, ScheduleFactory, ParseService, dayLetters, DatabaseFactory) {

  // Set default value
  $scope.addSchedule = {};
  $scope.addSchedule.dayType = "normal";
  $scope.errorMessage = "";
  $scope.lastSchedule = {};

  // Fires on changes to add schedule form
  $scope.$watchCollection("addSchedule", function (addSchedule) {

    // Format date input
    $scope.addSchedule.date = ParseService.formatDate(addSchedule.date);

    // Reject characters other than lowercase a-g from first period input
    var period = addSchedule.firstPeriod || "";
    $scope.addSchedule.firstPeriod = period.replace(/[^a-g]+/g, '');

    // Make schedule
    $scope.schedule = ScheduleFactory.make(addSchedule);
  });

  $scope.submit = function () {

    $scope.loading = true;

    DatabaseFactory.schedule.insert($scope.schedule, $scope.schedule.date).then(function (response) {
      console.log(response);
      $scope.loading = false;
    });

    // Reset values
    $scope.addSchedule = {};
    $scope.addSchedule.dayType = "normal";

    // Focus date input
    document.getElementById('date-input').focus();
  };
}]);
