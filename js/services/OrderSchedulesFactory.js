services.factory('OrderSchedulesFactory', [function () {

  return function (schedule) {

    var date = schedule._id;

    if (!date) return '';

    var month = date.substring(0, 2);
    var day = date.substring(3, 5);
    var year = date.substring(6, 8);

    var dateSum = year + month + day;

    return dateSum;

  };
}]);
