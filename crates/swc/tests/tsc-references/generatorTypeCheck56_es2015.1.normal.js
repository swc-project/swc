//@target: ES6
function* g() {
    let tmp;
    var x = (tmp = yield 0, class C {
        *[tmp]() {
            yield 0;
        }
    });
}
