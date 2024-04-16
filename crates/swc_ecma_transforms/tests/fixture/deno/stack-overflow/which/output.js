export class RealEnvironment {
    env(key) {
        return Deno.env.get(key);
    }
    stat(path) {
        return Deno.stat(path);
    }
    statSync(path) {
        return Deno.statSync(path);
    }
    get os() {
        return Deno.build.os;
    }
}
/** Finds the path to the specified command asynchronously. */ export async function which(command, environment = new RealEnvironment()) {
    const systemInfo = getSystemInfo(command, environment);
    if (systemInfo == null) {
        return undefined;
    }
    for (const pathItem of systemInfo.pathItems){
        const filePath = pathItem + command;
        if (systemInfo.pathExts) {
            for (const pathExt of systemInfo.pathExts){
                const filePath = pathItem + command + pathExt;
                if (await pathMatches(environment, filePath)) {
                    return filePath;
                }
            }
        } else {
            if (await pathMatches(environment, filePath)) {
                return filePath;
            }
        }
    }
    return undefined;
}
async function pathMatches(environment, path) {
    try {
        const result = await environment.stat(path);
        return result.isFile;
    } catch (err) {
        if (err instanceof Deno.errors.PermissionDenied) {
            throw err;
        }
        return false;
    }
}
/** Finds the path to the specified command synchronously. */ export function whichSync(command, environment = new RealEnvironment()) {
    const systemInfo = getSystemInfo(command, environment);
    if (systemInfo == null) {
        return undefined;
    }
    for (const pathItem of systemInfo.pathItems){
        const filePath = pathItem + command;
        if (pathMatchesSync(environment, filePath)) {
            return filePath;
        }
        if (systemInfo.pathExts) {
            for (const pathExt of systemInfo.pathExts){
                const filePath = pathItem + command + pathExt;
                if (pathMatchesSync(environment, filePath)) {
                    return filePath;
                }
            }
        }
    }
    return undefined;
}
function pathMatchesSync(environment, path) {
    try {
        const result = environment.statSync(path);
        return result.isFile;
    } catch (err) {
        if (err instanceof Deno.errors.PermissionDenied) {
            throw err;
        }
        return false;
    }
}
function getSystemInfo(command, environment) {
    const isWindows = environment.os === "windows";
    const envValueSeparator = isWindows ? ";" : ":";
    const path = environment.env("PATH");
    const pathSeparator = isWindows ? "\\" : "/";
    if (path == null) {
        return undefined;
    }
    return {
        pathItems: splitEnvValue(path).map((item)=>normalizeDir(item)),
        pathExts: getPathExts(),
        isNameMatch: isWindows ? (a, b)=>a.toLowerCase() === b.toLowerCase() : (a, b)=>a === b
    };
    function getPathExts() {
        if (!isWindows) {
            return undefined;
        }
        const pathExtText = environment.env("PATHEXT") ?? ".EXE;.CMD;.BAT;.COM";
        const pathExts = splitEnvValue(pathExtText);
        const lowerCaseCommand = command.toLowerCase();
        for (const pathExt of pathExts){
            // Do not use the pathExts if someone has provided a command
            // that ends with the extenion of an executable extension
            if (lowerCaseCommand.endsWith(pathExt.toLowerCase())) {
                return undefined;
            }
        }
        return pathExts;
    }
    function splitEnvValue(value) {
        return value.split(envValueSeparator).map((item)=>item.trim()).filter((item)=>item.length > 0);
    }
    function normalizeDir(dirPath) {
        if (!dirPath.endsWith(pathSeparator)) {
            dirPath += pathSeparator;
        }
        return dirPath;
    }
}
