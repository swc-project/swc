// Loaded from https://deno.land/x/dndb@0.2.4/src/storage.ts


const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8');
import { EventEmitter } from "https://deno.land/std/node/events.ts";
import { BufReader } from "https://deno.land/std/io/bufio.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";

// Ensure datastore initialization on first load

const init = async (filename:string) => {
  if (!existsSync(filename)) {
    await Deno.writeFile(filename, encoder.encode(''))
  }
}

//Write file line by line on a stream

class WriteFileStream extends EventEmitter {
  constructor(private filename: string) {
    super();
    this.stream();
  }
  async stream() {
    const updatedFile = `${this.filename}.updated`;
    await ensureCommit(updatedFile)
    await ensureExists(this.filename)
    const file = Deno.openSync(updatedFile, { write: true, create: true });
    this.on("write", (data) => {
      let uit8 = encoder.encode(JSON.stringify(data)+"\n")
      Deno.writeAllSync(file, uit8)
    })
    this.on('end', async () => {
      file.close()
      await Deno.rename(updatedFile, this.filename)
      this.emit("close")
    })
  }
}

// Writes line by line and commits the datastore

const writeFile = async (filename:string, data:object) => {
  await ensureExists(filename);
  let doc:any = data = encoder.encode(JSON.stringify(data)+"\n");
  await Deno.writeFile(filename, doc, {append: true});
}

// Reads the datastore by streaming and buffering chunks

class ReadFileStream extends EventEmitter {
  constructor(private filename: string) {
    super();
    this.stream();
  }
  async stream() {
    const file = await Deno.open(this.filename);
    const bufReader = new BufReader(file);
    let line: any;
    while ((line = await bufReader.readString('\n')) != null) {
      let doc: object = JSON.parse(line);
      this.emit('document', doc)
    }
    this.emit('end')
    file.close();
  }
}

// Ensures data if file doesn't exists

const ensureExists = async (filename:string) => {
  if (!existsSync(filename)) await check(() => existsSync(filename), 100)
  return
}

// Esures the temp file is merged

const ensureCommit = async (filename:string) => {
  if (existsSync(filename)) await check(() => existsSync(filename), 100)
  return
}

// Check Polyfill

const check = (condition:any, checkTime:number) => {
  let promise = new Promise((resolve, reject) => {
    const timerId = setInterval(() => {
      if (condition()) {
        clearInterval(timerId)
        resolve('done');
      }
    }, checkTime)
  });
  return promise;
}

export {
  writeFile,
  ReadFileStream,
  WriteFileStream,
  init
}
