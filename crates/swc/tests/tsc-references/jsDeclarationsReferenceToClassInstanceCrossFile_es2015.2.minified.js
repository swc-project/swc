class Rectangle {
    constructor(){
        console.log("I'm a rectangle!");
    }
}
module.exports = {
    Rectangle
};
const { Rectangle  } = require('./rectangle');
class Render {
    addRectangle() {
        let obj = new Rectangle();
        return this.objects.push(obj), obj;
    }
    constructor(){
        this.objects = [];
    }
}
module.exports = {
    Render
};
const { Render  } = require("./index");
let render = new Render();
render.addRectangle(), console.log("Objects", render.objects);
