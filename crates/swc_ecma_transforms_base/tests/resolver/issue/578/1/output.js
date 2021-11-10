import { myFunction } from './dep.js';
class SomeClass {
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
let instance = new SomeClass({
    myFunction: ()=>{
        console.log('CORRECT FUNCTION CALLED');
    }
});
instance.call();
