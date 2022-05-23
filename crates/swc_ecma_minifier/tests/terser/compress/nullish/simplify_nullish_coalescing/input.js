const y = id("one");
const is_null = null;
const not_null = "two";
console.log(is_null ?? y);
console.log(not_null ?? y);
