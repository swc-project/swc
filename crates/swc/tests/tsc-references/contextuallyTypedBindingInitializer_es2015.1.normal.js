function f({ show =(v)=>v.toString()  }) {}
function f2({ "show": showRename = (v)=>v.toString()  }) {}
function f3({ ["show"]: showRename = (v)=>v.toString()  }) {}
function ff({ nested ={
    show: (v)=>v.toString()
}  }) {}
function g({ prop =[
    "hello",
    1234
]  }) {}
function h({ prop ="foo"  }) {}
let { stringIdentity: id = (arg)=>arg  } = {
    stringIdentity: (x)=>x
};
