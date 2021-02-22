class MyError extends Error {
    constructor(){
        super("I'm in?");
    }
}
function example1() {
    throw new MyError();
}
export { example1 as example };
