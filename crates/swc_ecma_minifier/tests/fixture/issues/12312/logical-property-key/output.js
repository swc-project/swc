const object = {
    o: "AND",
    p: "OR",
    l: "NULLISH",
    e: "MAYBE"
};
globalThis.condition = true;
console.log(object["o"], object["p"], object["l"], object[globalThis.condition && "e"]);
