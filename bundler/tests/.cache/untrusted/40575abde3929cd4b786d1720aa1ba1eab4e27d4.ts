// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/util/batchInsert.js


import _ from '../deps/lodash@4.17.15/index.js';
const chunk = _.chunk;
const flatten = _.flatten;
const isNumber = _.isNumber;
import delay from './delay.js';

export default function batchInsert(
  client,
  tableName,
  batch,
  chunkSize = 1000
) {
  let returning = void 0;
  let transaction = null;

  const runInTransaction = (cb) => {
    if (transaction) {
      return cb(transaction);
    }
    return client.transaction(cb);
  };

  return Object.assign(
    Promise.resolve().then(async () => {
      if (!isNumber(chunkSize) || chunkSize < 1) {
        throw new TypeError(`Invalid chunkSize: ${chunkSize}`);
      }

      if (!Array.isArray(batch)) {
        throw new TypeError(
          `Invalid batch: Expected array, got ${typeof batch}`
        );
      }

      const chunks = chunk(batch, chunkSize);

      //Next tick to ensure wrapper functions are called if needed
      await delay(1);
      return runInTransaction(async (tr) => {
        const chunksResults = [];
        for (const items of chunks) {
          chunksResults.push(await tr(tableName).insert(items, returning));
        }
        return flatten(chunksResults);
      });
    }),
    {
      returning(columns) {
        returning = columns;

        return this;
      },
      transacting(tr) {
        transaction = tr;

        return this;
      },
    }
  );
};
