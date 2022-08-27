//// [bug25926.js]
/** @type {{ a(): void; b?(n: number): number; }} */ var o1 = {
    a: function a() {
        this.b = function(n) {
            return n;
        };
    }
};
/** @type {{ d(): void; e?(n: number): number; f?(n: number): number; g?: number }} */ var o2 = {
    d: function d() {
        var _this = this;
        this.e = this.f = function(m) {
            return _this.g || m;
        };
    }
};
