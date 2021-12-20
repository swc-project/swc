// @target: esnext
// @useDefineForClassFields: true
class Animal {
    get sound() {
        return this._sound;
    }
    set sound(val) {
        this._sound = val;
    /* some important code here, perhaps tracking known sounds, etc */ }
    makeSound() {
        console.log(this._sound);
    }
    constructor(){
        this._sound = 'rustling noise in the bushes';
    }
}
const a = new Animal;
a.makeSound() // 'rustling noise in the bushes'
;
class Lion extends Animal {
    constructor(...args){
        super(...args);
        this.sound // error here
         = 'RAWR!';
    }
}
const lion = new Lion;
lion.makeSound() // with [[Define]]: Expected "RAWR!" but got "rustling noise in the bushes"
;
