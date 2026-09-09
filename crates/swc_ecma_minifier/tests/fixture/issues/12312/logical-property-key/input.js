const object = {
    longprop: "AND",
    otherprop: "OR",
    nullishprop: "NULLISH",
    maybeprop: "MAYBE"
};

globalThis.condition = true;

console.log(
    object[true && "longprop"],
    object[false || "otherprop"],
    object[null ?? "nullishprop"],
    object[globalThis.condition && "maybeprop"]
);
