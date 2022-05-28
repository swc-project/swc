import swc from "../../..";
import { dirname, join } from "path";
import { platform } from "os";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

it("should work", async () => {
    await swc.swcpack(['files'], {
        esmLoader: (filename) => {
            return filename;
        }
    })
});
