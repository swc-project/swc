//@target: es5
// Note that type guards affect types of variables and parameters only and 
// have no effect on members of objects such as properties. 
var num;
var strOrNum;
class C1 {
    // Inside public accessor getter
    get pp3() {
        return strOrNum;
    }
    method() {
        strOrNum = typeof this.pp1 === "string" && this.pp1; // string | number
        strOrNum = typeof this.pp2 === "string" && this.pp2; // string | number
        strOrNum = typeof this.pp3 === "string" && this.pp3; // string | number
    }
}
var c1;
strOrNum = typeof c1.pp2 === "string" && c1.pp2; // string | number
strOrNum = typeof c1.pp3 === "string" && c1.pp3; // string | number
var obj1;
strOrNum = typeof obj1.x === "string" && obj1.x; // string | number
