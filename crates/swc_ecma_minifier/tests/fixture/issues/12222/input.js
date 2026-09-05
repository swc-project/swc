const results = [];
const record = (value) => results.push(value);

((value = record("arrow-default-effect")) => {})();
(function (value = record("function-default-effect")) {})();

try {
    ((value = undefined.property) => {})();
} catch {
    record("arrow-default-throw");
}

try {
    (function ([value]) {})();
} catch {
    record("function-destructure-throw");
}

((value = 1) => {})();
(function (value = 1) {})();
((value) => {})();
(function (value) {})();
((...values) => {})();
(function (...values) {})();

console.log(results.join(","));
