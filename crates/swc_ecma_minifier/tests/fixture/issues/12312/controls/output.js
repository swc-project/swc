const obj = {
    o: 1,
    otherprop: 2
};
const key = "otherprop";
const dynamic = {
    [key]: 3
};
console.log(obj.o, obj["o"], "longprop", obj["otherprop"], obj[key], dynamic[key]);
