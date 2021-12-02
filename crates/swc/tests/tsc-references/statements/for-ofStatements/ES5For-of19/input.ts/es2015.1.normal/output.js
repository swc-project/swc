for (let v of []){
    v;
    function foo() {
        for (const v1 of []){
            v1;
        }
    }
}
