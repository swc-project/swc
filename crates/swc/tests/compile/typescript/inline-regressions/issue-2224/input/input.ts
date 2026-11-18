
        const Injectable = () => {};

        @Injectable
        export class TestClass {
            private readonly property = TestClass.name;
        }