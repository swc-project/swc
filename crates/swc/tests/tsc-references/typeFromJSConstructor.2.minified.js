//// [a.js]
function Installer() {
    // arg: number
    this.arg = 0, // unknown: string | boolean | null
    this.unknown = null, // twice: string | undefined
    this.twice = void 0, this.twice = "hi", // twices: any[] | null
    this.twices = [], this.twices = null;
}
Installer.prototype.first = function() {
    this.arg = "hi" // error
    , this.unknown = "hi" // ok
    , this.newProperty = 1 // ok: number | boolean
    , this.twice = void 0 // ok
    , this.twice = "hi" // ok
    ;
}, Installer.prototype.second = function() {
    this.arg = !1 // error
    , this.unknown = !1 // ok
    , this.newProperty = !1 // ok
    , this.twice = null // error
    , this.twice = !1 // error
    , this.twices.push(1) // error: Object is possibly null
    , null != this.twices && this.twices.push("hi");
};
