const results = [];
const record = (value)=>results.push(value);
((value = record("arrow-default-effect"))=>{})();
(function(value = record("function-default-effect")) {})();
try {
    ((value = (void 0).property)=>{})();
} catch  {
    record("arrow-default-throw");
}
try {
    (function([value]) {})();
} catch  {
    record("function-destructure-throw");
}
console.log(results.join(","));
