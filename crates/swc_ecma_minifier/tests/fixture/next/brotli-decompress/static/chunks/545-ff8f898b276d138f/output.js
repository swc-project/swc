(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        545
    ],
    {
        /***/ 966: /***/ function(__unused_webpack_module, exports) {
            function HuffmanCode(bits, value) {
                this.bits = bits; /* number of bits used for this symbol */ 
                this.value = value; /* symbol value or table offset */ 
            }
            exports.h = HuffmanCode;
            /* Returns reverse(reverse(key, len) + 1, len), where reverse(key, len) is the
         bit-wise reversal of the len least significant bits of key. */ function GetNextKey(key, len) {
                var step = 1 << len - 1;
                while(key & step){
                    step >>= 1;
                }
                return (key & step - 1) + step;
            }
            /* Stores code in table[0], table[step], table[2*step], ..., table[end] */ /* Assumes that end is an integer multiple of step */ function ReplicateValue(table, i, step, end, code) {
                do {
                    end -= step;
                    table[i + end] = new HuffmanCode(code.bits, code.value);
                }while (end > 0)
            }
            exports.g = function(root_table, table, root_bits, code_lengths, code_lengths_size) {
                var start_table = table;
                var code; /* current table entry */ 
                var len; /* current code length */ 
                var symbol; /* symbol index in original or sorted table */ 
                var key; /* reversed prefix code */ 
                var step; /* step size to replicate values in current table */ 
                var low; /* low bits for current root entry */ 
                var mask; /* mask for low bits */ 
                var table_bits; /* key length of current table */ 
                var table_size; /* size of current table */ 
                var total_size; /* sum of root table size and 2nd level table sizes */ 
                var sorted; /* symbols sorted by code length */ 
                var count = new Int32Array(16); /* number of codes of each length */ 
                var offset = new Int32Array(16); /* offsets in sorted table for each length */ 
                sorted = new Int32Array(code_lengths_size);
                /* build histogram of code lengths */ for(symbol = 0; symbol < code_lengths_size; symbol++)count[code_lengths[symbol]]++;
                /* generate offsets into sorted symbol table by code length */ offset[1] = 0;
                for(len = 1; len < 15; len++)offset[len + 1] = offset[len] + count[len];
                /* sort symbols by length, by symbol order within each length */ for(symbol = 0; symbol < code_lengths_size; symbol++)if (0 !== code_lengths[symbol]) sorted[offset[code_lengths[symbol]]++] = symbol;
                table_bits = root_bits;
                table_size = 1 << table_bits;
                total_size = table_size;
                /* special case code with only one value */ if (1 === offset[15]) {
                    for(key = 0; key < total_size; ++key)root_table[table + key] = new HuffmanCode(0, 0xffff & sorted[0]);
                    return total_size;
                }
                /* fill in root table */ key = 0;
                symbol = 0;
                for(len = 1, step = 2; len <= root_bits; ++len, step <<= 1){
                    for(; count[len] > 0; --count[len]){
                        code = new HuffmanCode(0xff & len, 0xffff & sorted[symbol++]);
                        ReplicateValue(root_table, table + key, step, table_size, code);
                        key = GetNextKey(key, len);
                    }
                }
                /* fill in 2nd level tables and add pointers to root table */ mask = total_size - 1;
                low = -1;
                for(len = root_bits + 1, step = 2; len <= 15; ++len, step <<= 1){
                    for(; count[len] > 0; --count[len]){
                        if ((key & mask) !== low) {
                            table += table_size;
                            table_bits = /* Returns the table width of the next 2nd level table. count is the histogram
         of bit lengths for the remaining symbols, len is the code length of the next
         processed symbol */ function(count, len, root_bits) {
                                var left = 1 << len - root_bits;
                                while(len < 15){
                                    left -= count[len];
                                    if (left <= 0) break;
                                    ++len;
                                    left <<= 1;
                                }
                                return len - root_bits;
                            }(count, len, root_bits);
                            table_size = 1 << table_bits;
                            total_size += table_size;
                            low = key & mask;
                            root_table[start_table + low] = new HuffmanCode(table_bits + root_bits & 0xff, table - start_table - low & 0xffff);
                        }
                        code = new HuffmanCode(len - root_bits & 0xff, 0xffff & sorted[symbol++]);
                        ReplicateValue(root_table, table + (key >> root_bits), step, table_size, code);
                        key = GetNextKey(key, len);
                    }
                }
                return total_size;
            };
        /***/ }
    }
]);
