b: switch(1){
    case 2:
        a();
        for(;;)break b;
        c();
        break;
    case 3 + 4:
        d();
    default:
        e();
}
