//// [test.ts]
export async function fn() {
    await import('./test') // ONE
    ;
}
export class cl1 {
    async m() {
        await import('./test') // TWO
        ;
    }
}
export const obj = {
    m: async ()=>{
        await import('./test') // THREE
        ;
    }
};
export class cl2 {
    constructor(){
        this.p = {
            m: async ()=>{
                await import('./test') // FOUR
                ;
            }
        };
    }
}
export const l = async ()=>{
    await import('./test') // FIVE
    ;
};
