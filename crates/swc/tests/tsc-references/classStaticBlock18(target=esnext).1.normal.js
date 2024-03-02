//// [classStaticBlock18.ts]
function foo() {
    return class {
        static{
            this.foo = 1;
        }
        static{
            const c = class {
                static{
                    this.bar = 2;
                }
                static{
                // do
                }
            };
        }
    };
}
