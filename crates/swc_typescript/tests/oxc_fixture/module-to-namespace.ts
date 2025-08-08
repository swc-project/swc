// Test module to namespace conversion
export module Foo {
    export var a = 2;
    export function bar(): void {}
}

// Nested modules
export module Outer {
    export module Inner {
        export var x = 1;
    }
}

// Should preserve namespace as-is
export namespace Baz {
    export var c = 3;
}

// Should preserve global as-is
declare global {
    interface GlobalTest {}
}

// Should preserve string modules as-is
declare module "test-module" {
    export var d = 4;
}