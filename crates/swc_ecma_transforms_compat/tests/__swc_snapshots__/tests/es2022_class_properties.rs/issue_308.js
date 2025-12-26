function bar(props) {}
class Foo {
    constructor(){
        _define_property(this, "onBar", ()=>{
            bar();
        });
        super();
        bar();
    }
}
