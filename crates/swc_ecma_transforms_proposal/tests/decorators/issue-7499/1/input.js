class Tests {
    @test
    'computed'() { }

    id() { class Bar { } }
}

function test(fn) {
    return fn;
}


let t = new Tests();
t.id()