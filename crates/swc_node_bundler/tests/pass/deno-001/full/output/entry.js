function concat(origin, b) {
    const output = new Uint8Array(origin.length + b.length);
    output.set(origin, 0);
    output.set(b, origin.length);
    return output;
}
function copyBytes(src, dst, off = 0) {
    off = Math.max(0, Math.min(off, dst.byteLength));
    const dstBytesAvailable = dst.byteLength - off;
    if (src.byteLength > dstBytesAvailable) src = src.subarray(0, dstBytesAvailable);
    dst.set(src, off);
    return src.byteLength;
}
class DenoStdInternalError extends Error {
    constructor(message){
        super(message);
        this.name = "DenoStdInternalError";
    }
}
function assert(expr, msg = "") {
    if (!expr) throw new DenoStdInternalError(msg);
}
const DEFAULT_BUF_SIZE = 4096;
const MIN_BUF_SIZE = 16;
const MAX_CONSECUTIVE_EMPTY_READS = 100;
const CR = "\r".charCodeAt(0);
const LF = "\n".charCodeAt(0);
class BufferFullError extends Error {
    partial;
    name;
    constructor(partial){
        super("Buffer full"), this.partial = partial, this.name = "BufferFullError";
    }
}
class PartialReadError extends Deno.errors.UnexpectedEof {
    name = "PartialReadError";
    partial;
    constructor(){
        super("Encountered UnexpectedEof, data only partially read");
    }
}
class BufReader {
    buf;
    rd;
    r = 0;
    w = 0;
    eof = false;
    static create(r, size = DEFAULT_BUF_SIZE) {
        return r instanceof BufReader ? r : new BufReader(r, size);
    }
    constructor(rd, size = DEFAULT_BUF_SIZE){
        if (size < MIN_BUF_SIZE) size = MIN_BUF_SIZE;
        this._reset(new Uint8Array(size), rd);
    }
    size() {
        return this.buf.byteLength;
    }
    buffered() {
        return this.w - this.r;
    }
    async _fill() {
        if (this.r > 0) {
            this.buf.copyWithin(0, this.r, this.w);
            this.w -= this.r;
            this.r = 0;
        }
        if (this.w >= this.buf.byteLength) throw Error("bufio: tried to fill full buffer");
        for(let i = MAX_CONSECUTIVE_EMPTY_READS; i > 0; i--){
            const rr = await this.rd.read(this.buf.subarray(this.w));
            if (rr === null) {
                this.eof = true;
                return;
            }
            assert(rr >= 0, "negative read");
            this.w += rr;
            if (rr > 0) return;
        }
        throw new Error(`No progress after ${MAX_CONSECUTIVE_EMPTY_READS} read() calls`);
    }
    reset(r) {
        this._reset(this.buf, r);
    }
    _reset(buf, rd) {
        this.buf = buf;
        this.rd = rd;
        this.eof = false;
    }
    async read(p) {
        let rr = p.byteLength;
        if (p.byteLength === 0) return rr;
        if (this.r === this.w) {
            if (p.byteLength >= this.buf.byteLength) {
                const rr = await this.rd.read(p);
                const nread = rr ?? 0;
                assert(nread >= 0, "negative read");
                return rr;
            }
            this.r = 0;
            this.w = 0;
            rr = await this.rd.read(this.buf);
            if (rr === 0 || rr === null) return rr;
            assert(rr >= 0, "negative read");
            this.w += rr;
        }
        const copied = copyBytes(this.buf.subarray(this.r, this.w), p, 0);
        this.r += copied;
        return copied;
    }
    async readFull(p) {
        let bytesRead = 0;
        while(bytesRead < p.length)try {
            const rr = await this.read(p.subarray(bytesRead));
            if (rr === null) {
                if (bytesRead === 0) return null;
                else throw new PartialReadError();
            }
            bytesRead += rr;
        } catch (err) {
            err.partial = p.subarray(0, bytesRead);
            throw err;
        }
        return p;
    }
    async readByte() {
        while(this.r === this.w){
            if (this.eof) return null;
            await this._fill();
        }
        const c = this.buf[this.r];
        this.r++;
        return c;
    }
    async readString(delim) {
        if (delim.length !== 1) throw new Error("Delimiter should be a single character");
        const buffer = await this.readSlice(delim.charCodeAt(0));
        if (buffer === null) return null;
        return new TextDecoder().decode(buffer);
    }
    async readLine() {
        let line;
        try {
            line = await this.readSlice(LF);
        } catch (err) {
            let { partial } = err;
            assert(partial instanceof Uint8Array, "bufio: caught error from `readSlice()` without `partial` property");
            if (!(err instanceof BufferFullError)) throw err;
            if (!this.eof && partial.byteLength > 0 && partial[partial.byteLength - 1] === CR) {
                assert(this.r > 0, "bufio: tried to rewind past start of buffer");
                this.r--;
                partial = partial.subarray(0, partial.byteLength - 1);
            }
            return {
                line: partial,
                more: !this.eof
            };
        }
        if (line === null) return null;
        if (line.byteLength === 0) return {
            line,
            more: false
        };
        if (line[line.byteLength - 1] == LF) {
            let drop = 1;
            if (line.byteLength > 1 && line[line.byteLength - 2] === CR) drop = 2;
            line = line.subarray(0, line.byteLength - drop);
        }
        return {
            line,
            more: false
        };
    }
    async readSlice(delim) {
        let s = 0;
        let slice;
        while(true){
            let i = this.buf.subarray(this.r + s, this.w).indexOf(delim);
            if (i >= 0) {
                i += s;
                slice = this.buf.subarray(this.r, this.r + i + 1);
                this.r += i + 1;
                break;
            }
            if (this.eof) {
                if (this.r === this.w) return null;
                slice = this.buf.subarray(this.r, this.w);
                this.r = this.w;
                break;
            }
            if (this.buffered() >= this.buf.byteLength) {
                this.r = this.w;
                const oldbuf = this.buf;
                const newbuf = this.buf.slice(0);
                this.buf = newbuf;
                throw new BufferFullError(oldbuf);
            }
            s = this.w - this.r;
            try {
                await this._fill();
            } catch (err) {
                err.partial = slice;
                throw err;
            }
        }
        return slice;
    }
    async peek(n) {
        if (n < 0) throw Error("negative count");
        let avail = this.w - this.r;
        while(avail < n && avail < this.buf.byteLength && !this.eof){
            try {
                await this._fill();
            } catch (err) {
                err.partial = this.buf.subarray(this.r, this.w);
                throw err;
            }
            avail = this.w - this.r;
        }
        if (avail === 0 && this.eof) return null;
        else if (avail < n && this.eof) return this.buf.subarray(this.r, this.r + avail);
        else if (avail < n) throw new BufferFullError(this.buf.subarray(this.r, this.w));
        return this.buf.subarray(this.r, this.r + n);
    }
}
class AbstractBufBase {
    buf;
    usedBufferBytes = 0;
    err = null;
    size() {
        return this.buf.byteLength;
    }
    available() {
        return this.buf.byteLength - this.usedBufferBytes;
    }
    buffered() {
        return this.usedBufferBytes;
    }
}
class BufWriter extends AbstractBufBase {
    writer;
    static create(writer, size = DEFAULT_BUF_SIZE) {
        return writer instanceof BufWriter ? writer : new BufWriter(writer, size);
    }
    constructor(writer, size = DEFAULT_BUF_SIZE){
        super(), this.writer = writer;
        if (size <= 0) size = DEFAULT_BUF_SIZE;
        this.buf = new Uint8Array(size);
    }
    reset(w) {
        this.err = null;
        this.usedBufferBytes = 0;
        this.writer = w;
    }
    async flush() {
        if (this.err !== null) throw this.err;
        if (this.usedBufferBytes === 0) return;
        try {
            await Deno.writeAll(this.writer, this.buf.subarray(0, this.usedBufferBytes));
        } catch (e) {
            this.err = e;
            throw e;
        }
        this.buf = new Uint8Array(this.buf.length);
        this.usedBufferBytes = 0;
    }
    async write(data) {
        if (this.err !== null) throw this.err;
        if (data.length === 0) return 0;
        let totalBytesWritten = 0;
        let numBytesWritten = 0;
        while(data.byteLength > this.available()){
            if (this.buffered() === 0) try {
                numBytesWritten = await this.writer.write(data);
            } catch (e) {
                this.err = e;
                throw e;
            }
            else {
                numBytesWritten = copyBytes(data, this.buf, this.usedBufferBytes);
                this.usedBufferBytes += numBytesWritten;
                await this.flush();
            }
            totalBytesWritten += numBytesWritten;
            data = data.subarray(numBytesWritten);
        }
        numBytesWritten = copyBytes(data, this.buf, this.usedBufferBytes);
        this.usedBufferBytes += numBytesWritten;
        totalBytesWritten += numBytesWritten;
        return totalBytesWritten;
    }
}
const encoder = new TextEncoder();
function encode(input) {
    return encoder.encode(input);
}
const decoder = new TextDecoder();
function decode(input) {
    return decoder.decode(input);
}
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/g;
function str(buf) {
    if (buf == null) return "";
    else return decode(buf);
}
function charCode(s) {
    return s.charCodeAt(0);
}
class TextProtoReader {
    r;
    constructor(r){
        this.r = r;
    }
    async readLine() {
        const s = await this.readLineSlice();
        if (s === null) return null;
        return str(s);
    }
    async readMIMEHeader() {
        const m = new Headers();
        let line;
        let buf = await this.r.peek(1);
        if (buf === null) return null;
        else if (buf[0] == charCode(" ") || buf[0] == charCode("\t")) line = await this.readLineSlice();
        buf = await this.r.peek(1);
        if (buf === null) throw new Deno.errors.UnexpectedEof();
        else if (buf[0] == charCode(" ") || buf[0] == charCode("\t")) throw new Deno.errors.InvalidData(`malformed MIME header initial line: ${str(line)}`);
        while(true){
            const kv = await this.readLineSlice();
            if (kv === null) throw new Deno.errors.UnexpectedEof();
            if (kv.byteLength === 0) return m;
            let i = kv.indexOf(charCode(":"));
            if (i < 0) throw new Deno.errors.InvalidData(`malformed MIME header line: ${str(kv)}`);
            const key = str(kv.subarray(0, i));
            if (key == "") continue;
            i++;
            while(i < kv.byteLength && (kv[i] == charCode(" ") || kv[i] == charCode("\t")))i++;
            const value = str(kv.subarray(i)).replace(invalidHeaderCharRegex, encodeURI);
            try {
                m.append(key, value);
            } catch  {}
        }
    }
    async readLineSlice() {
        let line;
        while(true){
            const r = await this.r.readLine();
            if (r === null) return null;
            const { line: l, more } = r;
            if (!line && !more) {
                if (this.skipSpace(l) === 0) return new Uint8Array(0);
                return l;
            }
            line = line ? concat(line, l) : l;
            if (!more) break;
        }
        return line;
    }
    skipSpace(l) {
        let n = 0;
        for(let i = 0; i < l.length; i++){
            if (l[i] === charCode(" ") || l[i] === charCode("\t")) continue;
            n++;
        }
        return n;
    }
}
/*#__PURE__*/ (function(Status) {
    return Status;
})({});
const STATUS_TEXT = new Map([]);
function deferred() {
    let methods;
    const promise = new Promise((resolve, reject)=>{
        methods = {
            resolve,
            reject
        };
    });
    return Object.assign(promise, methods);
}
class MuxAsyncIterator {
    iteratorCount = 0;
    yields = [];
    throws = [];
    signal = deferred();
    add(iterator) {
        ++this.iteratorCount;
        this.callIteratorNext(iterator);
    }
    async callIteratorNext(iterator) {
        try {
            const { value, done } = await iterator.next();
            if (done) --this.iteratorCount;
            else this.yields.push({
                iterator,
                value
            });
        } catch (e) {
            this.throws.push(e);
        }
        this.signal.resolve();
    }
    async *iterate() {
        while(this.iteratorCount > 0){
            await this.signal;
            for(let i = 0; i < this.yields.length; i++){
                const { iterator, value } = this.yields[i];
                yield value;
                this.callIteratorNext(iterator);
            }
            if (this.throws.length) {
                for (const e of this.throws)throw e;
                this.throws.length = 0;
            }
            this.yields.length = 0;
            this.signal = deferred();
        }
    }
    [Symbol.asyncIterator]() {
        return this.iterate();
    }
}
function emptyReader() {
    return {
        read (_) {
            return Promise.resolve(null);
        }
    };
}
function bodyReader(contentLength, r) {
    let totalRead = 0;
    let finished = false;
    async function read(buf) {
        if (finished) return null;
        let result;
        const remaining = contentLength - totalRead;
        if (remaining >= buf.byteLength) result = await r.read(buf);
        else {
            const readBuf = buf.subarray(0, remaining);
            result = await r.read(readBuf);
        }
        if (result !== null) totalRead += result;
        finished = totalRead === contentLength;
        return result;
    }
    return {
        read
    };
}
function chunkedBodyReader(h, r) {
    const tp = new TextProtoReader(r);
    let finished = false;
    const chunks = [];
    async function read(buf) {
        if (finished) return null;
        const [chunk] = chunks;
        if (chunk) {
            const chunkRemaining = chunk.data.byteLength - chunk.offset;
            const readLength = Math.min(chunkRemaining, buf.byteLength);
            for(let i = 0; i < readLength; i++)buf[i] = chunk.data[chunk.offset + i];
            chunk.offset += readLength;
            if (chunk.offset === chunk.data.byteLength) {
                chunks.shift();
                if (await tp.readLine() === null) throw new Deno.errors.UnexpectedEof();
            }
            return readLength;
        }
        const line = await tp.readLine();
        if (line === null) throw new Deno.errors.UnexpectedEof();
        const [chunkSizeString] = line.split(";");
        const chunkSize = parseInt(chunkSizeString, 16);
        if (Number.isNaN(chunkSize) || chunkSize < 0) throw new Error("Invalid chunk size");
        if (chunkSize > 0) {
            if (chunkSize > buf.byteLength) {
                let eof = await r.readFull(buf);
                if (eof === null) throw new Deno.errors.UnexpectedEof();
                const restChunk = new Uint8Array(chunkSize - buf.byteLength);
                eof = await r.readFull(restChunk);
                if (eof === null) throw new Deno.errors.UnexpectedEof();
                else chunks.push({
                    offset: 0,
                    data: restChunk
                });
                return buf.byteLength;
            } else {
                const bufToFill = buf.subarray(0, chunkSize);
                const eof = await r.readFull(bufToFill);
                if (eof === null) throw new Deno.errors.UnexpectedEof();
                if (await tp.readLine() === null) throw new Deno.errors.UnexpectedEof();
                return chunkSize;
            }
        } else {
            assert(chunkSize === 0);
            if (await r.readLine() === null) throw new Deno.errors.UnexpectedEof();
            await readTrailers(h, r);
            finished = true;
            return null;
        }
    }
    return {
        read
    };
}
function isProhibidedForTrailer(key) {
    const s = new Set([
        "transfer-encoding",
        "content-length",
        "trailer"
    ]);
    return s.has(key.toLowerCase());
}
async function readTrailers(headers, r) {
    const trailers = parseTrailer(headers.get("trailer"));
    if (trailers == null) return;
    const trailerNames = [
        ...trailers.keys()
    ];
    const tp = new TextProtoReader(r);
    const result = await tp.readMIMEHeader();
    if (result == null) throw new Deno.errors.InvalidData("Missing trailer header.");
    const undeclared = [
        ...result.keys()
    ].filter((k)=>!trailerNames.includes(k));
    if (undeclared.length > 0) throw new Deno.errors.InvalidData(`Undeclared trailers: ${Deno.inspect(undeclared)}.`);
    for (const [k, v] of result)headers.append(k, v);
    const missingTrailers = trailerNames.filter((k)=>!result.has(k));
    if (missingTrailers.length > 0) throw new Deno.errors.InvalidData(`Missing trailers: ${Deno.inspect(missingTrailers)}.`);
    headers.delete("trailer");
}
function parseTrailer(field) {
    if (field == null) return undefined;
    const trailerNames = field.split(",").map((v)=>v.trim().toLowerCase());
    if (trailerNames.length === 0) throw new Deno.errors.InvalidData("Empty trailer header.");
    const prohibited = trailerNames.filter((k)=>isProhibidedForTrailer(k));
    if (prohibited.length > 0) throw new Deno.errors.InvalidData(`Prohibited trailer names: ${Deno.inspect(prohibited)}.`);
    return new Headers(trailerNames.map((key)=>[
            key,
            ""
        ]));
}
async function writeChunkedBody(w, r) {
    const writer = BufWriter.create(w);
    for await (const chunk of Deno.iter(r)){
        if (chunk.byteLength <= 0) continue;
        const start = encoder.encode(`${chunk.byteLength.toString(16)}\r\n`);
        const end = encoder.encode("\r\n");
        await writer.write(start);
        await writer.write(chunk);
        await writer.write(end);
    }
    const endChunk = encoder.encode("0\r\n\r\n");
    await writer.write(endChunk);
}
async function writeTrailers(w, headers, trailers) {
    const trailer = headers.get("trailer");
    if (trailer === null) throw new TypeError("Missing trailer header.");
    const transferEncoding = headers.get("transfer-encoding");
    if (transferEncoding === null || !transferEncoding.match(/^chunked/)) throw new TypeError(`Trailers are only allowed for "transfer-encoding: chunked", got "transfer-encoding: ${transferEncoding}".`);
    const writer = BufWriter.create(w);
    const trailerNames = trailer.split(",").map((s)=>s.trim().toLowerCase());
    const prohibitedTrailers = trailerNames.filter((k)=>isProhibidedForTrailer(k));
    if (prohibitedTrailers.length > 0) throw new TypeError(`Prohibited trailer names: ${Deno.inspect(prohibitedTrailers)}.`);
    const undeclared = [
        ...trailers.keys()
    ].filter((k)=>!trailerNames.includes(k));
    if (undeclared.length > 0) throw new TypeError(`Undeclared trailers: ${Deno.inspect(undeclared)}.`);
    for (const [key, value] of trailers)await writer.write(encoder.encode(`${key}: ${value}\r\n`));
    await writer.write(encoder.encode("\r\n"));
    await writer.flush();
}
async function writeResponse(w, r) {
    const protoMajor = 1;
    const protoMinor = 1;
    const statusCode = r.status || 200;
    const statusText = STATUS_TEXT.get(statusCode);
    const writer = BufWriter.create(w);
    if (!statusText) throw new Deno.errors.InvalidData("Bad status code");
    if (!r.body) r.body = new Uint8Array();
    if (typeof r.body === "string") r.body = encoder.encode(r.body);
    let out = `HTTP/${protoMajor}.${protoMinor} ${statusCode} ${statusText}\r\n`;
    const headers = r.headers ?? new Headers();
    if (r.body && !headers.get("content-length")) {
        if (r.body instanceof Uint8Array) out += `content-length: ${r.body.byteLength}\r\n`;
        else if (!headers.get("transfer-encoding")) out += "transfer-encoding: chunked\r\n";
    }
    for (const [key, value] of headers)out += `${key}: ${value}\r\n`;
    out += `\r\n`;
    const header = encoder.encode(out);
    const n = await writer.write(header);
    assert(n === header.byteLength);
    if (r.body instanceof Uint8Array) {
        const n = await writer.write(r.body);
        assert(n === r.body.byteLength);
    } else if (headers.has("content-length")) {
        const contentLength = headers.get("content-length");
        assert(contentLength != null);
        const bodyLength = parseInt(contentLength);
        const n = await Deno.copy(r.body, writer);
        assert(n === bodyLength);
    } else await writeChunkedBody(writer, r.body);
    if (r.trailers) {
        const t = await r.trailers();
        await writeTrailers(writer, headers, t);
    }
    await writer.flush();
}
class ServerRequest {
    url;
    method;
    proto;
    protoMinor;
    protoMajor;
    headers;
    conn;
    r;
    w;
    done = deferred();
    _contentLength = undefined;
    get contentLength() {
        if (this._contentLength === undefined) {
            const cl = this.headers.get("content-length");
            if (cl) {
                this._contentLength = parseInt(cl);
                if (Number.isNaN(this._contentLength)) this._contentLength = null;
            } else this._contentLength = null;
        }
        return this._contentLength;
    }
    _body = null;
    get body() {
        if (!this._body) {
            if (this.contentLength != null) this._body = bodyReader(this.contentLength, this.r);
            else {
                const transferEncoding = this.headers.get("transfer-encoding");
                if (transferEncoding != null) {
                    const parts = transferEncoding.split(",").map((e)=>e.trim().toLowerCase());
                    assert(parts.includes("chunked"), 'transfer-encoding must include "chunked" if content-length is not set');
                    this._body = chunkedBodyReader(this.headers, this.r);
                } else this._body = emptyReader();
            }
        }
        return this._body;
    }
    async respond(r) {
        let err;
        try {
            await writeResponse(this.w, r);
        } catch (e) {
            try {
                this.conn.close();
            } catch  {}
            err = e;
        }
        this.done.resolve(err);
        if (err) throw err;
    }
    finalized = false;
    async finalize() {
        if (this.finalized) return;
        const body = this.body;
        const buf = new Uint8Array(1024);
        while(await body.read(buf) !== null);
        this.finalized = true;
    }
}
function parseHTTPVersion(vers) {
    switch(vers){
        case "HTTP/1.1":
            return [
                1,
                1
            ];
        case "HTTP/1.0":
            return [
                1,
                0
            ];
        default:
            {
                const Big = 1000000;
                if (!vers.startsWith("HTTP/")) break;
                const dot = vers.indexOf(".");
                if (dot < 0) break;
                const majorStr = vers.substring(vers.indexOf("/") + 1, dot);
                const major = Number(majorStr);
                if (!Number.isInteger(major) || major < 0 || major > Big) break;
                const minorStr = vers.substring(dot + 1);
                const minor = Number(minorStr);
                if (!Number.isInteger(minor) || minor < 0 || minor > Big) break;
                return [
                    major,
                    minor
                ];
            }
    }
    throw new Error(`malformed HTTP version ${vers}`);
}
async function readRequest(conn, bufr) {
    const tp = new TextProtoReader(bufr);
    const firstLine = await tp.readLine();
    if (firstLine === null) return null;
    const headers = await tp.readMIMEHeader();
    if (headers === null) throw new Deno.errors.UnexpectedEof();
    const req = new ServerRequest();
    req.conn = conn;
    req.r = bufr;
    [req.method, req.url, req.proto] = firstLine.split(" ", 3);
    [req.protoMinor, req.protoMajor] = parseHTTPVersion(req.proto);
    req.headers = headers;
    fixLength(req);
    return req;
}
class Server {
    listener;
    closing;
    connections;
    constructor(listener){
        this.listener = listener;
        this.closing = false;
        this.connections = [];
    }
    close() {
        this.closing = true;
        this.listener.close();
        for (const conn of this.connections)try {
            conn.close();
        } catch (e) {
            if (!(e instanceof Deno.errors.BadResource)) throw e;
        }
    }
    async *iterateHttpRequests(conn) {
        const reader = new BufReader(conn);
        const writer = new BufWriter(conn);
        while(!this.closing){
            let request;
            try {
                request = await readRequest(conn, reader);
            } catch (error) {
                if (error instanceof Deno.errors.InvalidData || error instanceof Deno.errors.UnexpectedEof) await writeResponse(writer, {
                    status: 400,
                    body: encode(`${error.message}\r\n\r\n`)
                });
                break;
            }
            if (request === null) break;
            request.w = writer;
            yield request;
            const responseError = await request.done;
            if (responseError) {
                this.untrackConnection(request.conn);
                return;
            }
            await request.finalize();
        }
        this.untrackConnection(conn);
        try {
            conn.close();
        } catch (e) {}
    }
    trackConnection(conn) {
        this.connections.push(conn);
    }
    untrackConnection(conn) {
        const index = this.connections.indexOf(conn);
        if (index !== -1) this.connections.splice(index, 1);
    }
    async *acceptConnAndIterateHttpRequests(mux) {
        if (this.closing) return;
        let conn;
        try {
            conn = await this.listener.accept();
        } catch (error) {
            if (error instanceof Deno.errors.BadResource || error instanceof Deno.errors.InvalidData || error instanceof Deno.errors.UnexpectedEof) return mux.add(this.acceptConnAndIterateHttpRequests(mux));
            throw error;
        }
        this.trackConnection(conn);
        mux.add(this.acceptConnAndIterateHttpRequests(mux));
        yield* this.iterateHttpRequests(conn);
    }
    [Symbol.asyncIterator]() {
        const mux = new MuxAsyncIterator();
        mux.add(this.acceptConnAndIterateHttpRequests(mux));
        return mux.iterate();
    }
}
function _parseAddrFromStr(addr) {
    let url;
    try {
        const host = addr.startsWith(":") ? `0.0.0.0${addr}` : addr;
        url = new URL(`http://${host}`);
    } catch  {
        throw new TypeError("Invalid address.");
    }
    if (url.username || url.password || url.pathname != "/" || url.search || url.hash) throw new TypeError("Invalid address.");
    return {
        hostname: url.hostname,
        port: url.port === "" ? 80 : Number(url.port)
    };
}
function serve(addr) {
    if (typeof addr === "string") addr = _parseAddrFromStr(addr);
    const listener = Deno.listen(addr);
    return new Server(listener);
}
async function listenAndServe(addr, handler) {
    const server = serve(addr);
    for await (const request of server)handler(request);
}
function fixLength(req) {
    const contentLength = req.headers.get("Content-Length");
    if (contentLength) {
        const arrClen = contentLength.split(",");
        if (arrClen.length > 1) {
            const distinct = [
                ...new Set(arrClen.map((e)=>e.trim()))
            ];
            if (distinct.length > 1) throw Error("cannot contain multiple Content-Length headers");
            else req.headers.set("Content-Length", distinct[0]);
        }
        const c = req.headers.get("Content-Length");
        if (req.method === "HEAD" && c && c !== "0") throw Error("http: method cannot contain a Content-Length");
        if (c && req.headers.has("transfer-encoding")) throw new Error("http: Transfer-Encoding and Content-Length cannot be send together");
    }
}
listenAndServe({
    port: 8080
}, async (req)=>{});
