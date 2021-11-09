// Loaded from https://deno.land/x/mysql/src/logger.ts


import { log } from "../deps.ts";

let logger = log.getLogger();

export { logger as log };

let isDebug = false;

/** @ignore */
export function debug(func: Function) {
  if (isDebug) {
    func();
  }
}

export interface LoggerConfig {
  /** Enable logging (default: true) */
  enable?: boolean;
  /** The minimal level to print (default: "INFO") */
  level?: log.LevelName;
  /** A deno_std/log.Logger instance to be used as logger. When used, `level` is ignored. */
  logger?: log.Logger;
}

export async function configLogger(config: LoggerConfig) {
  let { enable = true, level = "INFO" } = config;
  if (config.logger) level = config.logger.levelName;
  isDebug = level == "DEBUG";

  if (!enable) {
    logger = new log.Logger("fakeLogger", "NOTSET", {});
    logger.level = 100;
  } else {
    if (!config.logger) {
      await log.setup({
        handlers: {
          console: new log.handlers.ConsoleHandler(level),
        },
        loggers: {
          default: {
            level: "DEBUG",
            handlers: ["console"],
          },
        },
      });
      logger = log.getLogger();
    } else {
      logger = config.logger;
    }
  }
}
