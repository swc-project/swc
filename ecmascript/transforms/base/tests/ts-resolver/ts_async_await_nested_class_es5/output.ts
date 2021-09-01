class A {
    static B__0 = class B__2 {
        static func2(): Promise<void> {
            return new Promise((resolve__3)=>{
                resolve__3(null);
            });
        }
        static C__0 = class C__4 {
            static async func() {
                await B__2.func2();
            }
        };
    };
}
A.B.C.func();
