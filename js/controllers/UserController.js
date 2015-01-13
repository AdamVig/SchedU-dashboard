controllers.controller("UserController", ['$scope', function ($scope) {
  
  var users = this;
  users.currentUserId = "";
  $scope.$watch(angular.bind(users, function () {
    return users.currentUserId;
  }), function (currentUserId) {
    users.currentUser = _.findWhere($scope.main.allUsers, {'_id': users.currentUserId} );
  });
}]);
