import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
import { Transaction } from "@solana/web3.js";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
export var getErrorForTransaction = function() {
    var _ref = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee(connection, txid) {
        var tx, errors;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return connection.confirmTransaction(txid, "max");
                case 2:
                    _ctx.next = 4;
                    return connection.getParsedConfirmedTransaction(txid);
                case 4:
                    tx = _ctx.sent;
                    errors = [];
                    if ((tx === null || tx === void 0 ? void 0 : tx.meta) && tx.meta.logMessages) {
                        tx.meta.logMessages.forEach(function(log) {
                            var regex = /Error: (.*)/gm;
                            var m;
                            while((m = regex.exec(log)) !== null){
                                // This is necessary to avoid infinite loops with zero-width matches
                                if (m.index === regex.lastIndex) {
                                    regex.lastIndex++;
                                }
                                if (m.length > 1) {
                                    errors.push(m[1]);
                                }
                            }
                        });
                    }
                    return _ctx.abrupt("return", errors);
                case 8:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function getErrorForTransaction(connection, txid) {
        return _ref.apply(this, arguments);
    };
}();
export var SequenceType;
(function(SequenceType) {
    SequenceType[SequenceType["Sequential"] = 0] = "Sequential";
    SequenceType[SequenceType["Parallel"] = 1] = "Parallel";
    SequenceType[SequenceType["StopOnFailure"] = 2] = "StopOnFailure";
})(SequenceType || (SequenceType = {}));
export function sendTransactionsWithManualRetry(connection, wallet, instructions, signers) {
    return _sendTransactionsWithManualRetry.apply(this, arguments);
}
function _sendTransactionsWithManualRetry() {
    _sendTransactionsWithManualRetry = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee(connection, wallet, instructions, signers) {
        var stopPoint, tries, lastInstructionsLength, toRemoveSigners, ids, filteredSigners, id, txs;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    stopPoint = 0;
                    tries = 0;
                    lastInstructionsLength = null;
                    toRemoveSigners = {};
                    instructions = instructions.filter(function(instr, i) {
                        if (instr.length > 0) {
                            return true;
                        } else {
                            toRemoveSigners[i] = true;
                            return false;
                        }
                    });
                    ids = [];
                    filteredSigners = signers.filter(function(_, i) {
                        return !toRemoveSigners[i];
                    });
                case 7:
                    if (!(stopPoint < instructions.length && tries < 3)) {
                        _ctx.next = 33;
                        break;
                    }
                    instructions = instructions.slice(stopPoint, instructions.length);
                    filteredSigners = filteredSigners.slice(stopPoint, filteredSigners.length);
                    if (instructions.length === lastInstructionsLength) tries = tries + 1;
                    else tries = 0;
                    _ctx.prev = 11;
                    if (!(instructions.length === 1)) {
                        _ctx.next = 20;
                        break;
                    }
                    _ctx.next = 15;
                    return sendTransactionWithRetry(connection, wallet, instructions[0], filteredSigners[0], "single");
                case 15:
                    id = _ctx.sent;
                    ids.push(id.txid);
                    stopPoint = 1;
                    _ctx.next = 24;
                    break;
                case 20:
                    _ctx.next = 22;
                    return sendTransactions(connection, wallet, instructions, filteredSigners, SequenceType.StopOnFailure, "single");
                case 22:
                    txs = _ctx.sent.txs;
                    ids = ids.concat(txs.map(function(t) {
                        return t.txid;
                    }));
                case 24:
                    _ctx.next = 29;
                    break;
                case 26:
                    _ctx.prev = 26;
                    _ctx.t0 = _ctx["catch"](11);
                    console.error(_ctx.t0);
                case 29:
                    console.log("Died on ", stopPoint, "retrying from instruction", instructions[stopPoint], "instructions length is", instructions.length);
                    lastInstructionsLength = instructions.length;
                    _ctx.next = 7;
                    break;
                case 33:
                    return _ctx.abrupt("return", ids);
                case 34:
                case "end":
                    return _ctx.stop();
            }
        }, _callee, null, [
            [
                11,
                26
            ]
        ]);
    }));
    return _sendTransactionsWithManualRetry.apply(this, arguments);
}
export var sendTransactions = function() {
    var _ref = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee(connection, wallet, instructionSet, signersSet) {
        var sequenceType, commitment, successCallback, failCallback, block, beforeTransactions, afterTransactions, _unsignedTxns, unsignedTxns, i, _transaction, instructions, signers, transaction, _transaction1, partiallySignedTransactions, fullySignedTransactions, signedTxns, pendingTxns, i1, signedTxnPromise, result, _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    sequenceType = _args.length > 4 && _args[4] !== void 0 ? _args[4] : SequenceType.Parallel, commitment = _args.length > 5 && _args[5] !== void 0 ? _args[5] : "singleGossip", successCallback = _args.length > 6 && _args[6] !== void 0 ? _args[6] : function(txid, ind) {}, failCallback = _args.length > 7 && _args[7] !== void 0 ? _args[7] : function(txid, ind) {
                        return false;
                    }, block = _args.length > 8 ? _args[8] : void 0, beforeTransactions = _args.length > 9 && _args[9] !== void 0 ? _args[9] : [], afterTransactions = _args.length > 10 && _args[10] !== void 0 ? _args[10] : [];
                    ;
                    if (wallet.publicKey) {
                        _ctx.next = 4;
                        break;
                    }
                    throw new WalletNotConnectedError();
                case 4:
                    unsignedTxns = beforeTransactions;
                    if (block) {
                        _ctx.next = 9;
                        break;
                    }
                    _ctx.next = 8;
                    return connection.getRecentBlockhash(commitment);
                case 8:
                    block = _ctx.sent;
                case 9:
                    i = 0;
                case 10:
                    if (!(i < instructionSet.length)) {
                        _ctx.next = 25;
                        break;
                    }
                    ;
                    instructions = instructionSet[i];
                    signers = signersSet[i];
                    if (!(instructions.length === 0)) {
                        _ctx.next = 16;
                        break;
                    }
                    return _ctx.abrupt("continue", 22);
                case 16:
                    transaction = new Transaction();
                    instructions.forEach(function(instruction) {
                        return transaction.add(instruction);
                    });
                    transaction.recentBlockhash = block.blockhash;
                    (_transaction = transaction).setSigners.apply(_transaction, [
                        // fee payed by the wallet owner
                        wallet.publicKey, 
                    ].concat(swcHelpers.toConsumableArray(signers.map(function(s) {
                        return s.publicKey;
                    }))));
                    if (signers.length > 0) {
                        ;
                        (_transaction1 = transaction).partialSign.apply(_transaction1, swcHelpers.toConsumableArray(signers));
                    }
                    unsignedTxns.push(transaction);
                case 22:
                    i++;
                    _ctx.next = 10;
                    break;
                case 25:
                    (_unsignedTxns = unsignedTxns).push.apply(_unsignedTxns, swcHelpers.toConsumableArray(afterTransactions));
                    partiallySignedTransactions = unsignedTxns.filter(function(t) {
                        return t.signatures.find(function(sig) {
                            return sig.publicKey.equals(wallet.publicKey);
                        });
                    });
                    fullySignedTransactions = unsignedTxns.filter(function(t) {
                        return !t.signatures.find(function(sig) {
                            return sig.publicKey.equals(wallet.publicKey);
                        });
                    });
                    _ctx.next = 30;
                    return wallet.signAllTransactions(partiallySignedTransactions);
                case 30:
                    signedTxns = _ctx.sent;
                    signedTxns = fullySignedTransactions.concat(signedTxns);
                    pendingTxns = [];
                    console.log("Signed txns length", signedTxns.length, "vs handed in length", instructionSet.length);
                    i1 = 0;
                case 35:
                    if (!(i1 < signedTxns.length)) {
                        _ctx.next = 61;
                        break;
                    }
                    signedTxnPromise = sendSignedTransaction({
                        connection: connection,
                        signedTransaction: signedTxns[i1]
                    });
                    if (!(sequenceType !== SequenceType.Parallel)) {
                        _ctx.next = 57;
                        break;
                    }
                    _ctx.prev = 38;
                    _ctx.next = 41;
                    return signedTxnPromise.then(function(param) {
                        var txid = param.txid, slot = param.slot;
                        return successCallback(txid, i1);
                    });
                case 41:
                    pendingTxns.push(signedTxnPromise);
                    _ctx.next = 55;
                    break;
                case 44:
                    _ctx.prev = 44;
                    _ctx.t0 = _ctx["catch"](38);
                    console.log("Failed at txn index:", i1);
                    console.log("Caught failure:", _ctx.t0);
                    failCallback(signedTxns[i1], i1);
                    if (!(sequenceType === SequenceType.StopOnFailure)) {
                        _ctx.next = 55;
                        break;
                    }
                    _ctx.t1 = i1;
                    _ctx.next = 53;
                    return Promise.all(pendingTxns);
                case 53:
                    _ctx.t2 = _ctx.sent;
                    return _ctx.abrupt("return", {
                        number: _ctx.t1,
                        txs: _ctx.t2
                    });
                case 55:
                    _ctx.next = 58;
                    break;
                case 57:
                    {
                        pendingTxns.push(signedTxnPromise);
                    }
                case 58:
                    i1++;
                    _ctx.next = 35;
                    break;
                case 61:
                    if (!(sequenceType !== SequenceType.Parallel)) {
                        _ctx.next = 66;
                        break;
                    }
                    _ctx.next = 64;
                    return Promise.all(pendingTxns);
                case 64:
                    result = _ctx.sent;
                    return _ctx.abrupt("return", {
                        number: signedTxns.length,
                        txs: result
                    });
                case 66:
                    _ctx.t3 = signedTxns.length;
                    _ctx.next = 69;
                    return Promise.all(pendingTxns);
                case 69:
                    _ctx.t4 = _ctx.sent;
                    return _ctx.abrupt("return", {
                        number: _ctx.t3,
                        txs: _ctx.t4
                    });
                case 71:
                case "end":
                    return _ctx.stop();
            }
        }, _callee, null, [
            [
                38,
                44
            ]
        ]);
    }));
    return function sendTransactions(connection, wallet, instructionSet, signersSet) {
        return _ref.apply(this, arguments);
    };
}();
export var sendTransaction = function() {
    var _ref = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee(connection, wallet, instructions, signers) {
        var awaitConfirmation, commitment, includesFeePayer, block, transaction, _transaction, _transaction2, _transaction3, rawTransaction, options, txid, slot, confirmation, errors, _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    awaitConfirmation = _args.length > 4 && _args[4] !== void 0 ? _args[4] : true, commitment = _args.length > 5 && _args[5] !== void 0 ? _args[5] : "singleGossip", includesFeePayer = _args.length > 6 && _args[6] !== void 0 ? _args[6] : false, block = _args.length > 7 ? _args[7] : void 0;
                    if (wallet.publicKey) {
                        _ctx.next = 3;
                        break;
                    }
                    throw new WalletNotConnectedError();
                case 3:
                    ;
                    if (!swcHelpers._instanceof(instructions, Transaction)) {
                        _ctx.next = 8;
                        break;
                    }
                    {
                        transaction = instructions;
                    }
                    _ctx.next = 22;
                    break;
                case 8:
                    transaction = new Transaction();
                    instructions.forEach(function(instruction) {
                        return transaction.add(instruction);
                    });
                    _ctx.t0 = block;
                    if (_ctx.t0) {
                        _ctx.next = 15;
                        break;
                    }
                    _ctx.next = 14;
                    return connection.getRecentBlockhash(commitment);
                case 14:
                    _ctx.t0 = _ctx.sent;
                case 15:
                    transaction.recentBlockhash = _ctx.t0.blockhash;
                    if (includesFeePayer) {
                        ;
                        (_transaction = transaction).setSigners.apply(_transaction, swcHelpers.toConsumableArray(signers.map(function(s) {
                            return s.publicKey;
                        })));
                    } else {
                        ;
                        (_transaction2 = transaction).setSigners.apply(_transaction2, [
                            // fee payed by the wallet owner
                            wallet.publicKey, 
                        ].concat(swcHelpers.toConsumableArray(signers.map(function(s) {
                            return s.publicKey;
                        }))));
                    }
                    if (signers.length > 0) {
                        ;
                        (_transaction3 = transaction).partialSign.apply(_transaction3, swcHelpers.toConsumableArray(signers));
                    }
                    if (includesFeePayer) {
                        _ctx.next = 22;
                        break;
                    }
                    _ctx.next = 21;
                    return wallet.signTransaction(transaction);
                case 21:
                    transaction = _ctx.sent;
                case 22:
                    rawTransaction = transaction.serialize();
                    options = {
                        skipPreflight: true,
                        commitment: commitment
                    };
                    _ctx.next = 26;
                    return connection.sendRawTransaction(rawTransaction, options);
                case 26:
                    txid = _ctx.sent;
                    slot = 0;
                    if (!awaitConfirmation) {
                        _ctx.next = 41;
                        break;
                    }
                    _ctx.next = 31;
                    return awaitTransactionSignatureConfirmation(txid, DEFAULT_TIMEOUT, connection, commitment);
                case 31:
                    confirmation = _ctx.sent;
                    if (confirmation) {
                        _ctx.next = 34;
                        break;
                    }
                    throw new Error("Timed out awaiting confirmation on transaction");
                case 34:
                    slot = (confirmation === null || confirmation === void 0 ? void 0 : confirmation.slot) || 0;
                    if (!(confirmation === null || confirmation === void 0 ? void 0 : confirmation.err)) {
                        _ctx.next = 41;
                        break;
                    }
                    _ctx.next = 38;
                    return getErrorForTransaction(connection, txid);
                case 38:
                    errors = _ctx.sent;
                    console.log(errors);
                    throw new Error("Raw transaction ".concat(txid, " failed"));
                case 41:
                    return _ctx.abrupt("return", {
                        txid: txid,
                        slot: slot
                    });
                case 42:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function sendTransaction(connection, wallet, instructions, signers) {
        return _ref.apply(this, arguments);
    };
}();
export var sendTransactionWithRetry = function() {
    var _ref = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee(connection, wallet, instructions, signers) {
        var commitment, includesFeePayer, block, beforeSend, transaction, _transaction, _transaction4, _transaction5, ref, txid, slot, _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    commitment = _args.length > 4 && _args[4] !== void 0 ? _args[4] : "singleGossip", includesFeePayer = _args.length > 5 && _args[5] !== void 0 ? _args[5] : false, block = _args.length > 6 ? _args[6] : void 0, beforeSend = _args.length > 7 ? _args[7] : void 0;
                    if (wallet.publicKey) {
                        _ctx.next = 3;
                        break;
                    }
                    throw new WalletNotConnectedError();
                case 3:
                    transaction = new Transaction();
                    instructions.forEach(function(instruction) {
                        return transaction.add(instruction);
                    });
                    _ctx.t0 = block;
                    if (_ctx.t0) {
                        _ctx.next = 10;
                        break;
                    }
                    _ctx.next = 9;
                    return connection.getRecentBlockhash(commitment);
                case 9:
                    _ctx.t0 = _ctx.sent;
                case 10:
                    transaction.recentBlockhash = _ctx.t0.blockhash;
                    if (includesFeePayer) {
                        ;
                        (_transaction = transaction).setSigners.apply(_transaction, swcHelpers.toConsumableArray(signers.map(function(s) {
                            return s.publicKey;
                        })));
                    } else {
                        ;
                        (_transaction4 = transaction).setSigners.apply(_transaction4, [
                            // fee payed by the wallet owner
                            wallet.publicKey, 
                        ].concat(swcHelpers.toConsumableArray(signers.map(function(s) {
                            return s.publicKey;
                        }))));
                    }
                    if (signers.length > 0) {
                        ;
                        (_transaction5 = transaction).partialSign.apply(_transaction5, swcHelpers.toConsumableArray(signers));
                    }
                    if (includesFeePayer) {
                        _ctx.next = 17;
                        break;
                    }
                    _ctx.next = 16;
                    return wallet.signTransaction(transaction);
                case 16:
                    transaction = _ctx.sent;
                case 17:
                    if (beforeSend) {
                        beforeSend();
                    }
                    _ctx.next = 20;
                    return sendSignedTransaction({
                        connection: connection,
                        signedTransaction: transaction
                    });
                case 20:
                    ref = _ctx.sent;
                    txid = ref.txid;
                    slot = ref.slot;
                    return _ctx.abrupt("return", {
                        txid: txid,
                        slot: slot
                    });
                case 24:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function sendTransactionWithRetry(connection, wallet, instructions, signers) {
        return _ref.apply(this, arguments);
    };
}();
export var getUnixTs = function() {
    return new Date().getTime() / 1000;
};
var DEFAULT_TIMEOUT = 15000;
export function sendSignedTransaction(_) {
    return _sendSignedTransaction.apply(this, arguments);
}
function _sendSignedTransaction() {
    _sendSignedTransaction = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee1(param) {
        var signedTransaction, connection, _timeout, timeout, rawTransaction, startTime, slot, txid, done, confirmation, simulateResult, i, line;
        return regeneratorRuntime.wrap(function _callee$(_ctx1) {
            while(1)switch(_ctx1.prev = _ctx1.next){
                case 0:
                    signedTransaction = param.signedTransaction, connection = param.connection, _timeout = param.timeout, timeout = _timeout === void 0 ? DEFAULT_TIMEOUT : _timeout;
                    rawTransaction = signedTransaction.serialize();
                    startTime = getUnixTs();
                    slot = 0;
                    _ctx1.next = 6;
                    return connection.sendRawTransaction(rawTransaction, {
                        skipPreflight: true
                    });
                case 6:
                    txid = _ctx1.sent;
                    console.log("Started awaiting confirmation for", txid);
                    done = false;
                    swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                        return regeneratorRuntime.wrap(function _callee$(_ctx) {
                            while(1)switch(_ctx.prev = _ctx.next){
                                case 0:
                                    if (!(!done && getUnixTs() - startTime < timeout)) {
                                        _ctx.next = 6;
                                        break;
                                    }
                                    connection.sendRawTransaction(rawTransaction, {
                                        skipPreflight: true
                                    });
                                    _ctx.next = 4;
                                    return sleep(500);
                                case 4:
                                    _ctx.next = 0;
                                    break;
                                case 6:
                                case "end":
                                    return _ctx.stop();
                            }
                        }, _callee);
                    }))();
                    _ctx1.prev = 10;
                    _ctx1.next = 13;
                    return awaitTransactionSignatureConfirmation(txid, timeout, connection, "recent", true);
                case 13:
                    confirmation = _ctx1.sent;
                    if (confirmation) {
                        _ctx1.next = 16;
                        break;
                    }
                    throw new Error("Timed out awaiting confirmation on transaction");
                case 16:
                    if (!confirmation.err) {
                        _ctx1.next = 19;
                        break;
                    }
                    console.error(confirmation.err);
                    throw new Error("Transaction failed: Custom instruction error");
                case 19:
                    slot = (confirmation === null || confirmation === void 0 ? void 0 : confirmation.slot) || 0;
                    _ctx1.next = 47;
                    break;
                case 22:
                    _ctx1.prev = 22;
                    _ctx1.t0 = _ctx1["catch"](10);
                    console.error("Timeout Error caught", _ctx1.t0);
                    if (!_ctx1.t0.timeout) {
                        _ctx1.next = 27;
                        break;
                    }
                    throw new Error("Timed out awaiting confirmation on transaction");
                case 27:
                    simulateResult = null;
                    _ctx1.prev = 28;
                    _ctx1.next = 31;
                    return simulateTransaction(connection, signedTransaction, "single");
                case 31:
                    simulateResult = _ctx1.sent.value;
                    _ctx1.next = 36;
                    break;
                case 34:
                    _ctx1.prev = 34;
                    _ctx1.t1 = _ctx1["catch"](28);
                case 36:
                    if (!(simulateResult && simulateResult.err)) {
                        _ctx1.next = 47;
                        break;
                    }
                    if (!simulateResult.logs) {
                        _ctx1.next = 46;
                        break;
                    }
                    i = simulateResult.logs.length - 1;
                case 39:
                    if (!(i >= 0)) {
                        _ctx1.next = 46;
                        break;
                    }
                    line = simulateResult.logs[i];
                    if (!line.startsWith("Program log: ")) {
                        _ctx1.next = 43;
                        break;
                    }
                    throw new Error("Transaction failed: " + line.slice("Program log: ".length));
                case 43:
                    --i;
                    _ctx1.next = 39;
                    break;
                case 46:
                    throw new Error(JSON.stringify(simulateResult.err));
                case 47:
                    _ctx1.prev = 47;
                    done = true;
                    return _ctx1.finish(47);
                case 50:
                    console.log("Latency", txid, getUnixTs() - startTime);
                    return _ctx1.abrupt("return", {
                        txid: txid,
                        slot: slot
                    });
                case 52:
                case "end":
                    return _ctx1.stop();
            }
        }, _callee1, null, [
            [
                10,
                22,
                47,
                50
            ],
            [
                28,
                34
            ]
        ]);
    }));
    return _sendSignedTransaction.apply(this, arguments);
}
function simulateTransaction(connection, transaction, commitment) {
    return _simulateTransaction.apply(this, arguments);
}
function _simulateTransaction() {
    _simulateTransaction = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee(connection, transaction, commitment) {
        var signData, wireTransaction, encodedTransaction, config, args, res;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return connection._recentBlockhash(// @ts-ignore
                    connection._disableBlockhashCaching);
                case 2:
                    // @ts-ignore
                    transaction.recentBlockhash = _ctx.sent;
                    signData = transaction.serializeMessage();
                    wireTransaction = transaction._serialize(signData);
                    encodedTransaction = wireTransaction.toString("base64");
                    config = {
                        encoding: "base64",
                        commitment: commitment
                    };
                    args = [
                        encodedTransaction,
                        config
                    ];
                    _ctx.next = 10;
                    return connection._rpcRequest("simulateTransaction", args);
                case 10:
                    res = _ctx.sent;
                    if (!res.error) {
                        _ctx.next = 13;
                        break;
                    }
                    throw new Error("failed to simulate transaction: " + res.error.message);
                case 13:
                    return _ctx.abrupt("return", res.result);
                case 14:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _simulateTransaction.apply(this, arguments);
}
function awaitTransactionSignatureConfirmation(txid, timeout, connection) {
    return _awaitTransactionSignatureConfirmation.apply(this, arguments);
}
function _awaitTransactionSignatureConfirmation() {
    _awaitTransactionSignatureConfirmation = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee2(txid, timeout, connection) {
        var commitment, queryStatus, done, status, subId, _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_ctx2) {
            while(1)switch(_ctx2.prev = _ctx2.next){
                case 0:
                    commitment = _args.length > 3 && _args[3] !== void 0 ? _args[3] : "recent", queryStatus = _args.length > 4 && _args[4] !== void 0 ? _args[4] : false;
                    done = false;
                    status = {
                        slot: 0,
                        confirmations: 0,
                        err: null
                    };
                    subId = 0;
                    _ctx2.next = 6;
                    return new Promise(function() {
                        var _ref = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee3(resolve, reject) {
                            return regeneratorRuntime.wrap(function _callee$(_ctx3) {
                                while(1)switch(_ctx3.prev = _ctx3.next){
                                    case 0:
                                        setTimeout(function() {
                                            if (done) {
                                                return;
                                            }
                                            done = true;
                                            console.log("Rejecting for timeout...");
                                            reject({
                                                timeout: true
                                            });
                                        }, timeout);
                                        try {
                                            subId = connection.onSignature(txid, function(result, context) {
                                                done = true;
                                                status = {
                                                    err: result.err,
                                                    slot: context.slot,
                                                    confirmations: 0
                                                };
                                                if (result.err) {
                                                    console.log("Rejected via websocket", result.err);
                                                    reject(status);
                                                } else {
                                                    console.log("Resolved via websocket", result);
                                                    resolve(status);
                                                }
                                            }, commitment);
                                        } catch (e) {
                                            done = true;
                                            console.error("WS error in setup", txid, e);
                                        }
                                    case 2:
                                        if (!(!done && queryStatus)) {
                                            _ctx3.next = 8;
                                            break;
                                        }
                                        // eslint-disable-next-line no-loop-func
                                        swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                            var signatureStatuses;
                                            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                                                while(1)switch(_ctx.prev = _ctx.next){
                                                    case 0:
                                                        _ctx.prev = 0;
                                                        _ctx.next = 3;
                                                        return connection.getSignatureStatuses([
                                                            txid
                                                        ]);
                                                    case 3:
                                                        signatureStatuses = _ctx.sent;
                                                        status = signatureStatuses && signatureStatuses.value[0];
                                                        if (!done) {
                                                            if (!status) {
                                                                console.log("REST null result for", txid, status);
                                                            } else if (status.err) {
                                                                console.log("REST error for", txid, status);
                                                                done = true;
                                                                reject(status.err);
                                                            } else if (!status.confirmations) {
                                                                console.log("REST no confirmations for", txid, status);
                                                            } else {
                                                                console.log("REST confirmation for", txid, status);
                                                                done = true;
                                                                resolve(status);
                                                            }
                                                        }
                                                        _ctx.next = 11;
                                                        break;
                                                    case 8:
                                                        _ctx.prev = 8;
                                                        _ctx.t0 = _ctx["catch"](0);
                                                        if (!done) {
                                                            console.log("REST connection error: txid", txid, _ctx.t0);
                                                        }
                                                    case 11:
                                                    case "end":
                                                        return _ctx.stop();
                                                }
                                            }, _callee, null, [
                                                [
                                                    0,
                                                    8
                                                ]
                                            ]);
                                        }))();
                                        _ctx3.next = 6;
                                        return sleep(2000);
                                    case 6:
                                        _ctx3.next = 2;
                                        break;
                                    case 8:
                                    case "end":
                                        return _ctx3.stop();
                                }
                            }, _callee3);
                        }));
                        return function(resolve, reject) {
                            return _ref.apply(this, arguments);
                        };
                    }());
                case 6:
                    status = _ctx2.sent;
                    //@ts-ignore
                    if (connection._signatureSubscriptions[subId]) connection.removeSignatureListener(subId);
                    done = true;
                    console.log("Returning status", status);
                    return _ctx2.abrupt("return", status);
                case 11:
                case "end":
                    return _ctx2.stop();
            }
        }, _callee2);
    }));
    return _awaitTransactionSignatureConfirmation.apply(this, arguments);
}
export function sleep(ms) {
    return new Promise(function(resolve) {
        return setTimeout(resolve, ms);
    });
}
