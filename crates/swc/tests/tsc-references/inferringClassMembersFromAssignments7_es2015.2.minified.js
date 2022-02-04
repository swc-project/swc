const c = new class {
    mreal() {
        var self = this;
        self.y = 2;
    }
    constructor(){
        var self = this;
        self.x = 1, self.m = function() {
            console.log(self.x);
        };
    }
}();
c.x, c.y, c.m();
