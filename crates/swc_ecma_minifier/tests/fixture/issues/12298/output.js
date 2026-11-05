function fallsThrough(x) {
    switch(1){
        case x:
            console.log("A");
        case 2:
            console.log("B");
            break;
        case 1:
            console.log("C");
    }
}
fallsThrough(1), fallsThrough(0), console.log("A"), console.log("A"), console.log("B");
