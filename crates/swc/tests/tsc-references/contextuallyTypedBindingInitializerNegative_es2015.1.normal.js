function f({ show: showRename = (v)=>v  }) {}
function f2({ "show": showRename = (v)=>v  }) {}
function f3({ ["show"]: showRename = (v)=>v  }) {}
function ff({ nested: nestedRename = {
    show: (v)=>v
}  }) {}
let { stringIdentity: id = (arg)=>arg.length  } = {
    stringIdentity: (x)=>x
};
function g({ prop =[
    101,
    1234
]  }) {}
function h({ prop ="baz"  }) {}
