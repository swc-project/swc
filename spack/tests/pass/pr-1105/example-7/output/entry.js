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
const isMain1 = isMain, modUrl1 = modUrl;
const isMain2 = isMain1, modUrl2 = modUrl1;
console.log(isMain2, modUrl2);
console.log(importMeta);
