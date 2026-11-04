
    function* foo() {
        try {
            yield 1;
        } catch(e) {
            console.log(2);
        }
    }
    