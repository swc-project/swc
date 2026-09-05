function f(a) {
    return (void console.log("effect")) === a || null === a;
}

console.log(f(1));
