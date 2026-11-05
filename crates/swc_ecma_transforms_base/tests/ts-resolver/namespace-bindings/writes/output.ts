namespace N__2 {
    export let value__3 = 0;
}
namespace N__2 {
    value__3++;
    ({ value__3 } = {
        value: 2
    });
    for (value__3 of [
        3
    ]){}
    export const result__4 = {
        value__3
    };
}
console.log(N__2.value, N__2.result.value);
