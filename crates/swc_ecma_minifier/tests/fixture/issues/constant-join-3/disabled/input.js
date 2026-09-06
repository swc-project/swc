function join(a, b) {
    return [a].join() + "|" + [a, b + "tail"].join("");
}
console.log(join(1, 2));
