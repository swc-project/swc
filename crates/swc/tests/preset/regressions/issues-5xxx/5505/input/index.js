(function () {}(), console); // keep paren
(console, function () {}()); // remove paren

(function () {}, console); // keep paren
(console, function () {}); // remove paren

(function foo() {}(), console); // keep paren
(console, function foo() {}()); // remove paren

(function foo() {}, console); // keep paren
(console, function foo() {}); // remove paren

(class {}, console); // keep paren
(console, class {}); // remove paren

(class Bar{}, console); // keep paren
(console, class Bar{}); // remove paren
