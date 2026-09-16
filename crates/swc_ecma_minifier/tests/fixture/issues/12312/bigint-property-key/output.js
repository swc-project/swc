const object = {
    "9007199254740993": "PASS",
    o: "mangled"
};
console.log(object[9007199254740993n], object.o);
