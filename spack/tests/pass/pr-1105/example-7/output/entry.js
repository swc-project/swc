const importMeta = {
    url: "$DIR/tests/pass/pr-1105/example-7/input/f.js",
    main: false
};
const isMain = importMeta.main;
const isMain1 = isMain;
const isMain2 = isMain1;
const modUrl = importMeta.url;
const modUrl1 = modUrl;
const modUrl2 = modUrl1;
const importMeta1 = {
    url: "$DIR/tests/pass/pr-1105/example-7/input/entry.js",
    main: import.meta.main
};
console.log(isMain2, modUrl2);
console.log(importMeta1);
