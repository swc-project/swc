module.exports = {
    Rectangle: class {
        constructor(){
            console.log("I'm a rectangle!");
        }
    }
};
const { Rectangle  } = require('./rectangle');
module.exports = {
    Render: class {
        addRectangle() {
            let obj = new Rectangle();
            return this.objects.push(obj), obj;
        }
        constructor(){
            this.objects = [];
        }
    }
};
const { Render  } = require("./index");
let render = new Render();
render.addRectangle(), console.log("Objects", render.objects);
