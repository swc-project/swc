//// [propertyOverridesAccessors3.ts]
class Animal {
    _sound = 'rustling noise in the bushes';
    get sound() {
        return this._sound;
    }
    set sound(val) {
        this._sound = val;
    }
    makeSound() {
        console.log(this._sound);
    }
}
(new Animal).makeSound(), (new class extends Animal {
    sound = 'RAWR!';
}).makeSound();
