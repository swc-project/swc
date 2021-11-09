// Loaded from https://deno.land/x/dnit@dnit-v1.11.0/dnit.ts


import { flags, path, log, fs, hash } from "./deps.ts";
import { version } from "./version.ts";

import { textTable } from "./textTable.ts";

import type * as A from "./adl-gen/dnit/manifest.ts";
import { Manifest, TaskManifest } from "./manifest.ts";

import {AsyncQueue} from './asyncQueue.ts';

class ExecContext {
  /// All tasks by name
  taskRegister = new Map<A.TaskName, Task>();

  /// Tasks by target
  targetRegister = new Map<A.TrackedFileName, Task>();

  /// Done or up-to-date tasks
  doneTasks = new Set<Task>();

  /// In progress tasks
  inprogressTasks = new Set<Task>();

  /// Queue for scheduling async work with specified number allowable concurrently.
  asyncQueue : AsyncQueue;

  internalLogger = log.getLogger("internal");
  taskLogger = log.getLogger("task");
  userLogger = log.getLogger("user");

  constructor(
    /// loaded hash manifest
    readonly manifest: Manifest,
    /// commandline args
    readonly args: flags.Args,
  ) {
    if (args["verbose"] !== undefined) {
      this.internalLogger.levelName = "INFO";
    }

    const concurrency = args["concurrency"] || 4;
    this.asyncQueue = new AsyncQueue(concurrency);

    this.internalLogger.info(`Starting ExecContext version: ${version}`);
  }

  getTaskByName(name: A.TaskName): Task | undefined {
    return this.taskRegister.get(name);
  }
}

export interface TaskContext {
  logger: log.Logger;
  task: Task;
  args: flags.Args;
}

function taskContext(ctx: ExecContext, task: Task): TaskContext {
  return {
    logger: ctx.taskLogger,
    task,
    args: ctx.args,
  };
}

export type Action = (ctx: TaskContext) => Promise<void> | void;

export type IsUpToDate = (ctx: TaskContext) => Promise<boolean> | boolean;
export type GetFileHash = (
  filename: A.TrackedFileName,
  stat: Deno.FileInfo
) => Promise<A.TrackedFileHash> | A.TrackedFileHash;
export type GetFileTimestamp = (
  filename: A.TrackedFileName,
  stat: Deno.FileInfo
) => Promise<A.Timestamp> | A.Timestamp;

/** User definition of a task */
export type TaskParams = {
  /// Name: (string) - The key used to initiate a task
  name: A.TaskName;

  /// Description (string) - Freeform text description shown on help
  description?: string;

  /// Action executed on execution of the task (async or sync)
  action: Action;

  /// Optional list of task or file dependencies
  deps?: (Task | TrackedFile | TrackedFilesAsync)[]

  /// Targets (files which will be produced by execution of this task)
  targets?: TrackedFile[];

  /// Custom up-to-date definition - Can be used to make a task *less* up to date.  Eg; use uptodate: runAlways  to run always on request regardless of dependencies being up to date.
  uptodate?: IsUpToDate;
};

/// Convenience function: an up to date always false to run always
export const runAlways: IsUpToDate = async () => false;

function isTask(dep: Task | TrackedFile | TrackedFilesAsync): dep is Task {
  return dep instanceof Task;
}
function isTrackedFile(dep: Task | TrackedFile | TrackedFilesAsync): dep is TrackedFile {
  return dep instanceof TrackedFile;
}
function isTrackedFileAsync(dep: Task | TrackedFile | TrackedFilesAsync): dep is TrackedFilesAsync {
  return dep instanceof TrackedFilesAsync;
}

type StatResult =
| {
  kind: 'fileInfo',
  fileInfo: Deno.FileInfo
}
| {
  kind: 'nonExistent'
}

async function statPath(path: A.TrackedFileName) : Promise<StatResult> {
  try {
    const fileInfo = await Deno.stat(path);
    return {
      kind:'fileInfo',
      fileInfo
    };
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return {
        kind:'nonExistent'
      };
    }
    throw err;
  }
}

export class Task {
  public name: A.TaskName;
  public description?: string;
  public action: Action;
  public task_deps: Set<Task>;
  public file_deps: Set<TrackedFile>;
  public async_files_deps: Set<TrackedFilesAsync>;
  public targets: Set<TrackedFile>;

  public taskManifest: TaskManifest | null = null;
  public uptodate?: IsUpToDate;

  constructor(taskParams: TaskParams) {
    this.name = taskParams.name;
    this.action = taskParams.action;
    this.description = taskParams.description;
    this.task_deps = new Set(
      this.getTaskDeps(taskParams.deps || []),
    );
    this.file_deps = new Set(
      this.getTrackedFiles(taskParams.deps || []),
    );
    this.async_files_deps = new Set(
      this.getTrackedFilesAsync(taskParams.deps || []),
    );
    this.targets = new Set(taskParams.targets || []);
    this.uptodate = taskParams.uptodate;

    for(const f of this.targets) {
      f.setTask(this);
    }
  }

  private getTaskDeps(
    deps: (Task | TrackedFile | TrackedFilesAsync)[],
  ): Task[] {
    return deps.filter(isTask);
  }
  private getTrackedFiles(
    deps: (Task | TrackedFile | TrackedFilesAsync)[],
  ): TrackedFile[] {
    return deps.filter(isTrackedFile);
  }
  private getTrackedFilesAsync(
    deps: (Task | TrackedFile | TrackedFilesAsync)[],
  ): TrackedFilesAsync[] {
    return deps.filter(isTrackedFileAsync);
  }

  async setup(ctx: ExecContext): Promise<void> {
    if(this.taskManifest === null) {
      for (const t of this.targets) {
        ctx.targetRegister.set(t.path, this);
      }

      this.taskManifest = ctx.manifest.tasks.getOrInsert(
        this.name,
        new TaskManifest({
          lastExecution: null,
          trackedFiles: [],
        }),
      );

      // ensure preceding tasks are setup too
      for(const taskDep of this.task_deps) {
        await taskDep.setup(ctx);
      }
      for(const fDep of this.file_deps) {
        const fDepTask = fDep.getTask();
        if(fDepTask !== null) {
          await fDepTask.setup(ctx);
        }
      }
    }
  }

  async exec(ctx: ExecContext): Promise<void> {
    if (ctx.doneTasks.has(this)) {
      return;
    }
    if (ctx.inprogressTasks.has(this)) {
      return;
    }

    ctx.inprogressTasks.add(this);

    // evaluate async file_deps (useful if task depends on a glob of the filesystem)
    for (const afd of this.async_files_deps) {
      const file_deps = await afd.getTrackedFiles();
      for(const fd of file_deps) {
        this.file_deps.add(fd)
      }
    }

    // add task dep on the task that makes the file if its a target
    for (const fd of this.file_deps) {
      const t = ctx.targetRegister.get(fd.path);
      if (t !== undefined) {
        this.task_deps.add(t);
      }
    }

    await this.execDependencies(ctx);

    let actualUpToDate = true;

    actualUpToDate = actualUpToDate && await this.checkFileDeps(ctx);
    ctx.internalLogger.info(`${this.name} checkFileDeps ${actualUpToDate}`);

    actualUpToDate = actualUpToDate && await this.targetsExist(ctx);
    ctx.internalLogger.info(`${this.name} targetsExist ${actualUpToDate}`);

    if (this.uptodate !== undefined) {
      actualUpToDate = actualUpToDate &&
        await this.uptodate(taskContext(ctx, this));
    }
    ctx.internalLogger.info(`${this.name} uptodate ${actualUpToDate}`);

    if (actualUpToDate) {
      ctx.taskLogger.info(`--- ${this.name}`);
    } else {
      ctx.taskLogger.info(`... ${this.name}`);
      await this.action(taskContext(ctx, this));
      ctx.taskLogger.info(`=== ${this.name}`);

      {
        /// recalc & save data of deps:
        this.taskManifest?.setExecutionTimestamp();
        let promisesInProgress: Promise<void>[] = [];
        for (const fdep of this.file_deps) {
          promisesInProgress.push(
            ctx.asyncQueue.schedule( async ()=>{
              const trackedFileData = await fdep.getFileData(ctx)
              this.taskManifest?.setFileData(fdep.path, trackedFileData);
            })
          );
        }
        await Promise.all(promisesInProgress);
      }
    }

    ctx.doneTasks.add(this);
    ctx.inprogressTasks.delete(this);
  }

  private async targetsExist(ctx: ExecContext): Promise<boolean> {
    const tex = await Promise.all(
      Array.from(this.targets).map(async (tf) => ctx.asyncQueue.schedule(()=>
        tf.exists()
      ))
    );
    // all exist: NOT some NOT exist
    return !tex.some((t) => !t);
  }

  private async checkFileDeps(ctx: ExecContext): Promise<boolean> {
    let fileDepsUpToDate = true;
    let promisesInProgress: Promise<void>[] = [];

    const taskManifest = this.taskManifest;
    if (taskManifest === null) {
      throw new Error(`Invalid null taskManifest on ${this.name}`);
    }

    for (const fdep of this.file_deps) {
      promisesInProgress.push(
        ctx.asyncQueue.schedule(async ()=>{
          const r = await fdep.getFileDataOrCached(
            ctx,
            taskManifest.getFileData(fdep.path),
          );
          taskManifest.setFileData(fdep.path, r.tData);
          fileDepsUpToDate = fileDepsUpToDate && r.upToDate;
        })
      );
    }
    await Promise.all(promisesInProgress);
    promisesInProgress = [];
    return fileDepsUpToDate;
  }

  private async execDependencies(ctx: ExecContext) {
    for (const dep of this.task_deps) {
      if (!ctx.doneTasks.has(dep) && !ctx.inprogressTasks.has(dep)) {
        await dep.exec(ctx)
      }
    }
  }
}

export class TrackedFile {
  path: A.TrackedFileName = "";
  #getHash: GetFileHash;
  #getTimestamp: GetFileTimestamp;

  fromTask: Task|null = null;

  constructor(fileParams: FileParams) {
    this.path = path.posix.resolve(fileParams.path);
    this.#getHash = fileParams.getHash || getFileSha1Sum;
    this.#getTimestamp = fileParams.getTimestamp || getFileTimestamp;
  }

  private async stat() : Promise<StatResult> {
    log.getLogger('internal').info(`checking file ${this.path}`);
    return await statPath(this.path);
  }

  async exists(statInput?: StatResult) : Promise<boolean> {
    let statResult = statInput;
    if(statResult === undefined) {
      statResult = await this.stat();
    }
    return statResult.kind === 'fileInfo';
  }

  async getHash(statInput?: StatResult) {
    let statResult = statInput;
    if(statResult === undefined) {
      statResult = await this.stat();
    }
    if(statResult.kind !== 'fileInfo') {
      return "";
    }

    log.getLogger('internal').info(`checking hash on ${this.path}`);
    return this.#getHash(this.path, statResult.fileInfo);
  }

  async getTimestamp(statInput?: StatResult) {
    let statResult = statInput;
    if(statResult === undefined) {
      statResult = await this.stat();
    }
    if(statResult.kind !== 'fileInfo') {
      return "";
    }
    return this.#getTimestamp(this.path, statResult.fileInfo);
  }

  /// whether this is up to date w.r.t. the given TrackedFileData
  async isUpToDate(
    ctx: ExecContext,
    tData: A.TrackedFileData | undefined,
    statInput?: StatResult
  ): Promise<boolean> {
    if (tData === undefined) {
      return false;
    }

    let statResult = statInput;
    if(statResult === undefined) {
      statResult = await this.stat();
    }

    const mtime = await this.getTimestamp(statResult);
    if (mtime === tData.timestamp) {
      return true;
    }
    const hash = await this.getHash(statResult);
    return hash === tData.hash;
  }

  /// Recalculate timestamp and hash data
  async getFileData(ctx: ExecContext, statInput?: StatResult): Promise<A.TrackedFileData> {
    let statResult = statInput;
    if(statResult === undefined) {
      statResult = await this.stat();
    }
    return {
      hash: await this.getHash(statResult),
      timestamp: await this.getTimestamp(statResult),
    };
  }

  /// return given tData if up to date or re-calculate
  async getFileDataOrCached(
    ctx: ExecContext,
    tData: A.TrackedFileData | undefined,
    statInput?:StatResult
  ): Promise<{
    tData: A.TrackedFileData;
    upToDate: boolean;
  }> {
    let statResult = statInput;
    if(statResult === undefined) {
      statResult = await this.stat();
    }

    if (tData !== undefined && await this.isUpToDate(ctx, tData, statResult)) {
      return {
        tData,
        upToDate: true,
      };
    }
    return {
      tData: await this.getFileData(ctx, statResult),
      upToDate: false,
    };
  }

  setTask(t: Task) {
    if(this.fromTask === null) {
      this.fromTask = t;
    }
    else {
      throw new Error("Duplicate tasks generating TrackedFile as target - " + this.path);
    }
  }

  getTask() : Task|null {
    return this.fromTask;
  }
}

export type GenTrackedFiles = ()=>Promise<TrackedFile[]>|TrackedFile[];

export class TrackedFilesAsync {
  kind: 'trackedfilesasync' = 'trackedfilesasync';

  constructor(public gen: GenTrackedFiles) {
  }

  async getTrackedFiles() : Promise<TrackedFile[]> {
    return this.gen();
  }
}

export async function getFileSha1Sum(
  filename: string,
): Promise<A.TrackedFileHash> {
  const data = await Deno.readFile(filename);
  const hashsha1 = hash.createHash("sha1");
  hashsha1.update(data);
  const hashInHex = hashsha1.toString();
  return hashInHex;
}

export async function getFileTimestamp(filename: string, stat: Deno.FileInfo): Promise<A.Timestamp> {
  const mtime = stat.mtime;
  return mtime?.toISOString() || "";
}

/** User params for a tracked file */
export type FileParams = {
  /// File path
  path: string;

  /// Optional function for how to hash the file.   Defaults to the sha1 hash of the file contents.
  /// A file is out of date if the file timestamp and the hash are different than that in the task manifest
  getHash?: GetFileHash;

  /// Optional function for how to get the file timestamp.   Defaults to the actual file timestamp
  getTimestamp?: GetFileTimestamp;
};

/** Generate a trackedfile for tracking */
export function file(fileParams: FileParams | string): TrackedFile {
  if (typeof fileParams === "string") {
    return new TrackedFile({ path: fileParams });
  }
  return new TrackedFile(fileParams);
}
export function trackFile(fileParams: FileParams | string): TrackedFile {
  return file(fileParams);
}

export function asyncFiles(gen: GenTrackedFiles) : TrackedFilesAsync {
  return new TrackedFilesAsync(gen);
}

/** Generate a task */
export function task(taskParams: TaskParams): Task {
  const task = new Task(taskParams);
  return task;
}

function showTaskList(ctx: ExecContext) {
  console.log(
    textTable(
      ["Name", "Description"],
      Array.from(ctx.taskRegister.values()).map((t) => ([
        t.name,
        t.description || "",
      ])),
    ),
  );
}

/// StdErr plaintext handler (no color codes)
class StdErrPlainHandler extends log.handlers.BaseHandler {

  constructor(levelName: log.LevelName) {
    super(levelName, {
      formatter: "{msg}"
    })
  }

  log(msg: string): void {
    Deno.stderr.writeSync(new TextEncoder().encode(msg + "\n"));
  }
}

/// StdErr handler on top of ConsoleHandler (which uses colors)
class StdErrHandler extends log.handlers.ConsoleHandler {
  log(msg: string): void {
    Deno.stderr.writeSync(new TextEncoder().encode(msg + "\n"));
  }
}

export async function setupLogging() {
  await log.setup({
    handlers: {
      stderr: new StdErrHandler("DEBUG"),
      stderrPlain: new StdErrPlainHandler("DEBUG"),
    },

    loggers: {
      // internals of dnit tooling
      internal: {
        level: "WARNING",
        handlers: ["stderrPlain"],
      },

      // basic events eg start of task or task already up to date
      task: {
        level: "INFO",
        handlers: ["stderrPlain"],
      },

      // for user to use within task actions
      user: {
        level: "INFO",
        handlers: ["stderrPlain"],
      },
    },
  });
}

/** Convenience access to a setup logger for tasks */
export function getLogger(): log.Logger {
  return log.getLogger("user");
}

export type ExecResult = {
  success: boolean;
};

/** Execute given commandline args and array of items (task & trackedfile) */
export async function execCli(
  cliArgs: string[],
  tasks: Task[],
): Promise<ExecResult> {
  const args = flags.parse(cliArgs);

  await setupLogging();

  /// directory of user's entrypoint source as discovered by 'launch' util:
  const dnitDir = args["dnitDir"] || "./dnit";
  delete args["dnitDir"];

  const ctx = new ExecContext(new Manifest(dnitDir), args);

  /// register tasks as provided by user's source:
  tasks.forEach((t) => ctx.taskRegister.set(t.name, t));

  let requestedTaskName: string | null = null;
  const positionalArgs = args["_"];
  if (positionalArgs.length > 0) {
    requestedTaskName = `${positionalArgs[0]}`;
  }

  if (requestedTaskName === null) {
    ctx.taskLogger.error("No task name given");
    showTaskList(ctx);
    return { success: false };
  }

  if (requestedTaskName === "list") {
    showTaskList(ctx);
    return { success: true };
  }

  try {
    /// Load manifest (dependency tracking data)
    await ctx.manifest.load();

    /// Run async setup on all tasks:
    await Promise.all(
      Array.from(ctx.taskRegister.values()).map((t) =>
        ctx.asyncQueue.schedule(()=>t.setup(ctx))
      )
    );

    /// Find the requested task:
    const requestedTask = ctx.taskRegister.get(requestedTaskName);
    if (requestedTask !== undefined) {
      /// Execute the requested task:
      await requestedTask.exec(ctx);
    } else {
      ctx.taskLogger.error(`Task ${requestedTaskName} not found`);
    }

    /// Save manifest (dependency tracking data)
    await ctx.manifest.save();

    return { success: true };
  } catch (err) {
    ctx.taskLogger.error("Error", err);
    throw err;
  }
}

/// No-frills setup of an ExecContext (mainly for testing)
export async function execBasic(
  cliArgs: string[],
  tasks: Task[],
  manifest: Manifest,
): Promise<ExecContext> {
  const args = flags.parse(cliArgs);
  const ctx = new ExecContext(manifest, args);
  tasks.forEach((t) => ctx.taskRegister.set(t.name, t));
  await Promise.all(
    Array.from(ctx.taskRegister.values()).map((t) => ctx.asyncQueue.schedule(()=>t.setup(ctx))),
  );
  return ctx;
}

/// Original name 'exec' for execCli
export async function exec(
  cliArgs: string[],
  tasks: Task[],
): Promise<ExecResult> {
  return execCli(cliArgs, tasks);
}
