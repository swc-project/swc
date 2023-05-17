declare let fn: any, x: any, y: any
declare function z<A, B>(_: any): any
fn(z<Number, Object>(y))
fn(z<Number, Object> = y)
fn(x < y, x > y)
fn(x < y, x >= y)
fn(x < y, x >> y)
fn(x < y, x >>= y)
fn(x < y, x >>>= y)
fn(x < y, x < y, x >>= y)
fn(x < y, x < y, x >>> y)
fn(x < y, x < y, x >>>= y)
