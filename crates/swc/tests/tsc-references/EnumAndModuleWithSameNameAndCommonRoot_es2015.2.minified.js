!function(enumdule) {
    enumdule[enumdule.Red = 0] = "Red", enumdule[enumdule.Blue = 1] = "Blue";
}(enumdule || (enumdule = {})), (enumdule || (enumdule = {})).Point = class {
    constructor(x, y){
        this.x = x, this.y = y;
    }
}, enumdule.Red, new enumdule.Point(0, 0);
