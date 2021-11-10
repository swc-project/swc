/**
 * Parent interface.
 * @interface
 */
function Connection() {}

/**
 * Open the connection.
 */
Connection.prototype.open = function() {};

/**
 * Close the connection.
 */
Connection.prototype.close = function() {};

/**
 * Read the specified number of bytes from the connection.
 *
 * @function Connection#read
 * @param {number} bytes - The number of bytes to read.
 * @return {Buffer} The bytes that were read.
 */
Connection.prototype.read = function(bytes) {};

/**
 * Child class.
 * @class
 * @implements Connection
 */
function Socket() {}

/** @override */
Socket.prototype.open = function() {};

/**
 * Close the socket.
 * @param {string} message - A message explaining why the socket is being closed.
 * @override
 */
Socket.prototype.close = function() {};

/** @override */
Socket.prototype.read = function(bytes) {};
