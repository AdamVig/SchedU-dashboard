controllers.controller("DashboardController", ['$scope', '$filter', '$activityIndicator', 'DataService', 'DatabaseFactory', 'ParseService', 'DateFactory', 'ChartService', function ($scope, $filter, $activityIndicator, DataService, DatabaseFactory, ParseService, DateFactory, ChartService) {

  var date = DateFactory.currentDay();
  var dateString = date.format("MM-DD-YY");
  $scope.charts = {};
  $scope.globals = {};
  $scope.scheduleString = " ";

  $activityIndicator.startAnimating();

  // Get all schedules and current day's schedule
  DatabaseFactory.schedule.getAll().then(function (response) {

    $scope.allSchedules = $filter('orderBy')(
      DataService.extractDocs(response),
      function (schedule) {
        return moment(schedule._id, 'MM-DD-YY').format('X')
      },
      true
    );
    $scope.scheduleObject = _.findWhere($scope.allSchedules, {'_id': dateString});
    $scope.scheduleString = ParseService.parseSchedule($scope.scheduleObject);

    return DatabaseFactory.user.getAll();

  // Get all users and create user charts
  }).then(function (response) {

    $scope.allUsers = DataService.extractDocs(response);
    $scope.userCount = ParseService.countUsers($scope.allUsers);

    $scope.charts.userGrades = ChartService.chartGrades($scope.userCount);
    $scope.charts.userPlatforms = ChartService.chartPlatforms($scope.allUsers);
    $scope.charts.userLoginsData = ChartService.chartLogins($scope.allUsers);
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
    $scope.feedbackItems = $filter('orderBy')(_.toArray($scope.feedbackItems), 'votes', 'reverse');;
    $scope.charts.feedbackItems = ChartService.chartFeedback($scope.feedbackItems);

    return DatabaseFactory.versions.getAll();

    // Get all versions and latest version
  }).then(function (response) {

    var versions = DataService.extractDocs(response);
    $scope.versions = $filter('orderBy')(versions, 'versionNumber', 'reverse');
    $scope.currentVersion = $scope.versions[0];

  }).finally(function (response) {

    $activityIndicator.stopAnimating();
    
  });

}]);
