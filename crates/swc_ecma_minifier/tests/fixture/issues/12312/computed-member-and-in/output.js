const obj = {
    o: 1,
    other: 2
};
const dynamicKey = "other";
console.log(obj.o, obj["o"], "o" in obj, obj[dynamicKey], "longprop");
