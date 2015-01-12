controllers.controller("VersionsController", ['$scope', 'DataService', 'DatabaseFactory', function ($scope, DataService, DatabaseFactory) {
  $scope.currentVersionNumber = "";
  $scope.$watch("currentVersionNumber", function (currentVersionNumber) {
    $scope.currentVersion = _.findWhere($scope.versions, {'versionNumber': currentVersionNumber} );
  });

  $scope.addVersion = function () {
    $scope.loading = true;

    var version = {
      "versionNumber": $scope.newVersionNumber,
      "date": "",
      "changes": []
    };

    DatabaseFactory.versions.insert(version).then(function (response) {

      return DatabaseFactory.versions.get(response.data.id);

    }).then(function (response) {

      // Add new version to scope
      $scope.versions.unshift(response.data);

      // Reset values
      $scope.newVersionNumber = "";
      $scope.loading = false;

    });
  };
}]);
