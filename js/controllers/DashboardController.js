controllers.controller("DashboardCtrl", ['$scope', '$filter', '$activityIndicator', 'DataService', 'ParseService', 'DateFactory', 'ChartDataService', 'OrderSchedulesFactory', function ($scope, $filter, $activityIndicator, DataService, ParseService, DateFactory, ChartDataService, OrderSchedulesFactory) {

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

    // Get all users and create user charts
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

    $scope.charts.userPlatforms = {
      "data": ChartDataService.parseUserPlatforms($scope.allUsers),
      "options": {
        //Boolean - Whether we should show a stroke on each segment
        segmentShowStroke : true,
        //String - The colour of each segment stroke
        segmentStrokeColor : '#fff',
        //Number - The width of each segment stroke
        segmentStrokeWidth : 1
      }
    };

    $scope.charts.userLoginsData = ChartDataService.parseUserLogins($scope.allUsers);

    $scope.charts.userLogins = {
      "data": {
        'labels': _.keys($scope.charts.userLoginsData),
        'datasets': [{
          'fillColor': 'hsla(115, 95%, 16%, 1)',
          'data': _.values($scope.charts.userLoginsData)
        }]
      }
    };

    return DataService.getFeedbackItems();

    // Get all feedback items and create feedback items chart
  }).then(function (response) {
    $scope.feedbackItemsList = response.data;
    $scope.feedbackItems = ParseService.countFeedback($scope.allUsers, $scope.feedbackItemsList);
    $scope.feedbackItems = ParseService.sortFeedbackItems($scope.feedbackItems);
    $scope.charts.feedbackItems = {
      "data": ChartDataService.parseFeedback($scope.feedbackItems)
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

}]);
