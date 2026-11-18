function outer(obj) {
    let f = (a)=>a;
    with (obj)f = (_, b)=>b;
    return f(1, 2);
}
console.log(outer({}));
