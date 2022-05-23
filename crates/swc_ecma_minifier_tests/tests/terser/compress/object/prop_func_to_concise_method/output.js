({
    emit: function NamedFunctionExpression() {
        console.log("PASS");
    },
    run() {
        this.emit();
    },
}.run());
