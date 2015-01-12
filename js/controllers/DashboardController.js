controllers.controller("DashboardController", ['$scope', '$filter', '$activityIndicator', 'DataService', 'DatabaseFactory', 'ParseService', 'DateFactory', 'ChartDataService', 'OrderSchedulesFactory', function ($scope, $filter, $activityIndicator, DataService, DatabaseFactory, ParseService, DateFactory, ChartDataService, OrderSchedulesFactory) {

  var date = DateFactory.currentDay();
  var dateString = date.format("MM-DD-YY");
  $scope.charts = {};
  $scope.globals = {};
  $scope.scheduleString = " ";

  $activityIndicator.startAnimating();

  // Get all schedules and current day's schedule
  DatabaseFactory.schedule.getAll().then(function (response) {

    var schedules = DataService.extractDocs(response);
    $scope.allSchedules = $filter('orderBy')(schedules, OrderSchedulesFactory, true);
    $scope.scheduleObject = _.findWhere($scope.allSchedules, {'_id': dateString});
    $scope.scheduleString = ParseService.parseSchedule($scope.scheduleObject);

    return DatabaseFactory.user.getAll();

    // Get all users and create user charts
  }).then(function (response) {

    $scope.allUsers = DataService.extractDocs(response);
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

    return DatabaseFactory.feedback.getAll();

    // Get all feedback items and create feedback items chart
  }).then(function (response) {

    $scope.feedbackItemsList = DataService.extractDocs(response);
    $scope.feedbackItems = ParseService.countFeedback($scope.allUsers, $scope.feedbackItemsList);
    $scope.feedbackItems = ParseService.sortFeedbackItems($scope.feedbackItems);
    $scope.charts.feedbackItems = {
      "data": ChartDataService.parseFeedback($scope.feedbackItems)
    };

    return DatabaseFactory.versions.getAll();

    // Get all versions and latest version
  }).then(function (response) {
    
    var versions = DataService.extractDocs(response);
    $scope.versions = $filter('orderBy')(versions, 'versionNumber', 'reverse');
    $scope.currentVersion = $scope.versions[0];

  }).finally(function (response) {
    // Hide loader
    $activityIndicator.stopAnimating();

  });

}]);
