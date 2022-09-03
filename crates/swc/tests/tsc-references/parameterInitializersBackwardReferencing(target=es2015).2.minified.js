//// [parameterInitializersBackwardReferencing.ts]
function test0({ a =0 , b =a  } = {}) {
    return {
        a,
        b
    };
}
function test1({ c: { a =0 , b =a  } = {}  } = {}) {
    return {
        a,
        b
    };
}
