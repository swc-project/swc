function Decorator() { }

class User {
    @Decorator()
    property: import("./Test").Test
}

// Test.ts

export class Test { }