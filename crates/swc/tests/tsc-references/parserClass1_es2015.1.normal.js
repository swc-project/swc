export class NullLogger {
    information() {
        return false;
    }
    debug() {
        return false;
    }
    warning() {
        return false;
    }
    error() {
        return false;
    }
    fatal() {
        return false;
    }
    log(s) {
    }
}
