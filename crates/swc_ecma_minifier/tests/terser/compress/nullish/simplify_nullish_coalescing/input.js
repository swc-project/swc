const y = id("one");
const is_null = null;
const not_null = "two";
const folded_true = false ? 0 : true;
const folded_false = false ? 1 : false;
console.log(is_null ?? y);
console.log(not_null ?? y);
console.log(folded_true ?? y);
console.log(folded_false ?? y);
