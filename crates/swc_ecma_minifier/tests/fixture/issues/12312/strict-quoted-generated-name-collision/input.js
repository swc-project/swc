const object = {
    longproperty: "long",
    g: "unquoted",
    ["g"]: "strict"
};

console.log(object.longproperty, object.g);
