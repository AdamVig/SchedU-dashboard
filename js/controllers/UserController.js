controllers.controller("UserController", ['$scope', function ($scope) {
  $scope.currentUserId = "";
  $scope.$watch("currentUserId", function (currentUserId) {
    $scope.currentUser = _.findWhere($scope.$parent.allUsers, {'_id': currentUserId} );
  });
}]);
