const x = () => null;
const y = () => x;
console.log(y() === y());
