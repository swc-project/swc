class MyError extends Error {
    constructor(){
        super("I'm in?");
    }
}
const MyError1 = MyError;
const MyError2 = MyError1;
function example() {
    throw new MyError2();
}
const example1 = example;
const example2 = example1;
export { example1 as example };
