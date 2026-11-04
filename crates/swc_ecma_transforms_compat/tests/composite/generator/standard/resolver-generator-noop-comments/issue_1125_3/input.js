
    function* foo() {
        try {
            yield 1;
        } finally {
            console.log(2);
        }
    }
    