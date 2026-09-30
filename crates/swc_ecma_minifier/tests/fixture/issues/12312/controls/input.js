const obj = { longprop: 1, otherprop: 2 };
const key = "otherprop";
const dynamic = { [key]: 3 };
console.log(obj.longprop, obj["longprop"], "longprop", obj["otherprop"], obj[key], dynamic[key]);
