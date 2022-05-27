let a;
let b = 4;
({ [5 + 2 - b]: a  } = {
    [1 + 2]: 42
});
console.log(a);
