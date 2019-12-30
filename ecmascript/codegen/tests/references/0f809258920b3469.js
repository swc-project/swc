c: {
    a();
    switch(1){
        case 2:
            b();
            if (a) break c;
            for(var b = 3; b < 4; b++){
                if (b > 5) break; // this break refers to the for, not to the switch; thus it
                // shouldn't ruin our optimization
                d.e(b);
            }
            f();
        case 6 + 7:
            g();
            break;
        default:
            h();
    }
}
