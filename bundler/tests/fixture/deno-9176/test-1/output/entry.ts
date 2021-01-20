class MyError extends Error {
    constructor(){
        super("I'm in?");
    }
}
const MyError1 = MyError;
const MyError2 = MyError1;
function example1() {
    throw new MyError2();
}
export { example1 as example };
