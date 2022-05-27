var a = {
    get instanceof () {
        return test0;
    },
    set instanceof (value){
        test0 = value;
    },
    set typeof (value){
        test1 = value;
    },
    get typeof () {
        return test1;
    },
    set else (value){
        test2 = value;
    },
    get else () {
        return test2;
    }
};
