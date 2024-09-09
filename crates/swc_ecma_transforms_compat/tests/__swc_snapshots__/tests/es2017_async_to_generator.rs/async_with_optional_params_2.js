const Z = (f)=>((x)=>f((y)=>x(x)(y)))((x)=>f((y)=>x(x)(y)));
const p = Z((f)=>/*#__PURE__*/ _async_to_generator(function*(n = 0) {
        return n <= 1 ? 1 : n * (yield f(n - 1));
    }))(5);
