(class {
    constructor(){
        this.d = function() {
            return new.target;
        }, new.target;
    }
}).c = function() {
    return new.target;
};
