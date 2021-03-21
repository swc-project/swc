import { join } from "https://deno.land/std@0.80.0/path/mod.ts";

import { G, OpenAPIV3 } from "../deps.ts";
import { color, log, stringify } from "./log.ts";
import { refine } from "./refine.ts";
import { printEnums } from "./typeScript/enumPrinter.ts";
import { ApiArtifacts, Enums } from "./types.d.ts";

export type Args = {
  _: [string];
  outputDir: string;
};
export type PlatformSpecificApi = {
  loadFile: (path: string) => Promise<Record<string, unknown>>;
  writeTextFile: (path: string, data: string) => Promise<void>;
};

export const main = async (
  { _: [specFile], outputDir }: Args,
  { loadFile, writeTextFile }: PlatformSpecificApi,
) => {
  const writeOutputFile = (path: string, data: string) => {
    log(color.blue(`Writting file:\t${path}`));
    return writeTextFile(path, data);
  };

  log(color.blue(`Loading file:\t${specFile}`));

  const fileContent = await loadFile(specFile as string);
  const { apiArtifacts, enums, gqlSchema, openApi } = await refine(
    fileContent,
  );

  const writeApiArtifacts = (
    apiArtifacts: ApiArtifacts,
    outputDir: string,
  ) =>
    writeOutputFile(
      join(outputDir, `apiArtifacts.json`),
      stringify(apiArtifacts, null, 2),
    );

  const writeTsTypes = (enums: Enums, outputDir: string) =>
    writeOutputFile(
      join(outputDir, `tsTypes.ts`),
      printEnums(enums),
    );

  const writeGraphQLSchema = (gqlSchema: G.GraphQLSchema, outputDir: string) =>
    writeOutputFile(
      join(outputDir, `schema.graphql`),
      G.printSchema(gqlSchema),
    );

  const writeOpenAPIJson = (
    oasDocument: OpenAPIV3.Document,
    outputDir: string,
  ) =>
    writeOutputFile(
      join(outputDir, `openapi.json`),
      stringify(oasDocument, null, 2),
    );

  await Promise.all([
    writeApiArtifacts(apiArtifacts, outputDir),
    writeGraphQLSchema(gqlSchema, outputDir),
    writeOpenAPIJson(openApi as unknown as OpenAPIV3.Document, outputDir),
    writeTsTypes(enums, outputDir),
  ]);

  log(color.green(`ALL DONE`));
};
