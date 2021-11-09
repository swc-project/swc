// Loaded from https://deno.land/x/dndb@0.2.4/src/methods/removeOne.js


import { matches }  from '../../deps.ts';
import { ReadFileStream, WriteFileStream } from '../storage.ts';

export default async (filename, query) => {
  const readStream = new ReadFileStream(filename);
  const writeStream = new WriteFileStream(filename);
  let removed = [];
  query = query || {};
  return new Promise((resolve, reject) => {
    readStream.on('document', obj => {
      if (matches(query, obj) && removed.length == 0) 
        removed.push(obj)
      else if (obj._id !== removed[0]?._id)
        writeStream.emit("write", obj)
    })
    readStream.on("end", () => {
      writeStream.emit("end");
    })
    writeStream.on("close", () => {
      return resolve(removed[0] || null)
    })
  })
}