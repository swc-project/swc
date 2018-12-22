
declare module "swc" {
    /**
     * Options for trasnform.
     */
    export interface TransformOption {
        /**
         * 
         * Defaults to false.
         */
        readonly optimize?: boolean;

        readonly globals?: GlobalPassOption;
    }
    /**
     * Options for inline-global pass.
     */
    export interface GlobalPassOption {
        /**
         * Global variables.
         * 
         * e.g. { __DEBUG__: true }
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