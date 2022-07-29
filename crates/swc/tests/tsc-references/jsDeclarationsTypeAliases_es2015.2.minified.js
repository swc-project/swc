export { };
module.exports = {
    doTheThing: function(x) {
        return {
            x: "" + x
        };
    },
    ExportedThing: class {
        constructor(){
            this.z = "ok";
        }
    }
};
