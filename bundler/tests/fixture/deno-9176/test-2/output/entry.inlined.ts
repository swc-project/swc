class MyError extends Error {
    constructor(){
        super("I'm in?");
    }
}
function example() {
    throw new MyError();
}
const example1 = example;
const example2 = example;
export { example1 as example };
