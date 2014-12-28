services.factory('ScheduleFactory', ['dayLetters', '$filter', function(dayLetters, $filter) {

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
    make: function(addScheduleForm) {

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
      if (addScheduleForm.dayType == "normal" || addScheduleForm.dayType == "activityperiod") {

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
        _.each(schedule.periodOrder, function(period, index) {
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
}]);
