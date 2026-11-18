function bar(props) {}
class Foo {
    constructor(){
        super(), _define_property(this, "onBar", ()=>{
            bar();
        });
        bar();
    }
}
