import * as log from "https://deno.land/std/log/mod.ts";

export async function myCLI(): Promise<void> {
    await log.setup({
        handlers: {
            // file: new log.handlers.FileHandler("DEBUG", {
            //     filename: 'my.log'
            // }),
            console: new log.handlers.ConsoleHandler("INFO")
        },
        loggers: {
            default: {
                level: "DEBUG",
                handlers: ["console", "file"]
            }
        }
    });

    log.info("Ok!");
}

if (import.meta.main) {
    myCLI();
}