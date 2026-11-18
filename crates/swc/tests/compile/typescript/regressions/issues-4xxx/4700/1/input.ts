export * from "another-module";

export function whatever(notExportName: string) {
    const shouldNotBeExportNameAsWell = 123;
    return shouldNotBeExportNameAsWell + notExportName;
}
