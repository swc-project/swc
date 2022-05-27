export function foo(a) {
    switch(a){
        case ENUM_VALUE:
            {
                const { data: b  } = a;
                call(b);
                break;
            }
        default:
            break;
    }
}
