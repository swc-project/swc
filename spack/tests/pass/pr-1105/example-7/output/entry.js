const importMeta = {
    url: "$DIR/tests/pass/pr-1105/example-7/input/entry.js",
    main: import.meta.main
};
const importMeta1 = {
    url: "$DIR/tests/pass/pr-1105/example-7/input/f.js",
    main: false
};
const isMain = importMeta1.main;
const modUrl = importMeta1.url;
console.log(isMain, modUrl);
console.log(importMeta);
