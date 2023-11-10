class Foo {
    constructor(){
        this.x = async function() {
            return await 1;
        };
    }
    bar() {
        (async function() {})();
    }
}
