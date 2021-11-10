export const run = <T extends Function = () => any>(fn: T) => {
    fn()
}