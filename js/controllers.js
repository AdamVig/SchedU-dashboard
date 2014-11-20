angular.module("dashboard.controllers", [ 'tc.chartjs', 'ngActivityIndicator' ])

.controller("DashboardCtrl", function ($scope, $filter, $activityIndicator, DataService, ParseService, DateFactory, ChartDataService, OrderSchedulesFactory) {

  var date = DateFactory.currentDay();
  var dateString = date.format("MM-DD-YY");
  $scope.charts = {};
  $scope.globals = {};
  $scope.scheduleString = " ";

  $activityIndicator.startAnimating();

  // Get all schedules and current day's schedule
  DataService.getAllSchedules().then(function (response) {
    $scope.allSchedules = $filter('orderBy')(response.data, OrderSchedulesFactory, true);
    $scope.scheduleObject = _.findWhere(response.data, {'_id': dateString});
    $scope.scheduleString = ParseService.parseSchedule($scope.scheduleObject);

    return DataService.getAllUsers();

  // Get all users and create user grades chart
  }).then(function (response) {
    $scope.allUsers = response.data;
    $scope.userCount = ParseService.countUsers($scope.allUsers);

    $scope.charts.userGrades = {
      "data": ChartDataService.parseUserGrades($scope.userCount),
      "options": {
        //Boolean - Whether we should show a stroke on each segment
        segmentShowStroke : true,
        //String - The colour of each segment stroke
        segmentStrokeColor : '#fff',

        //Number - The width of each segment stroke
        segmentStrokeWidth : 1
      }
    };

    return DataService.getFeedbackItems();

  // Get all feedback items and create feedback items chart
  }).then(function (response) {
    $scope.feedbackItemsList = response.data;
    $scope.feedbackItems = ParseService.countFeedback($scope.allUsers, $scope.feedbackItemsList);
    $scope.feedbackItems = ParseService.sortFeedbackItems($scope.feedbackItems);
    $scope.charts.feedbackItems = {
      "data": ChartDataService.parseFeedback($scope.feedbackItems),
      "options": {
        "legendTemplate": ""
      }
    };

    return DataService.getVersions();

  // Get all versions and latest version
  }).then(function (response) {
    $scope.versions = $filter('orderBy')(response.data, 'versionNumber', 'reverse');
    $scope.currentVersion = $scope.versions[0];

  }).finally(function (response) {
    // Hide loader
    $activityIndicator.stopAnimating();
  });
})

.controller("AddScheduleCtrl", function ($scope, DataService, ScheduleFactory, ParseService, dayLetters) {

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
})

.controller("ScheduleCtrl", function ($scope) {
  $scope.currentScheduleId = "";
  $scope.$watch("currentScheduleId", function (currentScheduleId) {
    $scope.currentSchedule = _.findWhere($scope.$parent.allSchedules, {'_id': currentScheduleId} );
  });
})

.controller("UserCtrl", function ($scope) {
  $scope.currentUserId = "";
  $scope.$watch("currentUserId", function (currentUserId) {
    $scope.currentUser = _.findWhere($scope.$parent.allUsers, {'_id': currentUserId} );
  });
})

.controller("VersionsCtrl", function ($scope) {
  $scope.currentVersionNumber = "";
  $scope.$watch("currentVersionNumber", function (currentVersionNumber) {
    $scope.currentVersion = _.findWhere($scope.versions, {'versionNumber': currentVersionNumber} );
  });

})

.controller("EditVersionCtrl", function ($scope, DataService) {
  $scope.submit = function () {
    
    $scope.loading = true;

    // Add new change to changes array if it exists
    if ($scope.newChange) {
      $scope.currentVersion.changes.push({"value": $scope.newChange});
      $scope.newChange = "";
    }

    // Remove all empty values
    $scope.currentVersion.changes = _.filter($scope.currentVersion.changes, function (change) { return change.value; });

    // Remove pesky $$hashKeys caused by ng-repeat
    var version = angular.copy($scope.currentVersion);

    // Update version in database
    DataService.updateVersion(version).then(function (response) {
      $scope.currentVersion._rev = response.data.rev;
      $scope.loading = false;
    });
  };
});

