import { copyFileSync, linkSync } from "node:fs";
import { run } from "./common.mjs";

/** Copy an image before timing, matching the Windows raw cache storage policy. */
export function copyMeasurementAddon(source, destination) {
    copyFileSync(source, destination);
    if (process.platform === "win32") {
        // A home directory or source image can have NTFS compression enabled.
        // New materialized DLLs clear it, so baselines must do the same. Only
        // disposable measurement files change; the user's directory policy stays.
        run("compact.exe", ["/U", "/F", "/Q", destination]);
    }
}

/** Match an ordinary macOS first install; pin other samples to the cache path. */
export function copyMeasurementCarrier(source, destination, cold = false) {
    copyMeasurementAddon(source, destination);
    // A hardlink suppresses self-replacement. macOS cold samples must exercise
    // the real first-load policy; warm samples deliberately measure cache hits.
    // Link only disposable copies, never the release candidate.
    if (!cold || process.platform !== "darwin")
        linkSync(destination, destination + ".carrier-inode");
}
