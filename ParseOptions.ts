export default interface ParseOptions {
    comments: boolean;
    syntax: import('./Syntax').default;
    is_module: boolean;
    target: import('./JscTarget').default;
}
