var f3 = <T, U extends T>(x: T, y: U): T => {
    x = y;
    return y;
};
