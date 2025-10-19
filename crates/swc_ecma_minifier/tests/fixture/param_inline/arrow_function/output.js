// Arrow function with inlinable parameter
const process = (value)=>{
    const multiplier = 2;
    return value * multiplier;
};
// multiplier is always 2
const result1 = process(10);
const result2 = process(20);
const result3 = process(30);
console.log(result1, result2, result3);
