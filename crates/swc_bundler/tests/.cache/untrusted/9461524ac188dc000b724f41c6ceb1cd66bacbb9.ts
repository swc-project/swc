// Loaded from https://cdn.skypack.dev/-/deprecation@v2.3.1-uvOjAQiALAZPHmrlznlP/dist=es2020,mode=imports/optimized/deprecation.js


class Deprecation extends Error {
  constructor(message) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    this.name = "Deprecation";
  }
}
export {Deprecation};
export default null;
