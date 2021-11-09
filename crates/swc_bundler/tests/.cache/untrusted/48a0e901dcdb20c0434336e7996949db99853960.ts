// Loaded from https://raw.githubusercontent.com/deno-postgres/deno-postgres/master/connection/connection.ts


/*!
 * Substantial parts adapted from https://github.com/brianc/node-postgres
 * which is licensed as follows:
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2010 - 2019 Brian Carlson
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { bold, BufReader, BufWriter, yellow } from "../deps.ts";
import { DeferredStack } from "./deferred.ts";
import { hashMd5Password, readUInt32BE } from "../utils.ts";
import { PacketReader } from "./packet_reader.ts";
import { PacketWriter } from "./packet_writer.ts";
import { parseError, parseNotice } from "./warning.ts";
import {
  Query,
  QueryArrayResult,
  QueryObjectResult,
  QueryResult,
} from "../query/query.ts";
import type { ConnectionParams } from "./connection_params.ts";

export enum ResultType {
  ARRAY,
  OBJECT,
}

export enum Format {
  TEXT = 0,
  BINARY = 1,
}

enum TransactionStatus {
  Idle = "I",
  IdleInTransaction = "T",
  InFailedTransaction = "E",
}

/**
 * This asserts the argument bind response is succesful
 */
function assertArgumentsResponse(msg: Message) {
  switch (msg.type) {
    // bind completed
    case "2":
      // no-op
      break;
    // error response
    case "E":
      throw parseError(msg);
    default:
      throw new Error(`Unexpected frame: ${msg.type}`);
  }
}

function assertSuccessfulStartup(msg: Message) {
  switch (msg.type) {
    case "E":
      throw parseError(msg);
  }
}

// deno-lint-ignore camelcase
function assertSuccessfulAuthentication(auth_message: Message) {
  if (auth_message.type === "E") {
    throw parseError(auth_message);
  } else if (auth_message.type !== "R") {
    throw new Error(`Unexpected auth response: ${auth_message.type}.`);
  }

  const responseCode = auth_message.reader.readInt32();
  if (responseCode !== 0) {
    throw new Error(`Unexpected auth response code: ${responseCode}.`);
  }
}

/**
 * This asserts the query parse response is succesful
 */
function assertQueryResponse(msg: Message) {
  switch (msg.type) {
    // parse completed
    case "1":
      // TODO: add to already parsed queries if
      // query has name, so it's not parsed again
      break;
    // error response
    case "E":
      throw parseError(msg);
    default:
      throw new Error(`Unexpected frame: ${msg.type}`);
  }
}

export class Message {
  public reader: PacketReader;

  constructor(
    public type: string,
    public byteCount: number,
    public body: Uint8Array,
  ) {
    this.reader = new PacketReader(body);
  }
}

export class Column {
  constructor(
    public name: string,
    public tableOid: number,
    public index: number,
    public typeOid: number,
    public columnLength: number,
    public typeModifier: number,
    public format: Format,
  ) {}
}

export class RowDescription {
  constructor(public columnCount: number, public columns: Column[]) {}
}

const decoder = new TextDecoder();
const encoder = new TextEncoder();

//TODO
//Refactor properties to not be lazily initialized
//or to handle their undefined value
export class Connection {
  #bufReader!: BufReader;
  #bufWriter!: BufWriter;
  #conn!: Deno.Conn;
  connected = false;
  #packetWriter = new PacketWriter();
  // TODO
  // Find out what parameters are for
  #parameters: { [key: string]: string } = {};
  // TODO
  // Find out what the pid is for
  #pid?: number;
  #queryLock: DeferredStack<undefined> = new DeferredStack(
    1,
    [undefined],
  );
  // TODO
  // Find out what the secret key is for
  #secretKey?: number;
  // TODO
  // Find out what the transaction status is used for
  #transactionStatus?: TransactionStatus;

  constructor(private connParams: ConnectionParams) {}

  /** Read single message sent by backend */
  private async readMessage(): Promise<Message> {
    // TODO: reuse buffer instead of allocating new ones each for each read
    const header = new Uint8Array(5);
    await this.#bufReader.readFull(header);
    const msgType = decoder.decode(header.slice(0, 1));
    const msgLength = readUInt32BE(header, 1) - 4;
    const msgBody = new Uint8Array(msgLength);
    await this.#bufReader.readFull(msgBody);

    return new Message(msgType, msgLength, msgBody);
  }

  private async serverAcceptsTLS(): Promise<boolean> {
    const writer = this.#packetWriter;
    writer.clear();
    writer
      .addInt32(8)
      .addInt32(80877103)
      .join();

    await this.#bufWriter.write(writer.flush());
    await this.#bufWriter.flush();

    const response = new Uint8Array(1);
    await this.#conn.read(response);

    switch (String.fromCharCode(response[0])) {
      case "S":
        return true;
      case "N":
        return false;
      default:
        throw new Error(
          `Could not check if server accepts SSL connections, server responded with: ${response}`,
        );
    }
  }

  private async sendStartupMessage(): Promise<Message> {
    const writer = this.#packetWriter;
    writer.clear();
    // protocol version - 3.0, written as
    writer.addInt16(3).addInt16(0);
    const connParams = this.connParams;
    // TODO: recognize other parameters
    writer.addCString("user").addCString(connParams.user);
    writer.addCString("database").addCString(connParams.database);
    writer.addCString("application_name").addCString(
      connParams.applicationName,
    );

    // eplicitly set utf-8 encoding
    writer.addCString("client_encoding").addCString("'utf-8'");
    // terminator after all parameters were writter
    writer.addCString("");

    const bodyBuffer = writer.flush();
    const bodyLength = bodyBuffer.length + 4;

    writer.clear();

    const finalBuffer = writer
      .addInt32(bodyLength)
      .add(bodyBuffer)
      .join();

    await this.#bufWriter.write(finalBuffer);
    await this.#bufWriter.flush();

    return await this.readMessage();
  }

  /**
   * https://www.postgresql.org/docs/13/protocol-flow.html#id-1.10.5.7.3
   * */
  async startup() {
    const {
      hostname,
      port,
      tls: {
        enforce: enforceTLS,
      },
    } = this.connParams;

    this.#conn = await Deno.connect({ port, hostname });
    this.#bufWriter = new BufWriter(this.#conn);

    /**
     * https://www.postgresql.org/docs/13/protocol-flow.html#id-1.10.5.7.11
     * */
    if (await this.serverAcceptsTLS()) {
      try {
        //@ts-ignore TS2339
        if (typeof Deno.startTls === "undefined") {
          throw new Error(
            "You need to execute Deno with the `--unstable` argument in order to stablish a TLS connection",
          );
        }
        //@ts-ignore TS2339
        this.#conn = await Deno.startTls(this.#conn, { hostname });
      } catch (e) {
        if (!enforceTLS) {
          console.error(
            bold(yellow("TLS connection failed with message: ")) +
              e.message +
              "\n" +
              bold("Defaulting to non-encrypted connection"),
          );
          this.#conn = await Deno.connect({ port, hostname });
        } else {
          throw e;
        }
      }
      this.#bufWriter = new BufWriter(this.#conn);
    } else if (enforceTLS) {
      throw new Error(
        "The server isn't accepting TLS connections. Change the client configuration so TLS configuration isn't required to connect",
      );
    }

    this.#bufReader = new BufReader(this.#conn);

    try {
      // deno-lint-ignore camelcase
      const startup_response = await this.sendStartupMessage();
      assertSuccessfulStartup(startup_response);
      await this.authenticate(startup_response);

      // Handle connection status
      // (connected but not ready)
      let msg;
      connection_status:
      while (true) {
        msg = await this.readMessage();
        switch (msg.type) {
          // Connection error (wrong database or user)
          case "E":
            await this.processError(msg, false);
            break;
          // backend key data
          case "K":
            this._processBackendKeyData(msg);
            break;
          // parameter status
          case "S":
            this._processParameterStatus(msg);
            break;
          // ready for query
          case "Z": {
            this._processReadyForQuery(msg);
            break connection_status;
          }
          default:
            throw new Error(`Unknown response for startup: ${msg.type}`);
        }
      }

      this.connected = true;
    } catch (e) {
      this.#conn.close();
      throw e;
    }
  }

  // TODO
  // Why is this handling the startup message response?
  /**
   * Will attempt to authenticate with the database using the provided
   * password credentials
   */
  private async authenticate(msg: Message) {
    const code = msg.reader.readInt32();
    switch (code) {
      // pass
      case 0:
        break;
      // cleartext password
      case 3:
        await assertSuccessfulAuthentication(
          await this.authenticateWithClearPassword(),
        );
        break;
      // md5 password
      case 5: {
        const salt = msg.reader.readBytes(4);
        await assertSuccessfulAuthentication(
          await this.authenticateWithMd5(salt),
        );
        break;
      }
      case 7: {
        throw new Error(
          "Database server expected gss authentication, which is not supported at the moment",
        );
      }
      // scram-sha-256 password
      case 10: {
        throw new Error(
          "Database server expected scram-sha-256 authentication, which is not supported at the moment",
        );
      }
      default:
        throw new Error(`Unknown auth message code ${code}`);
    }
  }

  private async authenticateWithClearPassword(): Promise<Message> {
    this.#packetWriter.clear();
    const password = this.connParams.password || "";
    const buffer = this.#packetWriter.addCString(password).flush(0x70);

    await this.#bufWriter.write(buffer);
    await this.#bufWriter.flush();

    return this.readMessage();
  }

  private async authenticateWithMd5(salt: Uint8Array): Promise<Message> {
    this.#packetWriter.clear();

    if (!this.connParams.password) {
      throw new Error("Auth Error: attempting MD5 auth with password unset");
    }

    const password = hashMd5Password(
      this.connParams.password,
      this.connParams.user,
      salt,
    );
    const buffer = this.#packetWriter.addCString(password).flush(0x70);

    await this.#bufWriter.write(buffer);
    await this.#bufWriter.flush();

    return this.readMessage();
  }

  private _processBackendKeyData(msg: Message) {
    this.#pid = msg.reader.readInt32();
    this.#secretKey = msg.reader.readInt32();
  }

  private _processParameterStatus(msg: Message) {
    // TODO: should we save all parameters?
    const key = msg.reader.readCString();
    const value = msg.reader.readCString();
    this.#parameters[key] = value;
  }

  private _processReadyForQuery(msg: Message) {
    const txStatus = msg.reader.readByte();
    this.#transactionStatus = String.fromCharCode(
      txStatus,
    ) as TransactionStatus;
  }

  private async _readReadyForQuery() {
    const msg = await this.readMessage();

    if (msg.type !== "Z") {
      throw new Error(
        `Unexpected message type: ${msg.type}, expected "Z" (ReadyForQuery)`,
      );
    }

    this._processReadyForQuery(msg);
  }

  private async _simpleQuery(
    query: Query,
    type: ResultType,
  ): Promise<QueryResult> {
    this.#packetWriter.clear();

    const buffer = this.#packetWriter.addCString(query.text).flush(0x51);

    await this.#bufWriter.write(buffer);
    await this.#bufWriter.flush();

    let result;
    if (type === ResultType.ARRAY) {
      result = new QueryArrayResult(query);
    } else {
      result = new QueryObjectResult(query);
    }

    let msg: Message;

    msg = await this.readMessage();

    // Query startup message, executed only once
    switch (msg.type) {
      // row description
      case "T":
        result.loadColumnDescriptions(this.parseRowDescription(msg));
        break;
      // no data
      case "n":
        break;
      // error response
      case "E":
        await this.processError(msg);
        break;
      // notice response
      case "N":
        result.warnings.push(await this.processNotice(msg));
        break;
      // command complete
      // TODO: this is duplicated in next loop
      case "C": {
        const commandTag = this.getCommandTag(msg);
        result.handleCommandComplete(commandTag);
        result.done();
        break;
      }
      default:
        throw new Error(`Unexpected frame: ${msg.type}`);
    }

    // Handle each row returned by the query
    while (true) {
      msg = await this.readMessage();
      switch (msg.type) {
        // data row
        case "D": {
          // this is actually packet read
          result.insertRow(this.parseRowData(msg));
          break;
        }
        // command complete
        case "C": {
          const commandTag = this.getCommandTag(msg);
          result.handleCommandComplete(commandTag);
          result.done();
          break;
        }
        // ready for query
        case "Z":
          this._processReadyForQuery(msg);
          return result;
        // error response
        case "E":
          await this.processError(msg);
          break;
        // notice response
        case "N":
          result.warnings.push(await this.processNotice(msg));
          break;
        case "T":
          result.loadColumnDescriptions(this.parseRowDescription(msg));
          break;
        default:
          throw new Error(`Unexpected frame: ${msg.type}`);
      }
    }
  }

  private async appendQueryToMessage(query: Query) {
    this.#packetWriter.clear();

    const buffer = this.#packetWriter
      .addCString("") // TODO: handle named queries (config.name)
      .addCString(query.text)
      .addInt16(0)
      .flush(0x50);
    await this.#bufWriter.write(buffer);
  }

  private async appendArgumentsToMessage(query: Query) {
    this.#packetWriter.clear();

    const hasBinaryArgs = query.args.some((arg) => arg instanceof Uint8Array);

    // bind statement
    this.#packetWriter.clear();
    this.#packetWriter
      .addCString("") // TODO: unnamed portal
      .addCString(""); // TODO: unnamed prepared statement

    if (hasBinaryArgs) {
      this.#packetWriter.addInt16(query.args.length);

      query.args.forEach((arg) => {
        this.#packetWriter.addInt16(arg instanceof Uint8Array ? 1 : 0);
      });
    } else {
      this.#packetWriter.addInt16(0);
    }

    this.#packetWriter.addInt16(query.args.length);

    query.args.forEach((arg) => {
      if (arg === null || typeof arg === "undefined") {
        this.#packetWriter.addInt32(-1);
      } else if (arg instanceof Uint8Array) {
        this.#packetWriter.addInt32(arg.length);
        this.#packetWriter.add(arg);
      } else {
        const byteLength = encoder.encode(arg).length;
        this.#packetWriter.addInt32(byteLength);
        this.#packetWriter.addString(arg);
      }
    });

    this.#packetWriter.addInt16(0);
    const buffer = this.#packetWriter.flush(0x42);
    await this.#bufWriter.write(buffer);
  }

  /**
   * This function appends the query type (in this case prepared statement)
   * to the message
   */
  private async appendQueryTypeToMessage() {
    this.#packetWriter.clear();

    const buffer = this.#packetWriter.addCString("P").flush(0x44);
    await this.#bufWriter.write(buffer);
  }

  private async appendExecuteToMessage() {
    this.#packetWriter.clear();

    const buffer = this.#packetWriter
      .addCString("") // unnamed portal
      .addInt32(0)
      .flush(0x45);
    await this.#bufWriter.write(buffer);
  }

  private async appendSyncToMessage() {
    this.#packetWriter.clear();

    const buffer = this.#packetWriter.flush(0x53);
    await this.#bufWriter.write(buffer);
  }

  private async processError(msg: Message, recoverable = true) {
    const error = parseError(msg);
    if (recoverable) {
      await this._readReadyForQuery();
    }
    throw error;
  }

  private processNotice(msg: Message) {
    const warning = parseNotice(msg);
    console.error(`${bold(yellow(warning.severity))}: ${warning.message}`);
    return warning;
  }

  // TODO: I believe error handling here is not correct, shouldn't 'sync' message be
  //  sent after error response is received in prepared statements?
  /**
   * https://www.postgresql.org/docs/13/protocol-flow.html#PROTOCOL-FLOW-EXT-QUERY
   */
  private async _preparedQuery(
    query: Query,
    type: ResultType,
  ): Promise<QueryResult> {
    await this.appendQueryToMessage(query);
    await this.appendArgumentsToMessage(query);
    await this.appendQueryTypeToMessage();
    await this.appendExecuteToMessage();
    await this.appendSyncToMessage();
    // send all messages to backend
    await this.#bufWriter.flush();

    await assertQueryResponse(await this.readMessage());
    await assertArgumentsResponse(await this.readMessage());

    let result;
    if (type === ResultType.ARRAY) {
      result = new QueryArrayResult(query);
    } else {
      result = new QueryObjectResult(query);
    }
    let msg: Message;
    msg = await this.readMessage();

    switch (msg.type) {
      // row description
      case "T": {
        const rowDescription = this.parseRowDescription(msg);
        result.loadColumnDescriptions(rowDescription);
        break;
      }
      // no data
      case "n":
        break;
      // error
      case "E":
        await this.processError(msg);
        break;
      default:
        throw new Error(`Unexpected frame: ${msg.type}`);
    }

    outerLoop:
    while (true) {
      msg = await this.readMessage();
      switch (msg.type) {
        // data row
        case "D": {
          // this is actually packet read
          const rawDataRow = this.parseRowData(msg);
          result.insertRow(rawDataRow);
          break;
        }
        // command complete
        case "C": {
          const commandTag = this.getCommandTag(msg);
          result.handleCommandComplete(commandTag);
          result.done();
          break outerLoop;
        }
        // error response
        case "E":
          await this.processError(msg);
          break;
        default:
          throw new Error(`Unexpected frame: ${msg.type}`);
      }
    }

    await this._readReadyForQuery();

    return result;
  }

  async query(query: Query, type: ResultType): Promise<QueryResult> {
    if (!this.connected) {
      throw new Error("The connection hasn't been initialized");
    }
    await this.#queryLock.pop();
    try {
      if (query.args.length === 0) {
        return await this._simpleQuery(query, type);
      } else {
        return await this._preparedQuery(query, type);
      }
    } finally {
      this.#queryLock.push(undefined);
    }
  }

  private parseRowDescription(msg: Message): RowDescription {
    const columnCount = msg.reader.readInt16();
    const columns = [];

    for (let i = 0; i < columnCount; i++) {
      // TODO: if one of columns has 'format' == 'binary',
      //  all of them will be in same format?
      const column = new Column(
        msg.reader.readCString(), // name
        msg.reader.readInt32(), // tableOid
        msg.reader.readInt16(), // index
        msg.reader.readInt32(), // dataTypeOid
        msg.reader.readInt16(), // column
        msg.reader.readInt32(), // typeModifier
        msg.reader.readInt16(), // format
      );
      columns.push(column);
    }

    return new RowDescription(columnCount, columns);
  }

  //TODO
  //Research corner cases where parseRowData can return null values
  // deno-lint-ignore no-explicit-any
  private parseRowData(msg: Message): any[] {
    const fieldCount = msg.reader.readInt16();
    const row = [];

    for (let i = 0; i < fieldCount; i++) {
      const colLength = msg.reader.readInt32();

      if (colLength == -1) {
        row.push(null);
        continue;
      }

      // reading raw bytes here, they will be properly parsed later
      row.push(msg.reader.readBytes(colLength));
    }

    return row;
  }

  private getCommandTag(msg: Message) {
    return msg.reader.readString(msg.byteCount);
  }

  async end(): Promise<void> {
    if (this.connected) {
      const terminationMessage = new Uint8Array([0x58, 0x00, 0x00, 0x00, 0x04]);
      await this.#bufWriter.write(terminationMessage);
      await this.#bufWriter.flush();
      this.#conn.close();
      this.connected = false;
    }
  }
}
