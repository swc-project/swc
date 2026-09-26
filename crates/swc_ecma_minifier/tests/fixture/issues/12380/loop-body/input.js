const callbacks = [];
for (const key in { first: 1, second: 2, third: 3 }) {
    callbacks.push(((value) => () => value)(key));
}
for (const value of [1, 2, 3])
    callbacks.push(((value) => () => value)(value));
let i = 0;
while (i < 3)
    callbacks.push(((value) => () => value)(++i));
i = 0;
do {
    callbacks.push(((value) => () => value)(++i));
} while (i < 3);
console.log(callbacks.map((cb) => cb()).join(","));
