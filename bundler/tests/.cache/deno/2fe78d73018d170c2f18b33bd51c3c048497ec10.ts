// Loaded from https://deno.land/x/dndb@0.2.4/src/methods/find.js


import { matches, project }  from '../../deps.ts';
import { ReadFileStream } from '../storage.ts';

export default async (filename, query, projection) => {
  let stream = new ReadFileStream(filename);
  let found = [];
  query = query || {};
  stream.on('document', obj => {
    if (matches(query , obj)){
      obj = Object.keys(projection).length ? project(obj, projection) : obj;
      found.push(obj)
    }
  })
  return new Promise((resolve, reject) => {
    stream.on('end', () => {
      resolve(found);
   })
  })
}