
    namespace MyNamespace {
        export enum MyEnum {
            A = 1
        }
        export namespace MyInnerNamespace {
            export enum MyEnum {
                A = 1
            }
        }
    }
    namespace MyNamespace {
        export enum MyEnum {
            B = 1
        }
        export namespace MyInnerNamespace {
            export const Dec2 = 2;
        }
    }
    namespace MyNamespace {
        enum MyEnum {
            A = 2
        }
    }
