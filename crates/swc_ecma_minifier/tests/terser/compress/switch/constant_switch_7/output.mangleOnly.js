OUT: {
    foo();
    switch(1){
        case 1:
            a();
            if (foo) break OUT;
            for(var a = 0; a < 10; a++){
                if (a > 5) break;
                console.log(a);
            }
            y();
        case 1 + 1:
            bar();
            break;
        default:
            def();
    }
}
