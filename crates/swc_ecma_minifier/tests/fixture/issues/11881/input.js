var Analytics = initAnalytics();
var LocalOnly = Analytics;
export { Analytics };
export var DirectExport = initDirect();
export const StableConst = 1;

console.log(LocalOnly, StableConst);
