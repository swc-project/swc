function Wagon(numberOxen) {
    this.numberOxen = numberOxen;
}
Wagon.circle = function(wagons) {
    return wagons ? wagons.length : 3.14;
}, Wagon.prototype.load = function(supplies) {}, Wagon.prototype.weight = (supplies)=>supplies ? supplies.length : -1, Wagon.prototype.speed = function() {
    return this.numberOxen / this.weight();
};
var db = new class extends Wagon {
    load(files, format) {
        if ("xmlolololol" === format) throw new Error("please do not use XML. It was a joke.");
        super.speed(), super.weight();
    }
    constructor(){
        super(), this.foonly = 12;
    }
}();
db.numberOxen = db.foonly;
var c = new class extends Wagon {
    static circle(others) {
        return others.length;
    }
    constructor(drunkOO){
        super('nope'), this.drunkOO = drunkOO;
    }
}(!0);
function Soup(flavour) {
    this.flavour = flavour;
}
c.drunkOO, c.numberOxen;
class Chowder extends Soup {
    log() {
        return this.flavour;
    }
}
new Soup(1).flavour, new Chowder({
    claim: "ignorant"
}).flavour.claim, new Chowder(), new Chowder(0);
