controllers.controller("VersionController", ['$scope', 'DataService', 'DatabaseFactory', function ($scope, DataService, DatabaseFactory) {

  var versions = this;
  this.currentVersionNumber = "";
  $scope.$watch(angular.bind(versions, function () {
    return versions.currentVersionNumber;
  }), function (currentVersionNumber) {
    versions.currentVersion = _.findWhere($scope.main.allVersions, {'versionNumber': versions.currentVersionNumber} );
  });

  this.addVersion = function () {
    $scope.loading = true;

    var version = {
      "versionNumber": $scope.main.allVersions.newVersionNumber,
      "date": "",
      "changes": []
    };

    DatabaseFactory.versions.insert(version).then(function (response) {

      return DatabaseFactory.versions.get(response.data.id);

    }).then(function (response) {

      // Add new version to scope
      $scope.main.allversions.unshift(response.data);

      // Reset values
      versions.newVersionNumber = "";
      versions.loading = false;

    });
  };
}]);
