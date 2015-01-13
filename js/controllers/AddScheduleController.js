controllers.controller("AddScheduleController", ['$scope', '$filter', 'DataService', 'ScheduleFactory', 'ParseService', 'dayLetters', 'DatabaseFactory', function ($scope, $filter, DataService, ScheduleFactory, ParseService, dayLetters, DatabaseFactory) {

  var addSchedules = this;

  // Set default value
  addSchedules.newSchedule = {};
  addSchedules.newSchedule.dayType = "normal";
  addSchedules.errorMessage = "";
  addSchedules.lastSchedule = {};

  // Fires on changes to add schedule form
  $scope.$watchCollection(angular.bind(addSchedules, function () {
    return addSchedules.newSchedule;
  }), function (newSchedule) {

    // Format date input
    addSchedules.newSchedule.date = $filter('date')(newSchedule.date);

    // Reject characters other than lowercase a-g from first period input
    var period = newSchedule.firstPeriod || "";
    addSchedules.newSchedule.firstPeriod = period.replace(/[^a-g]+/g, '');

    // Make schedule
    addSchedules.schedule = ScheduleFactory.make(newSchedule);
  });

  addSchedules.submit = function () {

    addSchedules.loading = true;

    DatabaseFactory.schedule.insert(addSchedules.schedule, addSchedules.schedule.date).then(function (response) {
      console.log(response);
      addSchedules.loading = false;
    });

    // Reset values
    addSchedules.newSchedule = {};
    addSchedules.newSchedule.dayType = "normal";

    // Focus date input
    document.getElementById('date-input').focus();
  };
}]);
