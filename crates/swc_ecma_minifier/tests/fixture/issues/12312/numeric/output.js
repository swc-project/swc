const obj = {
    o: 1,
    42: 2,
    43: 3,
    infinity: 4,
    "9007199254740993": 6
};
Object.defineProperty(obj, "44", {
    value: 5
});
console.log(obj["o"], obj["42"], obj[42], obj["43"], obj[43], obj.infinity, obj["infinity"], obj[44], obj["44"], obj[9007199254740993n]);
