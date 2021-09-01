interface A<T__2> {
    x__0: T__2;
}
interface B {
    m__0: string;
}
var x: any;
var y = x as A<B>[];
var z = y[0].m;
