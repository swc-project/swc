export interface PackageManager {
    onDidUnloadPackage(callback: (package: Package) => void): Disposable;
}