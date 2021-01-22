class MyError extends Error {
    constructor(){
        super("I'm in?");
    }
}
function example2() {
    throw new MyError();
}
const example1 = example2;
export { example1 as example };
