// type parameter type is not valid for arithmetic operand
function foo<T>(t: T) {
    var a: any;
    var b: boolean;
    var c: number;
    var d: string;
    var e: {};

    var r1a1 = a * t;
    var r1a2 = a / t;
    var r1a3 = a % t;
    var r1a4 = a - t;
    var r1a5 = a << t;
    var r1a6 = a >> t;
    var r1a7 = a >>> t;
    var r1a8 = a & t;
    var r1a9 = a ^ t;
    var r1a10 = a | t;

    var r2a1 = t * a;
    var r2a2 = t / a;
    var r2a3 = t % a;
    var r2a4 = t - a;
    var r2a5 = t << a;
    var r2a6 = t >> a;
    var r2a7 = t >>> a;
    var r2a8 = t & a;
    var r2a9 = t ^ a;
    var r2a10 = t | a;

    var r1b1 = b * t;
    var r1b2 = b / t;
    var r1b3 = b % t;
    var r1b4 = b - t;
    var r1b5 = b << t;
    var r1b6 = b >> t;
    var r1b7 = b >>> t;
    var r1b8 = b & t;
    var r1b9 = b ^ t;
    var r1b10 = b | t;

    var r2b1 = t * b;
    var r2b2 = t / b;
    var r2b3 = t % b;
    var r2b4 = t - b;
    var r2b5 = t << b;
    var r2b6 = t >> b;
    var r2b7 = t >>> b;
    var r2b8 = t & b;
    var r2b9 = t ^ b;
    var r2b10 = t | b;

    var r1c1 = c * t;
    var r1c2 = c / t;
    var r1c3 = c % t;
    var r1c4 = c - t;
    var r1c5 = c << t;
    var r1c6 = c >> t;
    var r1c7 = c >>> t;
    var r1c8 = c & t;
    var r1c9 = c ^ t;
    var r1c10 = c | t;

    var r2c1 = t * c;
    var r2c2 = t / c;
    var r2c3 = t % c;
    var r2c4 = t - c;
    var r2c5 = t << c;
    var r2c6 = t >> c;
    var r2c7 = t >>> c;
    var r2c8 = t & c;
    var r2c9 = t ^ c;
    var r2c10 = t | c;

    var r1d1 = d * t;
    var r1d2 = d / t;
    var r1d3 = d % t;
    var r1d4 = d - t;
    var r1d5 = d << t;
    var r1d6 = d >> t;
    var r1d7 = d >>> t;
    var r1d8 = d & t;
    var r1d9 = d ^ t;
    var r1d10 = d | t;

    var r2d1 = t * d;
    var r2d2 = t / d;
    var r2d3 = t % d;
    var r2d4 = t - d;
    var r2d5 = t << d;
    var r2d6 = t >> d;
    var r2d7 = t >>> d;
    var r2d8 = t & d;
    var r2d9 = t ^ d;
    var r2d10 = t | d;

    var r1e1 = e * t;
    var r1e2 = e / t;
    var r1e3 = e % t;
    var r1e4 = e - t;
    var r1e5 = e << t;
    var r1e6 = e >> t;
    var r1e7 = e >>> t;
    var r1e8 = e & t;
    var r1e9 = e ^ t;
    var r1e10 = e | t;

    var r2e1 = t * e;
    var r2e2 = t / e;
    var r2e3 = t % e;
    var r2e4 = t - e;
    var r2e5 = t << e;
    var r2e6 = t >> e;
    var r2e7 = t >>> e;
    var r2e8 = t & e;
    var r2e9 = t ^ e;
    var r2e10 = t | e;

    var r1f1 = t * t;
    var r1f2 = t / t;
    var r1f3 = t % t;
    var r1f4 = t - t;
    var r1f5 = t << t;
    var r1f6 = t >> t;
    var r1f7 = t >>> t;
    var r1f8 = t & t;
    var r1f9 = t ^ t;
    var r1f10 = t | t;
}