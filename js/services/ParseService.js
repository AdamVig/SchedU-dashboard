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
  * Counts users total and by grade
  * @param  {array} allUsers Array of user objects containing _id, firstName, lastName,
  *                          phoneNumber, grade, and feedback; which contains voteItems
  *                          and number of votes left
  * @return {object}         Object containing total, seniors, juniors, sophomores,
  *                          freshmen, and teachers
  */
  this.countUsers = function (allUsers) {

    var testUsers = _.where(allUsers, {"test": true});
    allUsers = _.without(allUsers, testUsers);

    var userCount = {
      "total": allUsers.length - testUsers.length,
      "12": 0,
      "11": 0,
      "10": 0,
      "9": 0,
      "test": 0,
      "teacher": 0
    };

    allUsers.map(function (user) {
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

    allUsers.map(function (user) {
      user.feedback.voteItems.map(function (feedbackItem) {
        _.findWhere(feedbackItems, {'_id': feedbackItem}).votes++;
      });
    });

    return feedbackItems;
  };

}]);
