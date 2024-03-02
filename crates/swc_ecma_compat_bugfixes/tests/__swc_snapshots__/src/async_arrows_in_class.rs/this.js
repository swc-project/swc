class Foo {
    constructor(){
        var _this = this;
        this.x = ()=>async function() {
                return await _this;
            };
    }
}
