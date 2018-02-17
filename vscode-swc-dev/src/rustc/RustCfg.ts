import { ProcessBuilder } from "../util";


/**
 * `#[cfg(debug_assertions)]`, `#[cfg(target_env="gnu")]`
 */
export default class RustCfg {
    private constructor(
        readonly key: string,
        readonly value: string | true,
    ) { }

    /**
     * Parse output of `rustc --print=cfg`.
     * 
     *  @param line
     *       - `debug_assertions`
     *       - `target_arch="x86_64"`
     */
    static parse(line: string): RustCfg {
        const [key, valueStr] = line.split('=', 2);
        // `"xxx"` -> xxx
        const value = valueStr === undefined ? true : valueStr.substr(1, valueStr.length - 2);

        return new RustCfg(key, value)
    }


}