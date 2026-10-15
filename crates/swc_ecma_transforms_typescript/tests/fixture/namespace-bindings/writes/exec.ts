namespace N {
    export let value = 0;
}
namespace N {
    value++;
    ({ value } = { value: 2 });
    for (value of [3]) {}
    export const result = { value };
}
console.log(N.value, N.result.value);
expect(N.value).toBe(3);
expect(N.result.value).toBe(3);
