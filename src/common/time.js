
import * as fn from 'date-fns';

export const simpleDate = date => fn.format(date, "yyyyMMdd-hhmmss");

let __lastGeneratedID = null;
export const generateID = () => {
  const timeString = simpleDate(new Date());
  let newID = timeString;
  // if we generate multiple IDs in one second, we add "-n" where n is 1,2,...
  // the only time this causes collisions is if you add a card, refresh, add a card within 1s
  if (__lastGeneratedID !== null && __lastGeneratedID.substring(0, timeString.length) === newID) {
    if (__lastGeneratedID.length === timeString.length) newID += "-1";
    else newID += '-' + (parseInt(__lastGeneratedID.substring(timeString.length + 1, __lastGeneratedID.length)) + 1)
  }
  __lastGeneratedID = newID;
  return newID;
}

/**
 * Returns a heavily abbreviated pretty printed date using date-fns
 * - Only includes time if within a week and not midnight
 * - Only includes minutes if nonzero
 * - Replaces date with "Tomorrow", "Next Fri" or "Last Wed", etc.
 */
export const prettyPrintDate = epochMilliseconds => {
  const date = new Date(epochMilliseconds);
  const now = new Date();

  const getDate = date => {
    const diff = fn.differenceInCalendarDays(date, now);
    const weekDiff = fn.differenceInCalendarWeeks(date, now, { weekStartsOn: 1 });
    const yearDiff = fn.differenceInCalendarYears(date, now);
    // 0 is Monday
    let dayOfWeek = now.getDay() - 1;
    // JavaScript's modulo is broken for negatives, so we must use an if statement
    if (dayOfWeek < 0) dayOfWeek += 7;

    // Relative dates are quite ambiguous in English
    // If today is Wednesday 23 September 2020, then the following mappings are adhered to:

    // 15/9/19: Sun 15 Sep 2019
    // 15/9/20: Tue 15 Sep
    // 16/9/20: Last Wed
    // 21/9/20: Last Mon
    // 22/9/20: Yesterday
    // 23/9/20: Today
    // 24/9/20: Tomorrow
    // 25/9/20: Fri
    // 27/9/20: Sun
    // 28/9/20: Next Mon
    // 7/10/20: Wed Week

    if (diff ===  0) return "Today";
    if (diff === -1) return "Yesterday";
    if (diff ===  1) return "Tomorrow";

    const day = fn.format(date, "EEE"); // eg Mon, Thu

    // If it's this calendar week,
    // or during the weekend it is a weekday the next week
    if ((weekDiff === 0 && diff >= 0)
     || (dayOfWeek >= 5 && diff >= 0 && (dayOfWeek + diff) - 7 < 5)) return day;

    if (diff >= -7 && diff <   0) return `Last ${day}`;
    if (diff >   0 && diff <=  7) return `Next ${day}`;
    if (diff >   7 && diff <= 14) return `${day} Week`;

    if (yearDiff === 0)
      return fn.format(date, "EEE do MMM"); // eg: Thu 17th Sep
    else
      return fn.format(date, "EEE do MMM yyyy"); // eg: Fri 17th Sep 2021 if it's not 2021
  }

  const getTime = date => {
    // ignore time if midnight
    if (date.getHours() === 0 && date.getMinutes() === 0) return null;
    // No minutes; eg 4PM
    if (date.getMinutes() === 0) return fn.format(date, "haaa");
    return fn.format(date, "h:mmaaa");
  }

  const time = getTime(date);
  return getDate(date) + (time ? " " + time : "");
};

export const timeUrgencyClassName = ms => {
  const remaining = (ms - new Date().getTime()) / 1000;
  if (remaining < 0) return 'urgency-overdue';
  if (remaining < 7200) return 'urgency-two-hours';
  if (remaining < 86400) return 'urgency-day';
  if (remaining < 86400*7) return 'urgency-week';
  if (remaining < 86400*7*2) return 'urgency-fortnight';
  return null;
}
