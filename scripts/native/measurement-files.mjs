import { copyFileSync } from "node:fs";
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
