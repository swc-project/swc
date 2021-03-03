// Loaded from https://deno.land/x/colorlog@v1.0/mod.ts


const reset: String = "\x1b[0m";
const red: String = "\x1b[31m";
const green: String = "\x1b[32m";
const yellow: String = "\x1b[33m";

function error(val: any) {
  return (red + val + reset);
}

function success(val: any) {
  return (green + val + reset);
}

function warning(val: any) {
  return (yellow + val + reset);
}
function errorLog(val: any) {
  console.log(red + val + reset);
}

function successLog(val: any) {
  console.log(green + val + reset);
}

function warningLog(val: any) {
  console.log(yellow + val + reset);
}

export { error, success, warning, errorLog, successLog, warningLog };
