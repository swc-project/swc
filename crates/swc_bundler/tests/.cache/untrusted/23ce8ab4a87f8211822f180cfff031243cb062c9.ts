// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/util/save-async-stack.js


export default function saveAsyncStack(instance, lines) {
  if (instance.client.config.asyncStackTraces) {
    // a hack to get a callstack into the client code despite this
    // node.js bug https://github.com/nodejs/node/issues/11865
    const stackByLines = new Error().stack.split('\n');
    stackByLines.splice(0, lines);
    instance._asyncStack = stackByLines;
  }
};
