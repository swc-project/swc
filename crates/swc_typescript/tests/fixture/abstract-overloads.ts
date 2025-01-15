export abstract class Value {
    protected body?(): string | undefined | Promise<string | undefined>;
    protected footer(): string | undefined {
        return "";
    }
}
function overloadsNonExportDecl(args: string): void;
function overloadsNonExportDecl(args: number): void;
function overloadsNonExportDecl(args: any): void {}
export { overloadsNonExportDecl };
export default function defaultExport(args: string): void;
export default function defaultExport(args: number): void;
export default function defaultExport(args: any): void {}
