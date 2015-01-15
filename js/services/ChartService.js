services.service('ChartService', [function() {

  /**
   * Create pie chart data array from user grades
   * @param  {object} userCount Object containing total, seniors, juniors, sophomores,
   *                            freshmen, and teachers
   * @return {array}            List of objects each containing value, color, highlight,
   *                            and label
   */
  this.chartGrades = function(userCount) {

    var userGrades = [{
        'value': userCount['9'],
        'color': 'hsla(283, 39%, 53%, 1)',
        'highlight': 'hsla(283, 39%, 53%, 0.75)',
        'label': 'freshmen'
      }, {
        'value': userCount['10'],
        'color': 'hsla(6, 78%, 57%, 1)',
        'highlight': 'hsla(6, 78%, 57%, 0.75)',
        'label': 'sophomores'
      }, {
        'value': userCount['11'],
        'color': 'hsla(48, 89%, 50%, 1)',
        'highlight': 'hsla(48, 89%, 50%, 0.75)',
        'label': 'juniors'
      }, {
        'value': userCount['12'],
        'color': 'hsla(204, 70%, 53%, 1)',
        'highlight': 'hsla(204, 70%, 53%, 0.75)',
        'label': 'seniors'
      }, {
        'value': userCount['teacher'],
        'color': 'hsla(145, 63%, 49%, 1)',
        'highlight': 'hsla(145, 63%, 49%, 0.75)',
        'label': 'teachers'
      }, {
        'value': userCount['test'],
        'color': 'hsla(28, 80%, 52%, 1.0)',
        'highlight': 'hsla(28, 80%, 52%, 0.75)',
        'label': 'test'
      }

    ];

    return {
      "data": userGrades,
      "options": {
        //Boolean - Whether we should show a stroke on each segment
        segmentShowStroke : true,
        //String - The colour of each segment stroke
        segmentStrokeColor : '#fff',
        //Number - The width of each segment stroke
        segmentStrokeWidth : 1
      }
    };
  };

  /**
   * Create bar chart data array from feedback items
   * @param  {array} feedbackItems Object with keys being the _id of each feedback item;
   *                               each feedback item object contains _id, name, and votes
   * @return {object}              Object containing list of labels, fillColor, and data
   */
  this.chartFeedback = function(feedbackItems) {
    var labels = [];
    var votes = [];

    feedbackItems.map(function(feedbackItem, index) {

      labels.push(index + 1);
      votes.push(feedbackItem.votes);

    });

    var data = {
      'labels': labels,
      'datasets': [{
        'fillColor': 'hsla(115, 95%, 16%, 1)',
        'data': votes
      }]
    };

    return {
      "data": data
    };
  };

  /**
   * Create pie chart data of user platform usage
   * @param {array} allUsers Array of user objects containing _id, firstName, lastName,
   *                         phoneNumber, grade, and feedback; which contains voteItems
   *                         and number of votes left
   * @return {array}         List of objects each containing value, color, highlight,
   *                         and label
   */
  this.chartPlatforms = function(allUsers) {
    var data = [{
      'value': 0,
      'color': 'hsla(74, 55%, 50%, 1)',
      'highlight': 'hsla(74, 55%, 50%, 0.75)',
      'label': 'android'
    }, {
      'value': 0,
      'color': 'hsla(211, 100%, 50%, 1)',
      'highlight': 'hsla(211, 100%, 50%, 0.75)',
      'label': 'ios'
    }];

    allUsers.map(function(user) {
      if (user.usage) {
        try {
          _.findWhere(data, {
            'label': user.usage.platform.name
          }).value++;
        } catch (e) {
          console.error("Platform not supported:", user.usage.platform.name);
        }
      }
    });

    return {
      "data": data,
      "options": {
        //Boolean - Whether we should show a stroke on each segment
        segmentShowStroke : true,
        //String - The colour of each segment stroke
        segmentStrokeColor : '#fff',
        //Number - The width of each segment stroke
        segmentStrokeWidth : 1
      }
    };
  };

  /**
   * Convert login timestamp to relative time span
   * @param {string}  loginTime MM-DD-YY H:M:Sp
   * @return {string}           Difference between loginTime and current time
   *                            expressed as relative string, ex: "1 hour"
   */
  function parseLoginTime(loginTime) {

    loginTime = moment(loginTime, "MM-DD-YY h:m:sa");
    var rightNow = moment();

    var timeDiff = moment.duration(rightNow.diff(loginTime));
    var timeDiffHours = timeDiff.asHours();
    var timeDiffDays = timeDiff.asDays();
    var timeString = "";

    if (timeDiffHours < 1) timeString = "1 hour";
    else if (timeDiffHours < 6) timeString = "6 hours";
    else if (timeDiffDays < 1) timeString = "1 day";
    else if (timeDiffDays < 2) timeString = "2 days";
    else if (timeDiffDays < 7) timeString = "1 week";
    else if (timeDiffDays < 30) timeString = "< 1 month";
    else timeString = "> 1 month";

    return timeString;
  }

  /**
   * Create bar graph data of user login times
   * @param {array} allUsers Array of user objects containing _id, firstName, lastName,
   *                         phoneNumber, grade, and feedback; which contains voteItems
   *                         and number of votes left
   * @return {object}        Object containing loginTime labels and number of users
   *                         for each loginTime
   */
  this.chartLogins = function(allUsers) {

    var data = {
      "1 hour": 0,
      "6 hours": 0,
      "1 day": 0,
      "2 days": 0,
      "1 week": 0,
      "< 1 month": 0,
      "> 1 month": 0
    };

    allUsers.map(function(user) {
      if (user.usage) {
        var loginTime = parseLoginTime(user.usage.lastOpen);
        data[loginTime]++;
      }
    });

    return data;
  };

}]);
