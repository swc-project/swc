var a = {
    set b (<invalid>){
        throw 0;
    }
};
({
    ...a
}.b);
