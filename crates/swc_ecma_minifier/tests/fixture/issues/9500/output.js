let foo = 1;
({
    get 1 () {
        return(// same with get "1"()
        foo = 2, 40);
    }
})["1"], console.log(foo);
