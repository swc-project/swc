import { myFunction__1 } from './dep.js';
class SomeClass__1 {
    constructor(properties__2){
        this.props = properties__2;
    }
    call() {
        const { myFunction__3  } = this.props;
        if (myFunction__3) {
            myFunction__3();
        } else {
            console.log('DID NOT WORK!');
        }
    }
}
let instance__1 = new SomeClass__1({
    myFunction: ()=>{
        console.log('CORRECT FUNCTION CALLED');
    }
});
instance__1.call();
