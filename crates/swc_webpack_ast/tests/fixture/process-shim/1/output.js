// shim for using process in browser
var process = module.exports = null;
// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.
var cachedSetTimeout;
var cachedClearTimeout;
var queue;
var draining;
var currentQueue;
var queueIndex;
var timeout;
var len;
process.nextTick = function() {
    var args;
};
process.title = null;
process.browser = null;
process.env = null;
process.argv = null;
process.version = null; // empty string to avoid regexp issues
process.versions = null;
process.on = null;
process.addListener = null;
process.once = null;
process.off = null;
process.removeListener = null;
process.removeAllListeners = null;
process.emit = null;
process.prependListener = null;
process.prependOnceListener = null;
process.listeners = null;
process.binding = null;
process.cwd = null;
process.chdir = null;
process.umask = null;
