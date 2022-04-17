let foo = (a)=>{
    if (0 !== a.y) throw TypeError();
};
export const main = ()=>{
    foo({
        x: 1
    });
};
