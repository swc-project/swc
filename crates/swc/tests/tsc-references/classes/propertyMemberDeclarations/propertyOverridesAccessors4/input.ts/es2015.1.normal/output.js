class Lion extends Animal {
    constructor(...args){
        super(...args);
        this.sound // error here
         = 'RAWR!';
    }
}
