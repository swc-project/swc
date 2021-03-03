// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/util/fake-client.js


import Formatter from '../formatter.js';

const fakeClient = {
  formatter(builder) {
    return new Formatter(fakeClient, builder);
  },
};

export default fakeClient;
