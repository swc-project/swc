class A__2 {
    static B = class B__3 {
        static func2(): Promise<void> {
            return new Promise((resolve__5)=>{
                resolve__5(null);
            });
        }
        static C = class C__6 {
            static async func() {
                await B__3.func2();
            }
        };
    };
}
A__2.B.C.func();
