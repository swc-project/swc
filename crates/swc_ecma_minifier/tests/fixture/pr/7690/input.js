export function foo() {
    const x = () => null;
    const y = () => x;
    console.log(y() === y());
}