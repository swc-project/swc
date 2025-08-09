(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory();
    else if (typeof define === "function" && define.amd) define([], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory();
})(this, function() {
    "use strict";
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
});
