class MyError extends Error {
    constructor(){
        super("I'm in?");
    }
}
function example() {
    throw new MyError();
}
export { example as example };
