function f2({ x , y =0  }) {}
function f3({ x =0 , y =0  }) {}
function f4({ x , y  } = {
    x: 0,
    y: 0
}) {}
function f5({ x , y =0  } = {
    x: 0
}) {}
function f6({ x =0 , y =0  } = {}) {}
function f7({ a: { x =0 , y =0  }  } = {
    a: {}
}) {}
function g3([x, y] = [
    0,
    0
]) {}
function g4([x, y = 0] = [
    0
]) {}
function g5([x = 0, y = 0] = []) {}
!function({ x , y  }) {}({
    x: 1,
    y: 1
}), f2({
    x: 1
}), f2({
    x: 1,
    y: 1
}), f3({}), f3({
    x: 1
}), f3({
    y: 1
}), f3({
    x: 1,
    y: 1
}), f4(), f4({
    x: 1,
    y: 1
}), f5(), f5({
    x: 1
}), f5({
    x: 1,
    y: 1
}), f6(), f6({}), f6({
    x: 1
}), f6({
    y: 1
}), f6({
    x: 1,
    y: 1
}), f7(), f7({
    a: {}
}), f7({
    a: {
        x: 1
    }
}), f7({
    a: {
        y: 1
    }
}), f7({
    a: {
        x: 1,
        y: 1
    }
}), function([x, y]) {}([
    1,
    1
]), function([x = 0, y = 0]) {}([
    1,
    1
]), g3(), g3([
    1,
    1
]), g4(), g4([
    1,
    1
]), g5(), g5([
    1,
    1
]);
