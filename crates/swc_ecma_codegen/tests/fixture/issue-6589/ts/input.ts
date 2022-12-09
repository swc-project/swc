export function func({
 a,
 b,
 ...rest
}: {
    a: string,
    b: string,
}) {
    console.log(a,b, rest)
}

const other = { unknow: "foo" }

let foo = {
    ...other,
    bar: "baz"
};
let bar = {
    bar: "baz",
    ...other
};
