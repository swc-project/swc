//// [test.ts]
export async function fn() {
    await import('./test');
}
export class cl1 {
    async m() {
        await import('./test');
    }
}
export const obj = {
    async m () {
        await import('./test');
    }
};
export class cl2 {
    constructor(){
        this.p = {
            async m () {
                await import('./test');
            }
        };
    }
}
export const l = async ()=>{
    await import('./test');
};
