controllers.controller("EditVersionController", ['$scope', 'DataService', 'DatabaseFactory', function ($scope, DataService, DatabaseFactory) {

  var editVersions = this;

  editVersions.submit = function () {

    editVersions.loading = true;

    // Add new change to changes array if it exists
    if (editVersions.newChange) {
      $scope.versions.currentVersion.changes.push({"value": editVersions.newChange});
      editVersions.newChange = "";
    }

    // Remove all empty values
    $scope.versions.currentVersion.changes = _.filter($scope.versions.currentVersion.changes, function (change) { return change.value; });

    // Remove $$hashKeys caused by ng-repeat
    var version = angular.copy($scope.versions.currentVersion);

    // Update version in database
    DatabaseFactory.versions.insert(version).then(function (response) {
      $scope.versions.currentVersion._rev = response.data.rev;
      editVersions.loading = false;
    });
  };
}]);
