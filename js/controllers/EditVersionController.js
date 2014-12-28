controllers.controller("EditVersionCtrl", ['$scope', 'DataService', function ($scope, DataService) {
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
}]);
