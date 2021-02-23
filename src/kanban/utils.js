
import { pushNotification, abbreviatedDescription } from '../common';

// Handles notifications for cards with a datetime attribute
const handles = {}; // maps card ID to a list of setTimeout handles
const minute = 60000; // in milliseconds
const intervals = [  // intervals before the event that reminders happen at
    [10 * minute, "10 minutes"],
    [60 * minute, "1 hour"],
    [60 * minute * 6, "6 hours"],
];
export function handleEventReminderForCard (id, card) {
  if (id in handles) {
    for (const x of handles[id]) {
      clearTimeout(x);
    }
    delete handles[id];
  }
  if (card && card.time) {
    const date = new Date(card.time);
    // Ignore times starting at midnight?
    // if (date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0 && date.getMilliseconds() === 0) {
    //   return;
    // }
    const remainingMS = date.getTime() - new Date().getTime();
    if (remainingMS < 0) return;
    handles[id] = [];
    for (const [ms, label] of intervals) {
      if (remainingMS > ms) {
        handles[id].push(setTimeout(() => {
          pushNotification(`Due in ${label}: ${abbreviatedDescription(card)}`);
        }, remainingMS - ms));
      }
    }
  }
}
