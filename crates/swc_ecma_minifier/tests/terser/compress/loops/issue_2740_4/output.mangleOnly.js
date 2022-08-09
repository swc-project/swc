L1: for(var r = 0; r < 3; r++){
    L2: for(var a = 0; a < 2; a++){
        break L2;
    }
}
console.log(r, a);
