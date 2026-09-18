//// [accessorsOverrideProperty4.ts]
class Lion extends Animal {
    _sound = 'roar';
    get sound() {
        return this._sound;
    }
    set sound(val) {
        this._sound = val;
    }
}
