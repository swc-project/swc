export function foo(a) {
    switch(a){
        case ENUM_VALUE:
            {
                const { data: c  } = a;
                call(c);
                break;
            }
        default:
            break;
    }
}
