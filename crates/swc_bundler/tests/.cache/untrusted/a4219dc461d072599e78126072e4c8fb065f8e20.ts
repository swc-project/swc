// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/migrate/table-resolver.js


//Get schema-aware table name
export function getTableName(tableName, schemaName) {
  return schemaName ? `${schemaName}.${tableName}` : tableName;
}

//Get schema-aware query builder for a given table and schema name
export function getTable(trxOrKnex, tableName, schemaName) {
  return schemaName
    ? trxOrKnex(tableName).withSchema(schemaName)
    : trxOrKnex(tableName);
}
export function getLockTableName(tableName) {
  return tableName + '_lock';
}

export function getLockTableNameWithSchema(tableName, schemaName) {
  return schemaName
    ? schemaName + '.' + getLockTableName(tableName)
    : getLockTableName(tableName);
}

export default {
  getLockTableName,
  getLockTableNameWithSchema,
  getTable,
  getTableName,
};
