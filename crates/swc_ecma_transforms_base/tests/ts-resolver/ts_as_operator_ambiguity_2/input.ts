module Top {
    interface A<T> {
        x: T;
    }
    interface B {
        m: string;
    }

    var x: any;
    var y = x as A<B>[];
    var z = y[0].m; // z should be string
}
