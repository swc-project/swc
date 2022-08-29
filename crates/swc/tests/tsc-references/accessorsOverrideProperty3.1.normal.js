//// [accessorsOverrideProperty3.ts]
class Lion extends Animal {
    _sound = 'grrr';
    get sound() {
        return this._sound;
    }
    set sound(val) {
        this._sound = val;
    }
}
