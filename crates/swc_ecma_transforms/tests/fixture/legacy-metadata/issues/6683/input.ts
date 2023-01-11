function decorator(): PropertyDecorator {
    return () => null
}

class Example {
    @decorator()
    value?: `prefix${string}`;
}