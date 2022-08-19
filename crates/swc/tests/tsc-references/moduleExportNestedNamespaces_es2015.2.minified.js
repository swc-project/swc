module.exports.n = {}, module.exports.n.K = function() {
    this.x = 10;
}, module.exports.Classic = class {
    constructor(){
        this.p = 1;
    }
};
import * as s from './mod';
var k = new s.n.K();
k.x, new s.Classic();
