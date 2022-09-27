(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        545
    ],
    {
        966: function(__unused_webpack_module, exports) {
            function HuffmanCode(bits, value) {
                this.bits = bits;
                this.value = value;
            }
            exports.h = HuffmanCode;
            function GetNextKey(key, len) {
                var step = 1 << len - 1;
                while(key & step){
                    step >>= 1;
                }
                return (key & step - 1) + step;
            }
            function ReplicateValue(table, i, step, end, code) {
                do {
                    end -= step;
                    table[i + end] = new HuffmanCode(code.bits, code.value);
                }while (end > 0)
            }
            function NextTableBitSize(count, len, root_bits) {
                var left = 1 << len - root_bits;
                while(len < 15){
                    left -= count[len];
                    if (left <= 0) break;
                    ++len;
                    left <<= 1;
                }
                return len - root_bits;
            }
            exports.g = function(root_table, table, root_bits, code_lengths, code_lengths_size) {
                var start_table = table;
                var code;
                var len;
                var symbol;
                var key;
                var step;
                var low;
                var mask;
                var table_bits;
                var table_size;
                var total_size;
                var sorted;
                var count = new Int32Array(16);
                var offset = new Int32Array(16);
                sorted = new Int32Array(code_lengths_size);
                for(symbol = 0; symbol < code_lengths_size; symbol++)count[code_lengths[symbol]]++;
                offset[1] = 0;
                for(len = 1; len < 15; len++)offset[len + 1] = offset[len] + count[len];
                for(symbol = 0; symbol < code_lengths_size; symbol++)if (0 !== code_lengths[symbol]) sorted[offset[code_lengths[symbol]]++] = symbol;
                table_bits = root_bits;
                table_size = 1 << table_bits;
                total_size = table_size;
                if (1 === offset[15]) {
                    for(key = 0; key < total_size; ++key)root_table[table + key] = new HuffmanCode(0, 0xffff & sorted[0]);
                    return total_size;
                }
                key = 0;
                symbol = 0;
                for(len = 1, step = 2; len <= root_bits; ++len, step <<= 1){
                    for(; count[len] > 0; --count[len]){
                        code = new HuffmanCode(0xff & len, 0xffff & sorted[symbol++]);
                        ReplicateValue(root_table, table + key, step, table_size, code);
                        key = GetNextKey(key, len);
                    }
                }
                mask = total_size - 1;
                low = -1;
                for(len = root_bits + 1, step = 2; len <= 15; ++len, step <<= 1){
                    for(; count[len] > 0; --count[len]){
                        if ((key & mask) !== low) {
                            table += table_size;
                            table_bits = NextTableBitSize(count, len, root_bits);
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
        }
    }
]);
