const obj = { [("longprop")]: 1 };
const { ["longprop"]: value } = obj;
console.log(obj["long\u0070rop"], ("longprop") in obj, value);
