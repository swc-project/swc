
    function foo() {
        const bar = async (baz = this.baz) => {
            console.log(this);
        }
    }
    