
export default async function foo(x) {
    async function bar(y){
        y(x);
    }
}
