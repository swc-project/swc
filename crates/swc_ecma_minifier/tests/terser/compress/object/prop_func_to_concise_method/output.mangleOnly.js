({
    emit: function a() {
        console.log("PASS");
    },
    run: function() {
        this.emit();
    }
}.run());
