// Arrow function with inlinable parameter
const process = (value, multiplier) => {
  return value * multiplier;
};

// multiplier is always 2
const result1 = process(10, 2);
const result2 = process(20, 2);
const result3 = process(30, 2);

console.log(result1, result2, result3);
