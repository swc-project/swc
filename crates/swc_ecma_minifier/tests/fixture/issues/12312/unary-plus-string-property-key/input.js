const object = {
    NaN: "PASS",
    longproperty: "mangled"
};

console.log(object[+"not a number"], object.longproperty);
