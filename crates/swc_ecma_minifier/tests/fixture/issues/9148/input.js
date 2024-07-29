function foo() {
    const obj = {
        clear: function () {
            console.log('clear')
        },
        start: function () {
            setTimeout(function () {
                this.clear();
            });
        }
    };
    return () => obj.start()
};

export default foo()