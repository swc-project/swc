// Parameter Declaration with generic
class Class {
    constructor(){}
}
class SubClass extends Class {
    constructor(){
        super();
    }
}
class D {
    constructor(){}
}
class SubD extends D {
    constructor(){
        super();
    }
}
function d0({ x  } = {
    x: new Class()
}) {}
function d1({ x  }) {}
function d2({ x  }) {}
function d3({ y  }) {}
function d4({ y  } = {
    y: new D()
}) {}
var obj = new Class();
d0({
    x: 1
});
d0({
    x: {}
});
d0({
    x: "string"
});
d1({
    x: new Class()
});
d1({
    x: {}
});
d1({
    x: "string"
});
d2({
    x: new SubClass()
});
d2({
    x: {}
});
d3({
    y: new SubD()
});
d3({
    y: new SubClass()
});
// Error
d3({
    y: new Class()
});
d3({});
d3({
    y: 1
});
d3({
    y: "world"
});
