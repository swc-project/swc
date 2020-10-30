const isMain = {
    url: "$DIR/tests/pass/pr-1105/example-7/input/f.js",
    main: false
}.main;
const modUrl = {
    url: "$DIR/tests/pass/pr-1105/example-7/input/f.js",
    main: false
}.url;
console.log(isMain, modUrl);
console.log(({
    url: "$DIR/tests/pass/pr-1105/example-7/input/entry.js",
    main: import.meta.main
}).main, ({
    url: "$DIR/tests/pass/pr-1105/example-7/input/entry.js",
    main: import.meta.main
}).url);
