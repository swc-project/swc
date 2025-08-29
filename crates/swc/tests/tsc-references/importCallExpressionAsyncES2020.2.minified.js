//// [test.ts]
export async function fn() {
    await import('./test');
}
export class cl1 {
    async m() {
        await import('./test');
    }
}
export let obj = {
    m: async ()=>{
        await import('./test');
    }
};
export class cl2 {
    constructor(){
        this.p = {
            m: async ()=>{
                await import('./test');
            }
        };
    }
}
export let l = async ()=>{
    await import('./test');
};
