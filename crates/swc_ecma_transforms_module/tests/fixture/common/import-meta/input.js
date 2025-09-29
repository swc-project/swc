const react = import.meta.resolve("react");
const url = import.meta.url;
const urlMaybe = import.meta?.url;
const filename = import.meta.filename;
const dirname = import.meta.dirname;
const main = import.meta.main;

foo?.bar(import.meta.url);
console.log(react);
console.log(url);
console.log(filename);
console.log(dirname);
console.log(main);
