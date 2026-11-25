/** GitHub contribution calendar for the past year, one array per week (Sun..Sat): the
 *  day-by-day sum of two accounts, the work one (employer repositories) and the personal one
 *  (own products and open source). Source: GitHub GraphQL contributionCalendar for each account.
 *  Nearly all of both is private-repository work. */
export const contributions = {
  from: '2025-11-16',
  to: '2026-11-16',
  total: 20759,
  work: 8389,
  personal: 12370,
  activeDays: 319,
  weeks: [[0, 27, 16, 28, 23, 49, 0], [0, 12, 32, 57, 29, 19, 0], [0, 5, 0, 2, 1, 14, 0], [1, 18, 47, 16, 34, 68, 0], [0, 52, 38, 33, 36, 20, 0], [0, 20, 49, 9, 0, 61, 0], [0, 0, 36, 7, 0, 0, 0], [0, 20, 27, 61, 67, 16, 0], [0, 8, 78, 38, 23, 74, 0], [0, 33, 30, 77, 38, 34, 0], [0, 39, 29, 16, 74, 15, 0], [0, 14, 9, 25, 52, 37, 0], [0, 0, 1, 13, 14, 7, 0], [0, 0, 8, 26, 39, 68, 0], [0, 23, 48, 42, 27, 40, 3], [0, 56, 34, 52, 10, 38, 0], [0, 112, 70, 53, 58, 79, 0], [0, 31, 69, 67, 34, 81, 0], [15, 208, 165, 116, 195, 144, 85], [23, 118, 104, 35, 52, 67, 8], [0, 18, 1, 70, 64, 133, 6], [53, 55, 75, 196, 48, 12, 0], [0, 18, 50, 14, 51, 85, 38], [139, 108, 90, 33, 36, 97, 20], [22, 66, 141, 84, 52, 123, 52], [218, 150, 142, 165, 98, 19, 93], [43, 151, 207, 135, 36, 97, 19], [12, 54, 54, 98, 135, 47, 23], [27, 83, 46, 50, 123, 119, 69], [149, 100, 49, 108, 16, 52, 20], [9, 45, 45, 31, 22, 43, 39], [0, 41, 75, 111, 93, 90, 29], [62, 88, 73, 123, 88, 57, 20], [0, 51, 29, 72, 17, 47, 16], [1, 85, 98, 135, 61, 110, 90], [87, 120, 102, 145, 114, 57, 51], [39, 115, 59, 230, 77, 66, 71], [5, 8, 53, 125, 84, 106, 71], [37, 123, 127, 91, 95, 119, 15], [17, 64, 162, 129, 98, 98, 29], [46, 135, 119, 84, 45, 46, 29], [20, 73, 78, 102, 160, 142, 139], [53, 262, 183, 70, 65, 123, 24], [80, 86, 186, 37, 143, 51, 11], [42, 75, 101, 127, 31, 58, 48], [91, 71, 103, 47, 44, 48, 15], [18, 70, 50, 109, 102, 87, 14], [170, 38, 106, 78, 15, 86, 11], [6, 3, 0, 15, 45, 62, 116], [18, 32, 41, 55, 87, 133, 1], [55, 175, 96, 25, 34, 11, 7], [30, 95, 212, 119, 134, 106, 16], [43, 167]] as number[][],
};

/** Ez-Commerce release history. Source: git tags and migrations in the ez-commerce repo. */
export const ezCommerce = {
  since: '2026-03-30',
  asOf: '2026-11-24',
  releases: 915,
  migrations: 481,
  commits60d: 2774,
  crates: 30,
  moduleCrates: 28,
  contexts: 44,
};

export const workspaceSplitBench = {
  asOf: '2026-11-24',
  commit: '443687d9c',
  crates: 29,
  moduleCrates: 27,
  scenarios: [
    { label: 'Sales edit (ez-sales)', beforeSec: 35.79, afterSec: 5.06, speedup: '7.1×' },
    { label: 'Catalog edit (ez-catalog)', beforeSec: 48.04, afterSec: 5.55, speedup: '8.7×' },
    { label: 'Core edit (core lib)', beforeSec: 47.67, afterSec: 9.62, speedup: '5.0×' },
    { label: 'Core edit + server binary', beforeSec: 26.19, afterSec: 14.9, speedup: '1.8×' },
  ],
};

/** When the shops using Ez-Commerce sell: per-mille of sales by weekday (Mon..Sun) and hour (08..23).
 *  Source: anonymous aggregate over production sales, 60 days to 2026-11-16 (62,647 sales, 14 shops). */
export const shopRhythm = { asOf: '2026-11-16', sales: 62647, shops: 14, days: 60, heat: [[2, 5, 6, 7, 10, 9, 8, 6, 7, 9, 12, 12, 14, 12, 8, 4], [3, 4, 5, 6, 8, 8, 6, 6, 7, 8, 11, 14, 15, 14, 9, 6], [3, 4, 6, 7, 10, 9, 7, 7, 8, 9, 12, 12, 15, 15, 11, 6], [3, 4, 6, 8, 10, 10, 8, 6, 9, 10, 11, 14, 16, 14, 10, 6], [3, 4, 6, 8, 11, 10, 8, 7, 7, 9, 11, 13, 14, 18, 14, 10], [1, 3, 5, 8, 11, 10, 8, 7, 8, 9, 11, 14, 17, 19, 15, 10], [0, 2, 4, 7, 11, 11, 9, 7, 8, 10, 10, 12, 14, 15, 11, 7]] as number[][] };
