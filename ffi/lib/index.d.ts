
declare module "swc" {
    export interface TransformOption {
        readonly optimize?: boolean;
        readonly globals?: GlobalPassOption;
    }
    export interface GlobalPassOption {
        /**
         * Global variables
         */
        readonly vars?: { [key: string]: string };
    }

    export interface Output {
        /**
         * Transformed code
         */
        readonly code: string;
        /**
         * Sourcemap (not base64 encoded)
         */
        readonly map: string;
    }

    export function transform(src: string, options?: TransformOption): Output;
    export function transformFileSync(path: string, options?: TransformOption): Output;
}