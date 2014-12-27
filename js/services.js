angular.module("dashboard.services", [])

.service("DataService", ['$q', 'dbUrl', 'ParseService', function ($q, dbUrl, ParseService) {

  // Create database objects
  var userDb = new PouchDB(dbUrl + "user");
  var scheduleDb = new PouchDB(dbUrl + "schedule");
  var feedbackDb = new PouchDB(dbUrl + "feedback");
  var versionsDb = new PouchDB(dbUrl + "versions");

  /**
   * Retrieve list of feedback items from database
   * @return {array} Object with keys being the _id of each feedback item;
   *                 each feedback item object contains _id, name, and votes
   */
  this.getFeedbackItems = function () {

    // Setup promise
    var request = $q.defer();

    feedbackDb.allDocs({include_docs: true}, function (error, data) {

      if (error == null) {
        error = false;
      }

      data = ParseService.parseFeedbackItems(data.rows);

      // Resolve promise
      request.resolve({"data": data, "error": error});
    });

    return request.promise;
  };

  /**
   * Adds the given field to each user in the users database
   * @param {object} field    Data to add to each user
   * @param {array} allUsers  Array of user objects containing _id, _rev, firstName, lastName,
   *                          phoneNumber, grade, and feedback; which contains voteItems
   *                          and number of votes left
   */
  this.addFieldToUsers = function (field) {

    // Setup promise
    var request = $q.defer();

    userDb.allDocs({include_docs: true}, function (error, data) {

      if (error == null) {
        error = false;
      }

      _.each(data.docs, function (metaDoc) {

      });

      // Resolve promise
      request.resolve({"data": data, "error": error});
    });

    return request.promise;
  };

  /**
   * Retrieve list of all user data objects from database
   * @return {array} Array of user objects containing _id, _rev, firstName, lastName,
   *                 phoneNumber, grade, and feedback; which contains voteItems
   *                 and number of votes left
   */
  this.getAllUsers = function () {
    // Setup promise
    var request = $q.defer();

    userDb.allDocs({include_docs: true}, function (error, data) {

      if (error == null) {
        error = false;
      }

      data = ParseService.simplifyAllDocs(data.rows);

      // Resolve promise
      request.resolve({"data": data, "error": error});
    });

    return request.promise;
  };

  /**
   * Retrieve list of all schedule objects from database
   * @return {array} Array of schedule objects containing _id, _rev,
   *                 periodOrder (array), dayNumber (int, 1-8) and
   *                 special (string or false), and maybe holiday (string)
   */
  this.getAllSchedules = function () {
    // Setup promise
    var request = $q.defer();

    scheduleDb.allDocs({include_docs: true}, function (error, data) {

      if (error == null) {
        error = false;
      }

      data = ParseService.simplifyAllDocs(data.rows);

      // Resolve promise
      request.resolve({"data": data, "error": error});
    });

    return request.promise;
  };

  /**
   * Retrieve schedule for date from database
   * @param  {string} date      Date to get schedule for, format: MM-DD-YY
   * @return {schedule object}  Schedule object containing periodOrder (array),
   *                            dayNumber (int, 1-8) and special (string or false)
   */
  this.getSchedule = function (date) {
    // Setup promise
    var request = $q.defer();

    scheduleDb.get(date, function (error, data) {

      if (error == null) {
        error = false;
      }

      // Resolve promise
      request.resolve({"data": data, "error": error});
    });

    return request.promise;
  };

  /**
   * Add schedule object to schedule database
   * @param {schedule object} schedule Schedule object containing id (mm-dd-yy format), dayNumber,
   *                                   periodOrder, and special. If special = "holiday", contains holiday
   * @return {response object}         Response object containing data and error
   */
  this.addSchedule = function (schedule) {
    // Setup promise
    var request = $q.defer();

    scheduleDb.put(schedule, schedule.id, function (error, data) {

      if (error == null) {
        error = false;
      }

      // Resolve promise
      request.resolve({"data": data, "error": error});
    });

    return request.promise;
  };

  /**
   * Retrieve all versions from database
   * @return {array} List of version objects, each containing _id, _rev,
   *                 date (string, MM-DD-YY), and changes (array)
   */
  this.getVersions = function () {

    // Setup promise
    var request = $q.defer();

    versionsDb.allDocs({include_docs: true}, function (error, data) {

      if (error == null) {
        error = false;
      }

      data = ParseService.simplifyAllDocs(data.rows);

      // Resolve promise
      request.resolve({"data": data, "error": error});
    });

    return request.promise;
  };

  /**
   * Retrieve schedule for date from database
   * @param  {string} versionId ID of version doc
   * @return {version object}  Version object containing _id, _rev, versionNumber,
   *                            date (string, MM-DD-YY), and changes (array)
   */
  this.getVersion = function (versionId) {
    // Setup promise
    var request = $q.defer();

    versionsDb.get(versionId, function (error, data) {

      if (error == null) {
        error = false;
      }

      // Resolve promise
      request.resolve({"data": data, "error": error});
    });

    return request.promise;
  };

  /**
   * Add version to versions database
   * @param {version object} version Version object containing versionNumber,
   *                                 date (string, MM-DD-YY), and changes (array)
   * @return {object}                Data and error from request
   */
  this.addVersion = function (version) {
    // Setup promise
    var request = $q.defer();

    versionsDb.post(version, function (error, data) {

      if (error == null) {
        error = false;
      }

      // Resolve promise
      request.resolve({"data": data, "error": error});
    });

    return request.promise;
  };

  /**
   * Update version in versions database
   * @param {version object} version Version object containing _id, _rev, versionNumber,
   *                                 date (string, MM-DD-YY), and changes (array)
   * @return {object}                Data and error from request
   */
  this.updateVersion = function (version) {
    // Setup promise
    var request = $q.defer();

    versionsDb.put(version, version._id, version._rev, function (error, data) {

      if (error == null) {
        error = false;
      }

      // Resolve promise
      request.resolve({"data": data, "error": error});
    });

    return request.promise;
  };

}])

.service("ParseService", ['$filter', function ($filter) {

  /**
   * Parses schedule object into A1 notation using the first period from
   * periodOrder and the day number. False if first period is more than one
   * letter long or if period order doesn't exist.
   * @param  {object} scheduleObject Schedule object containing periodOrder,
   *                                 dayNumber, special (and holiday if applicable)
   * @return {string or boolean}     Schedule as string in A1 notation or false if
   *                                 schedule object doesn't have a period order
   */
  this.parseSchedule = function(scheduleObject) {
    var scheduleString = false;

    // Period order exists in schedule object
    if (scheduleObject.periodOrder) {

      var dayLetter = scheduleObject.periodOrder[0];

      // Is a single letter
      if (dayLetter.length == 1) {
        dayLetter = dayLetter.toUpperCase();
        scheduleString = dayLetter + scheduleObject.dayNumber;
      }
    } else if (scheduleObject.holiday) {
      scheduleString = scheduleObject.holiday;
    }

    return scheduleString;
  };

  /**
   * Creates object out of feedbackItems where the index of each item
   * is its _id string from the database; makes searching in the
   * controller simpler
   * @param  {array} feedbackItemsDatabase Array of meta-doc objects containing doc, _id, and key;
   *                                       each doc is a feedback item object containing _id, _rev,
   *                                       name, and votes
   * @return {object}                      Object with keys being the _id of each feedback item;
   *                                       each feedback item object contains _id, name, and votes
   */
  this.parseFeedbackItems = function (feedbackItemsDatabase) {
    var feedbackItems = {};

    _.each(feedbackItemsDatabase, function (metaDoc) {
      feedbackItems[metaDoc.id] = {
        "_id": metaDoc.id,
        "name": metaDoc.doc.name,
        "votes": metaDoc.doc.votes
      };
    });

    return feedbackItems;
  };

  /**
   * Converts feedback items object into an array then sorts them by votes
   * @param  {object} feedbackItems Object with keys being the _id of each feedback item;
   *                                each feedback item object contains _id, name, and votes
   * @return {array}                Array of feedback items ordered by votes
   */
  this.sortFeedbackItems = function (feedbackItems) {

    var feedbackItemsArray = [];

    _.each(feedbackItems, function (feedbackItem) {
      feedbackItemsArray.push(feedbackItem);
    });

    feedbackItemsArray = $filter('orderBy')(feedbackItemsArray, 'votes', 'reverse');

    return feedbackItemsArray;
  };

  /**
   * Simplify allDocs array down to basic docs
   * @param  {array} allDocs Array of objects, containing metadata
   *                         about docs and docs themselves
   * @return {[type]}         [description]
   */
  this.simplifyAllDocs = function (allDocs) {

    var docs = [];

    _.each(allDocs, function (metaDoc) {
      docs.push(metaDoc.doc);
    });

    return docs;

  };

  /**
   * Logs days with missing schedules to the console,
   * logs the day of week of days with schedules
   * @param  {array} allSchedules   Array of schedule objects
   * @param  {integer} daysForward  How many days to look for schedules
   *                                on, starting from today
   */
  this.findMissingSchedules = function (allSchedules, daysForward) {

    var today = moment();
    daysForward = daysForward || 100;

    for (var i = 0; i < daysForward; i++) {

      today.add(1, 'days');

      // Not weekend
      if (today.day() != 0 && today.day() != 6) {

        var dateString = today.format('MM-DD-YY');
        var schedule = _.find(allSchedules, function (schedule) {
          if (schedule._id == dateString) {
            return true;
          } else {
            return false;
          }
        });

        if (schedule) {
          console.log(today.day());
        } else {
          console.log("MISSING:" + dateString);
        }
      }

    };
  };

  /**
   * Counts users total and by grade
   * @param  {array} allUsers Array of user objects containing _id, firstName, lastName,
   *                          phoneNumber, grade, and feedback; which contains voteItems
   *                          and number of votes left
   * @return {object}         Object containing total, seniors, juniors, sophomores,
   *                          freshmen, and teachers
   */
  this.countUsers = function (allUsers) {

    var testUsers = _.where(allUsers, {"test": true});

    var userCount = {
      "total": allUsers.length - testUsers.length,
      "12": 0,
      "11": 0,
      "10": 0,
      "9": 0,
      "test": 0,
      "teacher": 0
    };

    _.each(allUsers, function (user) {
      if (user.grade && user.test !== true) {
        userCount[user.grade.toString()]++;
      } else if (user.test == true) {
        userCount.test++;
      }
    });
    return userCount;
  };

  /**
   * Counts how many votes for each feedback item
   * @param  {object} allUsers  Array of user objects containing _id, firstName, lastName,
   *                            phoneNumber, grade, and feedback; which contains voteItems
   *                            and number of votes left
   * @param  {object} feedbackItems Object with keys being the _id of each feedback item;
   *                                each feedback item object contains _id, name, and votes
   * @return {feedbackItemsArray}   Object with keys being the _id of each feedback item;
   *                                each feedback item object contains _id, name, and votes,
   *                                DIFFERENT FROM INPUT because each votes key has a value
   */
  this.countFeedback = function (allUsers, feedbackItems) {

    // List of all users from database,
    // user is a full user data object
    _.each(allUsers, function (user) {

      // List of feedback items voted on by user,
      // feedbackItem is a string of the ID of the item
      _.each(user.feedback.voteItems, function (feedbackItem) {

        // Add a vote
        feedbackItems[feedbackItem].votes++;

      });
    });

    return feedbackItems;

  };

  /**
   * Format date into mm-dd-yy format
   * @param  {string} date Date string, 0-8 characters long
   * @return {string}      Formatted date, in partial/whole mm-dd-yy format
   */
  this.formatDate = function (date) {

    date = date || "";

    // Reject any characters not 0-9
    date = date.replace(/[^0-9]+/g, '');

    // Add dashes
    date = $filter('date')(date);

    return date;
  };

}])

.service('ChartDataService', [function () {

  /**
   * Create pie chart data array from user grades
   * @param  {object} userCount Object containing total, seniors, juniors, sophomores,
   *                            freshmen, and teachers
   * @return {array}            List of objects each containing value, color, highlight,
   *                            and label
   */
  this.parseUserGrades = function (userCount) {

    var userGrades = [
      {
        'value': userCount['9'],
        'color': 'hsla(283, 39%, 53%, 1)',
        'highlight': 'hsla(283, 39%, 53%, 0.75)',
        'label': 'freshmen'
      },
      {
        'value': userCount['10'],
        'color': 'hsla(6, 78%, 57%, 1)',
        'highlight': 'hsla(6, 78%, 57%, 0.75)',
        'label': 'sophomores'
      },
      {
        'value': userCount['11'],
        'color': 'hsla(48, 89%, 50%, 1)',
        'highlight': 'hsla(48, 89%, 50%, 0.75)',
        'label': 'juniors'
      },
      {
        'value': userCount['12'],
        'color': 'hsla(204, 70%, 53%, 1)',
        'highlight': 'hsla(204, 70%, 53%, 0.75)',
        'label': 'seniors'
      },
      {
        'value': userCount['teacher'],
        'color': 'hsla(145, 63%, 49%, 1)',
        'highlight': 'hsla(145, 63%, 49%, 0.75)',
        'label': 'teachers'
      },
      {
        'value': userCount['test'],
        'color': 'hsla(28, 80%, 52%, 1.0)',
        'highlight': 'hsla(28, 80%, 52%, 0.75)',
        'label': 'test'
      }

    ];

    return userGrades;
  };

  /**
   * Create bar chart data array from feedback items
   * @param  {array} feedbackItems Object with keys being the _id of each feedback item;
   *                               each feedback item object contains _id, name, and votes
   * @return {object}              Object containing list of labels, fillColor, and data
   */
  this.parseFeedback = function (feedbackItems) {
    var labels = [];
    var votes = [];

    _.each(feedbackItems, function (feedbackItem, index) {

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

    return data;
  };

  /**
   * Create pie chart data of user platform usage
   * @param {array} allUsers Array of user objects containing _id, firstName, lastName,
   *                         phoneNumber, grade, and feedback; which contains voteItems
   *                         and number of votes left
   * @return {array}         List of objects each containing value, color, highlight,
   *                         and label
   */
  this.parseUserPlatforms = function (allUsers) {
    var data = [
      {
        'value': 0,
        'color': 'hsla(74, 55%, 50%, 1)',
        'highlight': 'hsla(74, 55%, 50%, 0.75)',
        'label': 'android'
      },
      {
        'value': 0,
        'color': 'hsla(211, 100%, 50%, 1)',
        'highlight': 'hsla(211, 100%, 50%, 0.75)',
        'label': 'ios'
      }
    ];

    _.each(allUsers, function (user) {

      // Make sure user has usage data
      if (user.usage) {

        // Add one to count of users on this platform
        if (_.findWhere(data, {'label': user.usage.platform.name})) {
          _.findWhere(data, {'label': user.usage.platform.name}).value++;
        }
      }
    });

    return data;
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
  this.parseUserLogins = function (allUsers) {

    var data = {
      "1 hour": 0,
      "6 hours": 0,
      "1 day": 0,
      "2 days": 0,
      "1 week": 0,
      "< 1 month": 0,
      "> 1 month": 0
    };

    _.each(allUsers, function (user) {

      // Make sure user has platform data
      if (user.usage) {

        // Convert from a timestamp to a relative time
        var loginTime = parseLoginTime(user.usage.lastOpen);

        // Add one to count of users with this login time
        data[loginTime]++;
      }
    });

    return data;
  };

}])

.factory('ScheduleFactory', ['dayLetters', '$filter', function (dayLetters, $filter) {

  /**
   * Make period order based on first period letter and day type
   * @param  {string}  firstPeriod    Single letter representing first period
   * @param  {boolean} activityPeriod True if activity period day type, false otherwise
   * @return {array or boolean}   Array, ex: ['a'->'g'] or false if firstPeriod = null
   */
  function makePeriodOrder(firstPeriod, activityPeriod) {

    // Will trigger infinite loop if not defined
    if (firstPeriod) {

      // Unsorted list of period letters
      // dayLetters : constant, ["a"-"g"]
      var periodOrder = dayLetters;

      // While list isn't sorted
      while (periodOrder[0] != firstPeriod) {

        // Shift first letter to end of list
        var letter = periodOrder[0];
        periodOrder.splice(0, 1);
        periodOrder.push(letter);
      }

      if (activityPeriod) {
        periodOrder.splice(2, 0, "Activity Period");
      }

    // firstPeriod not defined
    } else {
      periodOrder = false;
    }

    return periodOrder;
  }

  return {

    /**
     * Create schedule object from add schedule form data
     * @param  {object} addScheduleForm Data from add schedule form, can include:
     *                                  id, firstPeriod, dayNumber, dayType, holidayName
     * @return {schedule object}        Schedule object potentially including _id,
     *                                  dayNumber, periodOrder, special, and holiday
     */
    make: function (addScheduleForm) {

      var schedule = {
        "_id": addScheduleForm.date,
        "special": addScheduleForm.dayType
      };

      // Add day number if it exists
      if (addScheduleForm.dayNumber) {
        schedule.dayNumber = addScheduleForm.dayNumber;
      }

      // If only first period provided:
      // Generate period order based on first period,
      // add activity period if necessary
      if (addScheduleForm.dayType == "normal" ||
          addScheduleForm.dayType == "activityperiod") {

        // Decide if activity period
        if (addScheduleForm.dayType == "activityperiod") {
          var activityPeriod = true;
        } else {
          var activityPeriod = false;
          schedule.special = false;
        }

        schedule.periodOrder = makePeriodOrder(addScheduleForm.firstPeriod, activityPeriod);

      // If period order exists in form data
      // (early release, custom, early release activity period):
      // 1. Remove null values from period order
      // 2. Convert single letters to lowercase and
      //    special period names to title case
      } else if (addScheduleForm.periods) {

        schedule.periodOrder = _.compact(addScheduleForm.periods);
        _.each(schedule.periodOrder, function (period, index) {
          if (period.length == 1) {
            schedule.periodOrder[index] = period.toLowerCase();
          } else if (period.length > 1) {
            schedule.periodOrder[index] = $filter("titleCase")(period);
          }
        });

      // If holiday exists in form data:
      // Add title case holiday name to schedule
      } else if (addScheduleForm.dayType == "holiday") {

        schedule.holiday = $filter("titleCase")(addScheduleForm.holidayName);

      // Can't make schedule
      } else {

        schedule = false;
      }

      return schedule;
    }
  }
}])

.factory('OrderSchedulesFactory', [function () {

  return function (schedule) {

    var date = schedule._id;

    if (!date) return '';

    var month = date.substring(0, 2);
    var day = date.substring(3, 5);
    var year = date.substring(6, 8);

    var dateSum = year + month + day;

    return dateSum;

  };
}])

.factory('DateFactory', ['dismissal', function (dismissal) {

  /**
  * If day is a weekend, change date to next Monday
  * @param  {moment} day Moment object
  * @return {moment}     Moment object
  */
  function skipWeekend(day) {

    // Saturday
    if (day.weekday() == 6) {
      day.add(2, 'days');

      // Sunday
    } else if (day.weekday() == 0) {
      day.add(1, 'days');
    }

    return day;
  }

  return {

    /**
    * Gets today's date if not weekend, next
    * Monday's date if weekend; tomorrow's date if after
    * dismissal time
    * @return {moment object} Moment() of the current school
    *                         day's date
    */
    currentDay: function () {

      currentDay = moment();
      currentDay = skipWeekend(currentDay);

      if (currentDay.isAfter(dismissal)) {
        currentDay.add(1, 'days');
      }

      return currentDay;
    },

    /**
    * Return next non-weekend day after today
    * @return {moment object} Moment() of the next day's date
    */
    nextDay: function () {

      nextDay = moment().add(1, 'days');

      nextDay = skipWeekend(nextDay);

      return nextDay;
    },

    /**
    * Return previous day
    * @return {moment object} Moment() of the previous day's date
    */
    previousDay: function () {

      previousDay = moment().subtract(1, 'days');

      return previousDay;
    },

    /**
     * Format date into weekday and full date format,
     * ex: todaysDate = September 27; dayOfWeek = Wednesday
     * @param  {string} date Date in format MM-DD-YY
     * @return {object}      Object containing todaysDate and
     *                       dayOfWeek as strings
     */
    formatDate: function (date) {
      var todaysDate = date.format("MMMM D");
      var dayOfWeek = date.format("dddd");

      return {
        "todaysDate": todaysDate,
        "dayOfWeek": dayOfWeek
      };
    }
  }
}]);
