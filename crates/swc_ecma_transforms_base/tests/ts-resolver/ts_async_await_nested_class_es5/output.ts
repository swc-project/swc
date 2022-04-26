class A__1 {
    static B = class B__2 {
        static func2(): Promise<void> {
            return new Promise((resolve__4)=>{
                resolve__4(null);
            });
        }
        static C = class C__5 {
            static async func() {
                await B__2.func2();
            }
        };
    };
}
A__1.B.C.func();
