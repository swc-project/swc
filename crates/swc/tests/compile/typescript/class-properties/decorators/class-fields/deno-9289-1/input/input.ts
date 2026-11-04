
    export class TestClass {
        public testMethod (args: TestClass.TestArgs)
        {
            return args.param1;
        }
    }

    declare namespace TestClass {
        export interface TestArgs {
            param1: boolean;
        }
    }
