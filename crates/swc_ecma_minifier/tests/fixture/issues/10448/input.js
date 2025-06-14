const isDev = () => false;

function Foo() {
    let value = 'default';

    // This conditional check will NOT be removed by SWC, even when isDev is set to false.
    if (isDev()) value = "dev value"

    return value;
}

let x = <Foo />

console.log(x)