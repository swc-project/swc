class StaticBlocks {
    static {
        const block = @{ };
        const branch = @switch (0) { @default: { } };
        const loop = @for (const item of [1, 2]) { };

        function synchronous() { return @{ }; }
        const arrow = () => @{ };
        async function asynchronous() { return @{ }; }
        const asyncArrow = async () => @{ };
        function* generator() { return @{ }; }
        async function* asyncGenerator() { return @{ }; }
    }
}

async function enclosingAsync() {
    class Inner { static { const value = @{ }; } }
}

function* enclosingGenerator() {
    class Inner { static { const value = @{ }; } }
}

async function* enclosingAsyncGenerator() {
    class Inner { static { const value = @{ }; } }
}
