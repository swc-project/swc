class MyError extends Error {
    constructor(){
        super("I'm in?");
    }
}
function example() {
    throw new MyError();
}
const example1 = example;
export { example as example };
