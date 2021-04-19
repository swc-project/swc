function add(...args: number[]): number {
    return args.reduce((acc, v) => acc + v, 0);
}

console.log(add(1, 2, 3, 4));