module.exports.n = {}, module.exports.n.K = function() {
    this.x = 10;
}, module.exports.Classic = class {
    constructor(){
        this.p = 1;
    }
};
import * as s from './mod';
new s.n.K().x, new s.Classic();
