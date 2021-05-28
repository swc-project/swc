({
    emit: function NamedFunctionExpression() {
        console.log("PASS");
    },
    run: function () {
        this.emit();
    },
}.run());
