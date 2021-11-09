// Loaded from https://deno.land/x/dnit@dnit-v1.11.0/adl-gen/dnit/manifest.ts


/* @generated from adl module dnit.manifest */

import type * as ADL from "./../runtime/adl.ts";
import type * as sys_types from "./../sys/types.ts";

export type TaskName = ADL.Flavored0<string, "TaskName">;

const TaskName_AST : ADL.ScopedDecl =
  {"moduleName":"dnit.manifest","decl":{"annotations":[],"type_":{"kind":"newtype_","value":{"typeParams":[],"default":{"kind":"nothing"},"typeExpr":{"typeRef":{"kind":"primitive","value":"String"},"parameters":[]}}},"name":"TaskName","version":{"kind":"nothing"}}};

export const snTaskName: ADL.ScopedName = {moduleName:"dnit.manifest", name:"TaskName"};

export function texprTaskName(): ADL.ATypeExpr<TaskName> {
  return {value : {typeRef : {kind: "reference", value : snTaskName}, parameters : []}};
}

export type TrackedFileName = ADL.Flavored0<string, "TrackedFileName">;

const TrackedFileName_AST : ADL.ScopedDecl =
  {"moduleName":"dnit.manifest","decl":{"annotations":[],"type_":{"kind":"newtype_","value":{"typeParams":[],"default":{"kind":"nothing"},"typeExpr":{"typeRef":{"kind":"primitive","value":"String"},"parameters":[]}}},"name":"TrackedFileName","version":{"kind":"nothing"}}};

export const snTrackedFileName: ADL.ScopedName = {moduleName:"dnit.manifest", name:"TrackedFileName"};

export function texprTrackedFileName(): ADL.ATypeExpr<TrackedFileName> {
  return {value : {typeRef : {kind: "reference", value : snTrackedFileName}, parameters : []}};
}

export type TrackedFileHash = ADL.Flavored0<string, "TrackedFileHash">;

const TrackedFileHash_AST : ADL.ScopedDecl =
  {"moduleName":"dnit.manifest","decl":{"annotations":[],"type_":{"kind":"newtype_","value":{"typeParams":[],"default":{"kind":"nothing"},"typeExpr":{"typeRef":{"kind":"primitive","value":"String"},"parameters":[]}}},"name":"TrackedFileHash","version":{"kind":"nothing"}}};

export const snTrackedFileHash: ADL.ScopedName = {moduleName:"dnit.manifest", name:"TrackedFileHash"};

export function texprTrackedFileHash(): ADL.ATypeExpr<TrackedFileHash> {
  return {value : {typeRef : {kind: "reference", value : snTrackedFileHash}, parameters : []}};
}

export type Timestamp = ADL.Flavored0<string, "Timestamp">;

const Timestamp_AST : ADL.ScopedDecl =
  {"moduleName":"dnit.manifest","decl":{"annotations":[],"type_":{"kind":"newtype_","value":{"typeParams":[],"default":{"kind":"nothing"},"typeExpr":{"typeRef":{"kind":"primitive","value":"String"},"parameters":[]}}},"name":"Timestamp","version":{"kind":"nothing"}}};

export const snTimestamp: ADL.ScopedName = {moduleName:"dnit.manifest", name:"Timestamp"};

export function texprTimestamp(): ADL.ATypeExpr<Timestamp> {
  return {value : {typeRef : {kind: "reference", value : snTimestamp}, parameters : []}};
}

export interface TaskData {
  lastExecution: (Timestamp|null);
  trackedFiles: sys_types.Map<TrackedFileName, TrackedFileData>;
}

export function makeTaskData(
  input: {
    lastExecution?: (Timestamp|null),
    trackedFiles: sys_types.Map<TrackedFileName, TrackedFileData>,
  }
): TaskData {
  return {
    lastExecution: input.lastExecution === undefined ? null : input.lastExecution,
    trackedFiles: input.trackedFiles,
  };
}

const TaskData_AST : ADL.ScopedDecl =
  {"moduleName":"dnit.manifest","decl":{"annotations":[],"type_":{"kind":"struct_","value":{"typeParams":[],"fields":[{"annotations":[],"serializedName":"lastExecution","default":{"kind":"just","value":null},"name":"lastExecution","typeExpr":{"typeRef":{"kind":"primitive","value":"Nullable"},"parameters":[{"typeRef":{"kind":"reference","value":{"moduleName":"dnit.manifest","name":"Timestamp"}},"parameters":[]}]}},{"annotations":[],"serializedName":"trackedFiles","default":{"kind":"nothing"},"name":"trackedFiles","typeExpr":{"typeRef":{"kind":"reference","value":{"moduleName":"sys.types","name":"Map"}},"parameters":[{"typeRef":{"kind":"reference","value":{"moduleName":"dnit.manifest","name":"TrackedFileName"}},"parameters":[]},{"typeRef":{"kind":"reference","value":{"moduleName":"dnit.manifest","name":"TrackedFileData"}},"parameters":[]}]}}]}},"name":"TaskData","version":{"kind":"nothing"}}};

export const snTaskData: ADL.ScopedName = {moduleName:"dnit.manifest", name:"TaskData"};

export function texprTaskData(): ADL.ATypeExpr<TaskData> {
  return {value : {typeRef : {kind: "reference", value : snTaskData}, parameters : []}};
}

export interface TrackedFileData {
  hash: TrackedFileHash;
  timestamp: Timestamp;
}

export function makeTrackedFileData(
  input: {
    hash: TrackedFileHash,
    timestamp: Timestamp,
  }
): TrackedFileData {
  return {
    hash: input.hash,
    timestamp: input.timestamp,
  };
}

const TrackedFileData_AST : ADL.ScopedDecl =
  {"moduleName":"dnit.manifest","decl":{"annotations":[],"type_":{"kind":"struct_","value":{"typeParams":[],"fields":[{"annotations":[],"serializedName":"hash","default":{"kind":"nothing"},"name":"hash","typeExpr":{"typeRef":{"kind":"reference","value":{"moduleName":"dnit.manifest","name":"TrackedFileHash"}},"parameters":[]}},{"annotations":[],"serializedName":"timestamp","default":{"kind":"nothing"},"name":"timestamp","typeExpr":{"typeRef":{"kind":"reference","value":{"moduleName":"dnit.manifest","name":"Timestamp"}},"parameters":[]}}]}},"name":"TrackedFileData","version":{"kind":"nothing"}}};

export const snTrackedFileData: ADL.ScopedName = {moduleName:"dnit.manifest", name:"TrackedFileData"};

export function texprTrackedFileData(): ADL.ATypeExpr<TrackedFileData> {
  return {value : {typeRef : {kind: "reference", value : snTrackedFileData}, parameters : []}};
}

export interface Manifest {
  tasks: sys_types.Map<TaskName, TaskData>;
}

export function makeManifest(
  input: {
    tasks?: sys_types.Map<TaskName, TaskData>,
  }
): Manifest {
  return {
    tasks: input.tasks === undefined ? [] : input.tasks,
  };
}

const Manifest_AST : ADL.ScopedDecl =
  {"moduleName":"dnit.manifest","decl":{"annotations":[],"type_":{"kind":"struct_","value":{"typeParams":[],"fields":[{"annotations":[],"serializedName":"tasks","default":{"kind":"just","value":[]},"name":"tasks","typeExpr":{"typeRef":{"kind":"reference","value":{"moduleName":"sys.types","name":"Map"}},"parameters":[{"typeRef":{"kind":"reference","value":{"moduleName":"dnit.manifest","name":"TaskName"}},"parameters":[]},{"typeRef":{"kind":"reference","value":{"moduleName":"dnit.manifest","name":"TaskData"}},"parameters":[]}]}}]}},"name":"Manifest","version":{"kind":"nothing"}}};

export const snManifest: ADL.ScopedName = {moduleName:"dnit.manifest", name:"Manifest"};

export function texprManifest(): ADL.ATypeExpr<Manifest> {
  return {value : {typeRef : {kind: "reference", value : snManifest}, parameters : []}};
}

export const _AST_MAP: { [key: string]: ADL.ScopedDecl } = {
  "dnit.manifest.TaskName" : TaskName_AST,
  "dnit.manifest.TrackedFileName" : TrackedFileName_AST,
  "dnit.manifest.TrackedFileHash" : TrackedFileHash_AST,
  "dnit.manifest.Timestamp" : Timestamp_AST,
  "dnit.manifest.TaskData" : TaskData_AST,
  "dnit.manifest.TrackedFileData" : TrackedFileData_AST,
  "dnit.manifest.Manifest" : Manifest_AST
};
