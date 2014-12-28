services.service("DataService", ['$q', 'dbUrl', 'ParseService', function ($q, dbUrl, ParseService) {

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

}]);
