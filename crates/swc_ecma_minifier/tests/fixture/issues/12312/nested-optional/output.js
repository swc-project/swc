const obj = {
    o: {
        o: 1
    }
};
console.log(obj["o"]["o"], obj?.["o"]?.["o"], "o" in obj["o"]);
