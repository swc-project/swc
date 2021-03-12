// Loaded from https://deno.land/x/dndb@0.2.4/src/methods/remove.js


import { matches }  from '../../deps.ts';
import { ReadFileStream, WriteFileStream } from '../storage.ts';

export default async (filename, query) => {
  const readStream = new ReadFileStream(filename);
  const writeStream = new WriteFileStream(filename);
  let removed = [];
  query = query || {};
  return new Promise((resolve, reject) => {
    readStream.on('document', obj => {
      if (!matches(query, obj)) 
        writeStream.emit("write", obj)
      else 
        removed.push(obj)
    })
    readStream.on("end", () => {
      writeStream.emit("end");
    })
    writeStream.on("close", () => {
      return resolve(removed)
    })
  })
}