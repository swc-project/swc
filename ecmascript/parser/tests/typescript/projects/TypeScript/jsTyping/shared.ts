/* @internal */
namespace ts.server {
    export const ActionSet: ActionSet = "action::set";
    export const ActionInvalidate: ActionInvalidate = "action::invalidate";
    export const ActionPackageInstalled: ActionPackageInstalled = "action::packageInstalled";
    export const EventTypesRegistry: EventTypesRegistry = "event::typesRegistry";
    export const EventBeginInstallTypes: EventBeginInstallTypes = "event::beginInstallTypes";
    export const EventEndInstallTypes: EventEndInstallTypes = "event::endInstallTypes";
    export const EventInitializationFailed: EventInitializationFailed = "event::initializationFailed";

    export namespace Arguments {
        export const GlobalCacheLocation = "--globalTypingsCacheLocation";
        export const LogFile = "--logFile";
        export const EnableTelemetry = "--enableTelemetry";
        export const TypingSafeListLocation = "--typingSafeListLocation";
        export const TypesMapLocation = "--typesMapLocation";
        /**
         * This argument specifies the location of the NPM executable.
         * typingsInstaller will run the command with `${npmLocation} install ...`.
         */
        export const NpmLocation = "--npmLocation";
        /**
         * Flag indicating that the typings installer should try to validate the default npm location.
         * If the default npm is not found when this flag is enabled, fallback to `npm install`
         */
        export const ValidateDefaultNpmLocation = "--validateDefaultNpmLocation";
    }

    export function hasArgument(argumentName: string) {
        return sys.args.indexOf(argumentName) >= 0;
    }

    export function findArgument(argumentName: string): string | undefined {
        const index = sys.args.indexOf(argumentName);
        return index >= 0 && index < sys.args.length - 1
            ? sys.args[index + 1]
            : undefined;
    }

    export function nowString() {
        // E.g. "12:34:56.789"
        const d = new Date();
        return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${d.getMilliseconds()}`;
    }
}
