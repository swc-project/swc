var f3 = <T, U extends T>(x: T, y: U) => {
    function bar<V extends T, W extends U>() {
        var g = <X extends W, Y extends V>(a: X, b: Y): T => {
            x = y;
            return y;
        };
    }
};

var f4 = <U extends T, T>(x: T, y: U) => {
    function bar<V extends T, W extends U>() {
        var g = <X extends W, Y extends V>(a: X, b: Y): T => {
            x = y;
            return y;
        };
    }
};
