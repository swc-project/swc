class A {
}
class B extends A {
    constructor(){
        <sometag1 __self={this}/>;
        super(<sometag2 __self={this}/>);
        <sometag3 __self={this}/>;
    }
}
class C {
    constructor(){
        <sometag4 __self={this}/>;
        class D extends A {
            constructor(){
                super();
            }
        }
        const E = class extends A {
            constructor(){
                super();
            }
        };
    }
}
class E extends A {
    constructor(){
        this.x = ()=><sometag5 __self={this}/>;
        this.y = function() {
            return <sometag6 __self={this}/>;
        };
        function z() {
            return <sometag7 __self={this}/>;
        }
        {
            <sometag8 __self={this}/>;
        }
        super();
    }
}
class F {
    constructor(){
        <sometag9 __self={this}/>;
    }
}
class G extends A {
    constructor(){
        return <sometag10 __self={this}/>;
    }
}
