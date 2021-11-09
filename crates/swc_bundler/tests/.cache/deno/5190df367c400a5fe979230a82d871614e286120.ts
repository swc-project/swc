// Loaded from https://deno.land/x/dnit@dnit-v1.11.0/manifest.ts


import { path, fs } from "./deps.ts";

import * as A from "./adl-gen/dnit/manifest.ts";
import * as J from "./adl-gen/runtime/json.ts";

import { RESOLVER } from "./adl-gen/resolver.ts";
import { ADLMap } from "./ADLMap.ts";
export class Manifest {
  readonly filename: string;
  readonly jsonBinding = J.createJsonBinding(RESOLVER, A.texprManifest());
  tasks: ADLMap<A.TaskName, TaskManifest> = new ADLMap(
    [],
    (k1, k2) => k1 === k2,
  );
  constructor(dir: string, filename: string = ".manifest.json") {
    this.filename = path.join(dir, filename);
  }
  async load() {
    if (await fs.exists(this.filename)) {
      const json: J.Json = JSON.parse(await Deno.readTextFile(this.filename)) as J.Json;
      const mdata = this.jsonBinding.fromJson(json);
      for (const p of mdata.tasks) {
        const taskName: A.TaskName = p.v1;
        const taskData: A.TaskData = p.v2;
        this.tasks.set(taskName, new TaskManifest(taskData));
      }
    }
  }
  async save() {
    if (!await fs.exists(path.dirname(this.filename))) {
    }

    const mdata: A.Manifest = {
      tasks: this.tasks.entries().map((p) => ({ v1: p[0], v2: p[1].toData() })),
    };
    const jsonval = this.jsonBinding.toJson(mdata);
    await Deno.writeTextFile(this.filename, JSON.stringify(jsonval, null, 2));
  }
}
export class TaskManifest {
  public lastExecution: A.Timestamp | null = null;
  trackedFiles: ADLMap<A.TrackedFileName, A.TrackedFileData> = new ADLMap(
    [],
    (k1, k2) => k1 === k2,
  );
  constructor(data: A.TaskData) {
    this.trackedFiles = new ADLMap(data.trackedFiles, (k1, k2) => k1 === k2);
    this.lastExecution = data.lastExecution;
  }

  getFileData(fn: A.TrackedFileName): A.TrackedFileData | undefined {
    return this.trackedFiles.get(fn);
  }
  setFileData(fn: A.TrackedFileName, d: A.TrackedFileData) {
    this.trackedFiles.set(fn, d);
  }
  setExecutionTimestamp() {
    this.lastExecution = (new Date()).toISOString();
  }

  toData(): A.TaskData {
    return {
      lastExecution: this.lastExecution,
      trackedFiles: this.trackedFiles.toData(),
    };
  }
}
