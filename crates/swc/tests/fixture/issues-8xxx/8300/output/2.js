class Foo extends Bar {
    constructor(){
        for (var i of [
            1
        ]){
            setTimeout(()=>{
                console.log(this);
            });
        }
        super();
    }
}
