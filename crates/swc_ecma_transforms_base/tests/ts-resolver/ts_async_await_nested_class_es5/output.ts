class A__1 {
    static B = class B__2 {
        static func2(): Promise<void> {
            return new Promise((resolve__5)=>{
                resolve__5(null);
            });
        }
        static C = class C__6 {
            static async func() {
                await B__2.func2();
            }
        };
    };
}
A__1.B.C.func();
