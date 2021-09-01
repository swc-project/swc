import { myFunction } from './dep.js';
class SomeClass {
    constructor(properties){
        this.props = properties;
    }
    call() {
        const { myFunction: myFunction1  } = this.props;
        if (myFunction1) {
            myFunction1();
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
