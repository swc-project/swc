class Animal {
    get sound() {
        return this._sound;
    }
    set sound(val) {
        this._sound = val;
    }
    makeSound() {
        console.log(this._sound);
    }
    constructor(){
        this._sound = "rustling noise in the bushes";
    }
}
const a = new Animal;
a.makeSound();
const lion = new class extends Animal {
    constructor(...args){
        super(...args), this.sound = "RAWR!";
    }
};
lion.makeSound() // with [[Define]]: Expected "RAWR!" but got "rustling noise in the bushes"
;
