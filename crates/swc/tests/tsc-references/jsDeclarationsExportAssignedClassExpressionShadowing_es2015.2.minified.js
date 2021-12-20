class Q {
    constructor(){
        this.x = 42;
    }
}
module.exports = class {
    constructor(){
        this.x = new class {
            constructor(){
                this.member = new Q();
            }
        }();
    }
}, module.exports.Another = Q;
