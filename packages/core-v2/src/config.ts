import type { Options } from "@swc/types";

/** Public configuration accepted by the v2 JavaScript API. */
export type V2Options = Options;

/**
 * Converts the versioned public DTO into the shared engine configuration.
 *
 * Keep this function as the only configuration boundary. Breaking v2 configuration changes
 * should be validated and translated here instead of changing the shared Rust engine types.
 */
export function toEngineOptions(options: V2Options | undefined): Options {
    return options ? { ...options } : {};
}
