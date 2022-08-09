// @target: es5
// @useDefineForClassFields: true
class Lion extends Animal {
    constructor(...args){
        super(...args);
        this.sound = 'RAWR!' // error here
        ;
    }
}
