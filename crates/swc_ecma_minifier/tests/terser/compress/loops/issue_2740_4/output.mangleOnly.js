L1: for(var o = 0; o < 3; o++){
    L2: for(var r = 0; r < 2; r++){
        break L2;
    }
}
console.log(o, r);
