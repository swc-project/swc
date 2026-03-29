let f = (a) => a;

for (f of [(_, b) => b]) {
    break;
}

console.log(f(1, 2));
