(function () {}(), console); // keep paren
(console, function () {}()); // remove paren

(function () {}, console); // keep paren
(console, function () {}); // remove paren

(class {}, console); // keep paren
(console, class {}); // remove paren
