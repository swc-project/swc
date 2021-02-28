// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/oracle/utils.js


export function generateCombinedName(logger, postfix, name, subNames) {
  const crypto = require('crypto');
  const limit = 30;
  if (!Array.isArray(subNames)) subNames = subNames ? [subNames] : [];
  const table = name.replace(/\.|-/g, '_');
  const subNamesPart = subNames.join('_');
  let result = `${table}_${
    subNamesPart.length ? subNamesPart + '_' : ''
  }${postfix}`.toLowerCase();
  if (result.length > limit) {
    logger.warn(
      `Automatically generated name "${result}" exceeds ${limit} character ` +
        `limit for Oracle. Using base64 encoded sha1 of that name instead.`
    );
    // generates the sha1 of the name and encode it with base64
    result = crypto
      .createHash('sha1')
      .update(result)
      .digest('base64')
      .replace('=', '');
  }
  return result;
}

export function wrapSqlWithCatch(sql, errorNumberToCatch) {
  return (
    `begin execute immediate '${sql.replace(/'/g, "''")}'; ` +
    `exception when others then if sqlcode != ${errorNumberToCatch} then raise; ` +
    `end if; ` +
    `end;`
  );
}

export function ReturningHelper(columnName) {
  this.columnName = columnName;
}

ReturningHelper.prototype.toString = function () {
  return `[object ReturningHelper:${this.columnName}]`;
};

// If the error is any of these, we'll assume we need to
// mark the connection as failed
export function isConnectionError(err) {
  return [
    'ORA-03114', // not connected to ORACLE
    'ORA-03113', // end-of-file on communication channel
    'ORA-03135', // connection lost contact
    'ORA-12514', // listener does not currently know of service requested in connect descriptor
    'ORA-00022', // invalid session ID; access denied
    'ORA-00028', // your session has been killed
    'ORA-00031', // your session has been marked for kill
    'ORA-00045', // your session has been terminated with no replay
    'ORA-00378', // buffer pools cannot be created as specified
    'ORA-00602', // internal programming exception
    'ORA-00603', // ORACLE server session terminated by fatal error
    'ORA-00609', // could not attach to incoming connection
    'ORA-01012', // not logged on
    'ORA-01041', // internal error. hostdef extension doesn't exist
    'ORA-01043', // user side memory corruption
    'ORA-01089', // immediate shutdown or close in progress
    'ORA-01092', // ORACLE instance terminated. Disconnection forced
    'ORA-02396', // exceeded maximum idle time, please connect again
    'ORA-03122', // attempt to close ORACLE-side window on user side
    'ORA-12153', // TNS'not connected
    'ORA-12537', // TNS'connection closed
    'ORA-12547', // TNS'lost contact
    'ORA-12570', // TNS'packet reader failure
    'ORA-12583', // TNS'no reader
    'ORA-27146', // post/wait initialization failed
    'ORA-28511', // lost RPC connection
    'ORA-56600', // an illegal OCI function call was issued
    'NJS-040',
    'NJS-024',
    'NJS-003',
  ].some(function (prefix) {
    return err.message.indexOf(prefix) === 0;
  });
}

export default {
  generateCombinedName,
  isConnectionError,
  wrapSqlWithCatch,
  ReturningHelper,
};
