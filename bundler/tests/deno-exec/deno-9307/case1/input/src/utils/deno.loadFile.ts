import * as YAML from "https://deno.land/std@0.80.0/encoding/yaml.ts";

export const loadFile = async <T = Record<string, unknown>>(
  path: string,
): Promise<T> => {
  const fileContent = () => Deno.readTextFile(path);
  if (path.endsWith(".json")) {
    return JSON.parse(await fileContent());
  }
  if (/\.ya?ml$/.test(path)) {
    return YAML.parse(await fileContent()) as T;
  }
  throw new Error(
    `Cannot load file "${path}"./n/nOnly .json and .yml or .yaml are supported`,
  );
};
