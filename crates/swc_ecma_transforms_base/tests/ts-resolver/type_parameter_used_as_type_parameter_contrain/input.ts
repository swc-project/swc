function foo<T, U extends T>(x: T, y: U): T {
    x = y;
    return y;
}

function foo2<U extends T, T>(x: T, y: U): T {
    x = y;
    return y;
}

var f = function <T, U extends T>(x: T, y: U): T {
    x = y;
    return y;
};

var f2 = function <U extends T, T>(x: T, y: U): T {
    x = y;
    return y;
};

var f3 = <T, U extends T>(x: T, y: U): T => {
    x = y;
    return y;
};

var f4 = <U extends T, T>(x: T, y: U): T => {
    x = y;
    return y;
};
