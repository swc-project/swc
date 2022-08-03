export function foo(e) {
    switch(e){
        case ENUM_VALUE:
            {
                const { data: o  } = e;
                call(o);
                break;
            }
        default:
            break;
    }
}
