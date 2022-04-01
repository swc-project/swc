const a = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/u;
const b = /./s;
const c = /./imsuy;

console.log(a.unicode);
console.log(b.dotAll);
console.log(c.sticky);
console.log(c.ignoreCase);
