var x = {e0: 'cat', x0: 'dog'};
console.info (x.x0);
// tsc dies on this next line with "bug.ts (5,16): Expected ')'"
//   tsc seems to be parsing the e0 as a hex constant.
console.info (x.e0);
