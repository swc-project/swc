global.leak = (n) => console.log(n);
global.num = 4;
let counter = -1;
for (const i in [0, 1, 2, 3, 4, 5]) {
    counter++, i == num && leak(counter);
}
