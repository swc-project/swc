var E = function(E) {
    E[E["A"] = 0] = "A";
    E[E["B"] = 1] = "B";
    E[E["C"] = 2] = "C";
    E[E["D"] = ((C)=>{
        console.log(E.A, E.B, C, E.F);
        return 2;
    })()] = "D";
    E["F"] = "F";
    return E;
}(E || {});
