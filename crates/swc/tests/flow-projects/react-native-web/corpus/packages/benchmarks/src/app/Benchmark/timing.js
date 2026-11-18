// @flow

// Returns a high resolution time (if possible) in milliseconds
export function now(): number {
  if (window && window.performance) {
    return window.performance.now();
  } else {
    return Date.now();
  }
}
