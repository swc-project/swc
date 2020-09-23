// Repro from #13102

type Handler<T> = {
    onChange: (name: keyof T) => void;
};

function onChangeGenericFunction<T>(handler: Handler<T & { preset: number }>) {
    handler.onChange('preset')
}
