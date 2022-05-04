import { Options, ParseOptions } from './types';

export type BabelifyOptions = {
    /**
     * If it's not specified, transforms will not be applied.
     * 
     * The parser config should be provided via this property when transformations are enabled.
     */
    transforms: Options
} | {

    /**
     * Option for the parser.
     */
    parser: ParseOptions
};