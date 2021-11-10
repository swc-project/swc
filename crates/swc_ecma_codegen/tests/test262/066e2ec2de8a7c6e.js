c: {
    a();
    switch(1){
        case 2:
            b();
            if (a) break c;
            d();
        case 3 + 4:
            e();
            break;
        default:
            f();
    }
}
