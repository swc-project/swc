L1: for(var r = 0; r < 3; r++){
    break L1;
    L2: for(var o = 0; o < 2; o++){
        break L2;
    }
}
console.log(r, o);
