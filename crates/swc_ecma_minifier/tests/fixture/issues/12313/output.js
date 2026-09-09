var key = "flag";
var obj = {
    flag: 1
};
obj["flag"]++;
console.log(obj[key]);
console.log(++obj["flag"]);
console.log(obj["flag"]--);
console.log(--obj["flag"]);
obj.flag++;
console.log(obj[key]);
function updateLocal(obj) {
    obj["flag"]++;
    obj.flag--;
    return obj["flag"];
}
console.log(updateLocal({
    flag: 1
}));
console.log(1);
obj["flag"]++;
console.log(obj[key]);
