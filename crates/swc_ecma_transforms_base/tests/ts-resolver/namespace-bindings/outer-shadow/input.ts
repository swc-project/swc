const a = 100;
namespace N {
    export const a = 1;
}
namespace N {
    export const b = a + 1;
}
console.log(N.b, a);
