import { myFunction__2 } from "./dep.js";
class SomeClass__2 {
    constructor(properties__3){
        this.props = properties__3;
    }
    call() {
        const { myFunction__4 } = this.props;
        if (myFunction__4) {
            myFunction__4();
        } else {
            console.log("DID NOT WORK!");
        }
    }
}
let instance__2 = new SomeClass__2({
    myFunction: ()=>{
        console.log("CORRECT FUNCTION CALLED");
    }
});
instance__2.call();
