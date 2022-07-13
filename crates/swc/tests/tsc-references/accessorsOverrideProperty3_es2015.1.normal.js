// @target: esnext
// @useDefineForClassFields: true
class Lion extends Animal {
    get sound() {
        return this._sound;
    }
    set sound(val) {
        this._sound = val;
    }
    constructor(...args){
        super(...args);
        this._sound = 'grrr';
    }
}
