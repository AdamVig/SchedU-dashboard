services.service("ParseService", ['$filter', function ($filter) {

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

}]);
