new class Bar {
    x = new class Foo {
        [(()=>{
            let count = 0;
            return (numToAdd)=>count += numToAdd;
        })()]() {
            console.log("Hello, world!");
        }
    }();
}();
export { };
