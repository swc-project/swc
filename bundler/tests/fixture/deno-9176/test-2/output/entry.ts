class MyError extends Error {
    constructor(){
        super("I'm in?");
    }
}
const MyError1 = MyError;
const MyError2 = MyError1;
function example2() {
    throw new MyError2();
}
const example1 = example2;
export { example1 as example };
