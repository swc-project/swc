const importMeta = {
    url: "$DIR/tests/pass/pr-1105/example-7/input/f.js",
    main: false
};
const isMain = importMeta.main;
const modUrl = importMeta.url;
const importMeta1 = {
    url: "$DIR/tests/pass/pr-1105/example-7/input/entry.js",
    main: import.meta.main
};
console.log(isMain, modUrl);
console.log(importMeta1);
