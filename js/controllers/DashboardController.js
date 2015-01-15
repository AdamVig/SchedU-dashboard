controllers.controller("DashboardController", ['$filter', '$activityIndicator', 'DataService', 'DatabaseFactory', 'ParseService', 'DateFactory', 'ChartService', function ($filter, $activityIndicator, DataService, DatabaseFactory, ParseService, DateFactory, ChartService) {

  var main = this;

  var date = DateFactory.currentDay();
  var dateString = date.format("MM-DD-YY");
  main.globals = {};
  main.charts = {};
  main.scheduleString = " ";

  $activityIndicator.startAnimating();

  // Get all schedules and current day's schedule
  DatabaseFactory.schedule.getAll().then(function (response) {

    main.allSchedules = $filter('orderBy')(
      DataService.extractDocs(response),
      function (schedule) {
        return moment(schedule._id, 'MM-DD-YY').format('X')
      },
      true
    );
    main.scheduleObject = _.findWhere(main.allSchedules, {'_id': dateString});
    main.scheduleString = ParseService.parseSchedule(main.scheduleObject);

    return DatabaseFactory.user.getAll();
  }).catch(function (e) {
    console.log("Error getting all schedules:", e);

  // Get all users and create user charts
  }).then(function (response) {

    main.allUsers = DataService.extractDocs(response);
    main.userCount = ParseService.countUsers(main.allUsers);
    main.charts.userGrades = ChartService.chartGrades(main.userCount);
    main.charts.userPlatforms = ChartService.chartPlatforms(main.allUsers);
    main.charts.userLoginsData = ChartService.chartLogins(main.allUsers);
    main.charts.userLogins = {
      "data": {
        'labels': _.keys(main.charts.userLoginsData),
        'datasets': [{
          'fillColor': 'hsla(115, 95%, 16%, 1)',
          'data': _.values(main.charts.userLoginsData)
        }]
      }
    };

    return DatabaseFactory.feedback.getAll();

  }).catch(function (e) {
    console.log("Error getting all users:", e);

    // Get all feedback items and create feedback items chart
  }).then(function (response) {

    main.feedbackItemsList = DataService.extractDocs(response);
    main.feedbackItems = ParseService.countFeedback(main.allUsers, main.feedbackItemsList);
    main.feedbackItems = $filter('orderBy')(_.toArray(main.feedbackItems), 'votes', 'reverse');;
    main.charts.feedbackItems = ChartService.chartFeedback(main.feedbackItems);

    return DatabaseFactory.versions.getAll();


  }).catch(function (e) {
    console.log("Error getting all feedback:", e);

    // Get all versions and latest version
  }).then(function (response) {

    main.allVersions = $filter('orderBy')(DataService.extractDocs(response), 'versionNumber', 'reverse');
    main.currentVersion = main.allVersions[0];

  }).catch(function (e) {
    console.log("Error getting all versions:", e);

  }).finally(function (response) {

    $activityIndicator.stopAnimating();

  });

}]);
