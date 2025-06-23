let f = async <
    T
>(v: T) => v;

let g = async <
    T
>(v: T)
    : Promise<any> => 
        v;