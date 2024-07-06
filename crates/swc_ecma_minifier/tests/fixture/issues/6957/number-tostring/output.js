// Copyright 2008 the V8 project authors. All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
//       copyright notice, this list of conditions and the following
//       disclaimer in the documentation and/or other materials provided
//       with the distribution.
//     * Neither the name of Google Inc. nor the names of its
//       contributors may be used to endorse or promote products derived
//       from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
// ----------------------------------------------------------------------
// toString
assertEquals("NaN", NaN.toString());
assertEquals("Infinity", (1 / 0).toString());
assertEquals("-Infinity", (-1 / 0).toString());
assertEquals("0", "0");
assertEquals("9", "9");
assertEquals("90", "90");
assertEquals("90.12", "90.12");
assertEquals("0.1", "0.1");
assertEquals("0.01", "0.01");
assertEquals("0.0123", "0.0123");
assertEquals("111111111111111110000", "111111111111111110000");
assertEquals("1.1111111111111111e+21", "1.1111111111111111e+21");
assertEquals("1.1111111111111111e+22", "1.1111111111111111e+22");
assertEquals("0.00001", "0.00001");
assertEquals("0.000001", "0.000001");
assertEquals("1e-7", "1e-7");
assertEquals("1.2e-7", "1.2e-7");
assertEquals("1.23e-7", "1.23e-7");
assertEquals("1e-8", "1e-8");
assertEquals("1.2e-8", "1.2e-8");
assertEquals("1.23e-8", "1.23e-8");
assertEquals("0", "0");
assertEquals("-9", "-9");
assertEquals("-90", "-90");
assertEquals("-90.12", "-90.12");
assertEquals("-0.1", "-0.1");
assertEquals("-0.01", "-0.01");
assertEquals("-0.0123", "-0.0123");
assertEquals("-111111111111111110000", "-111111111111111110000");
assertEquals("-1.1111111111111111e+21", "-1.1111111111111111e+21");
assertEquals("-1.1111111111111111e+22", "-1.1111111111111111e+22");
assertEquals("-0.00001", "-0.00001");
assertEquals("-0.000001", "-0.000001");
assertEquals("-1e-7", "-1e-7");
assertEquals("-1.2e-7", "-1.2e-7");
assertEquals("-1.23e-7", "-1.23e-7");
assertEquals("-1e-8", "-1e-8");
assertEquals("-1.2e-8", "-1.2e-8");
assertEquals("-1.23e-8", "-1.23e-8");
assertEquals("NaN", NaN.toString(16));
assertEquals("Infinity", (1 / 0).toString(16));
assertEquals("-Infinity", (-1 / 0).toString(16));
assertEquals("0", "0");
assertEquals("9", "9");
assertEquals("5a", "5a");
assertEquals("5a.1eb851eb852", 90.12.toString(16));
assertEquals("0.1999999999999a", 0.1.toString(16));
assertEquals("0.028f5c28f5c28f6", 0.01.toString(16));
assertEquals("0.032617c1bda511a", 0.0123.toString(16));
assertEquals("605f9f6dd18bc8000", "605f9f6dd18bc8000");
assertEquals("3c3bc3a4a2f75c0000", "3c3bc3a4a2f75c0000");
assertEquals("25a55a46e5da9a00000", "25a55a46e5da9a00000");
assertEquals("0.0000a7c5ac471b4788", 0.00001.toString(16));
assertEquals("0.000010c6f7a0b5ed8d", 0.000001.toString(16));
assertEquals("0.000001ad7f29abcaf48", 0.0000001.toString(16));
assertEquals("0.000002036565348d256", 0.00000012.toString(16));
assertEquals("0.0000021047ee22aa466", 0.000000123.toString(16));
assertEquals("0.0000002af31dc4611874", 0.00000001.toString(16));
assertEquals("0.000000338a23b87483be", 0.000000012.toString(16));
assertEquals("0.00000034d3fe36aaa0a2", 0.0000000123.toString(16));
assertEquals("0", "0");
assertEquals("-9", "-9");
assertEquals("-5a", "-5a");
assertEquals("-5a.1eb851eb852", (-90.12).toString(16));
assertEquals("-0.1999999999999a", (-0.1).toString(16));
assertEquals("-0.028f5c28f5c28f6", (-0.01).toString(16));
assertEquals("-0.032617c1bda511a", (-0.0123).toString(16));
assertEquals("-605f9f6dd18bc8000", "-605f9f6dd18bc8000");
assertEquals("-3c3bc3a4a2f75c0000", "-3c3bc3a4a2f75c0000");
assertEquals("-25a55a46e5da9a00000", "-25a55a46e5da9a00000");
assertEquals("-0.0000a7c5ac471b4788", (-0.00001).toString(16));
assertEquals("-0.000010c6f7a0b5ed8d", (-0.000001).toString(16));
assertEquals("-0.000001ad7f29abcaf48", (-0.0000001).toString(16));
assertEquals("-0.000002036565348d256", (-0.00000012).toString(16));
assertEquals("-0.0000021047ee22aa466", (-0.000000123).toString(16));
assertEquals("-0.0000002af31dc4611874", (-0.00000001).toString(16));
assertEquals("-0.000000338a23b87483be", (-0.000000012).toString(16));
assertEquals("-0.00000034d3fe36aaa0a2", (-0.0000000123).toString(16));
assertEquals("4294967296", "4294967296");
assertEquals("ffffffff", "ffffffff");
assertEquals("11111111111111111111111111111111", "11111111111111111111111111111111");
assertEquals("5yc1z", "5yc1z");
assertEquals("0", "0");
assertEquals("0", "0");
assertEquals("0", "0");
assertEquals("0", "0");
assertEquals("0", "0");
assertEquals("100000000000000000000000000000000", "100000000000000000000000000000000");
assertEquals("100000000000000000000000000000001", "100000000000000000000000000000001");
assertEquals("100000000000080", "100000000000080");
assertEquals("1000000000000100", "1000000000000100");
assertEquals("1000000000000000", "1000000000000000");
assertEquals("1000000000000000", "1000000000000000");
assertEquals("100000000000000000000000000000000000000000000000010000000", "100000000000000000000000000000000000000000000000010000000");
assertEquals("-11111111111111111111111111111111", "-11111111111111111111111111111111");
assertEquals("-5yc1z", "-5yc1z");
assertEquals("-100000000000000000000000000000000", "-100000000000000000000000000000000");
assertEquals("-100000000000000000000000000000001", "-100000000000000000000000000000001");
assertEquals("-100000000000080", "-100000000000080");
assertEquals("-100000000000000000000000000000000000000000000000010000000", "-100000000000000000000000000000000000000000000000010000000");
assertEquals("1000", "1000");
assertEquals("0.00001", "0.00001");
assertEquals("1000000000000000100", "1000000000000000100");
assertEquals("1e+21", "1e+21");
assertEquals("-1e+21", "-1e+21");
assertEquals("1e-7", "1e-7");
assertEquals("-1e-7", "-1e-7");
assertEquals("1.0000000000000001e+21", "1.0000000000000001e+21");
assertEquals("0.000001", "0.000001");
assertEquals("1e-7", "1e-7");
assertEquals("8.8", 8.5.toString(16));
assertEquals("-8.8", (-8.5).toString(16));
assertEquals("1.1", (4 / 3).toString(3));
assertEquals("11.1", (13 / 3).toString(3));
assertEquals("0.01", (1 / 9).toString(3));
assertEquals("10000", "10000");
assertEquals("10000.01", (81 + 1 / 9).toString(3));
assertEquals("0.0212010212010212010212010212010212", (2 / 7).toString(3));
// ----------------------------------------------------------------------
// toFixed
assertEquals("NaN", NaN.toFixed(2));
assertEquals("Infinity", (1 / 0).toFixed(2));
assertEquals("-Infinity", (-1 / 0).toFixed(2));
assertEquals("1.1111111111111111e+21", "1.1111111111111111e+21");
assertEquals("0.1", "0.1");
assertEquals("0.10", "0.10");
assertEquals("0.100", "0.100");
assertEquals("0.01", "0.01");
assertEquals("0.010", "0.010");
assertEquals("0.0100", "0.0100");
assertEquals("0.00", "0.00");
assertEquals("0.001", "0.001");
assertEquals("0.0010", "0.0010");
assertEquals("1.0000", "1.0000");
assertEquals("1.0", "1.0");
assertEquals("1", "1");
assertEquals("12", "12");
assertEquals("1", "1");
assertEquals("12", "12");
assertEquals("1", "1");
assertEquals("12", "12");
assertEquals("0.0000006", "0.0000006");
assertEquals("0.00000006", "0.00000006");
assertEquals("0.000000060", "0.000000060");
assertEquals("0.0000000600", "0.0000000600");
assertEquals("0", "0");
assertEquals("0.0", "0.0");
assertEquals("0.00", "0.00");
assertEquals("-1.1111111111111111e+21", "-1.1111111111111111e+21");
assertEquals("-0.1", "-0.1");
assertEquals("-0.10", "-0.10");
assertEquals("-0.100", "-0.100");
assertEquals("-0.01", "-0.01");
assertEquals("-0.010", "-0.010");
assertEquals("-0.0100", "-0.0100");
assertEquals("-0.00", "-0.00");
assertEquals("-0.001", "-0.001");
assertEquals("-0.0010", "-0.0010");
assertEquals("-1.0000", "-1.0000");
assertEquals("-1.0", "-1.0");
assertEquals("-1", "-1");
assertEquals("-1", "-1");
assertEquals("-12", "-12");
assertEquals("-1", "-1");
assertEquals("-12", "-12");
assertEquals("-0.0000006", "-0.0000006");
assertEquals("-0.00000006", "-0.00000006");
assertEquals("-0.000000060", "-0.000000060");
assertEquals("-0.0000000600", "-0.0000000600");
assertEquals("0", "0");
assertEquals("0.0", "0.0");
assertEquals("0.00", "0.00");
assertEquals("1000", "1000");
assertEquals("0", "0");
assertEquals("0.00001", "0.00001");
assertEquals("0.00000000000000000010", "0.00000000000000000010");
assertEquals("0.00001000000000000", "0.00001000000000000");
assertEquals("1.00000000000000000", "1.00000000000000000");
assertEquals("1000000000000000128", "1000000000000000128");
assertEquals("100000000000000128.0", "100000000000000128.0");
assertEquals("10000000000000128.00", "10000000000000128.00");
assertEquals("10000000000000128.00000000000000000000", "10000000000000128.00000000000000000000");
assertEquals("0", "0");
assertEquals("-42.000", "-42.000");
assertEquals("-1000000000000000128", "-1000000000000000128");
assertEquals("-0.00000000000000000010", "-0.00000000000000000010");
assertEquals("0.12312312312312299889", "0.12312312312312299889");
// Test that we round up even when the last digit generated is even.
// dtoa does not do this in its original form.
assertEquals("1", "1", "0.5.toFixed(0)");
assertEquals("-1", "-1", "(-0.5).toFixed(0)");
assertEquals("1.3", "1.3", "1.25.toFixed(1)");
// This is bizare, but Spidermonkey and KJS behave the same.
assertEquals("234.2040", "234.2040", "234.2040.toFixed(4)");
assertEquals("234.2041", "234.2041");
// ----------------------------------------------------------------------
// toExponential
assertEquals("1e+0", "1e+0");
assertEquals("1.1e+1", "1.1e+1");
assertEquals("1.12e+2", "1.12e+2");
assertEquals("1e+0", "1e+0");
assertEquals("1e+1", "1e+1");
assertEquals("1e+2", "1e+2");
assertEquals("1.0e+0", "1.0e+0");
assertEquals("1.1e+1", "1.1e+1");
assertEquals("1.1e+2", "1.1e+2");
assertEquals("1.00e+0", "1.00e+0");
assertEquals("1.10e+1", "1.10e+1");
assertEquals("1.12e+2", "1.12e+2");
assertEquals("1.000e+0", "1.000e+0");
assertEquals("1.100e+1", "1.100e+1");
assertEquals("1.120e+2", "1.120e+2");
assertEquals("1e-1", "1e-1");
assertEquals("1.1e-1", "1.1e-1");
assertEquals("1.12e-1", "1.12e-1");
assertEquals("1e-1", "1e-1");
assertEquals("1e-1", "1e-1");
assertEquals("1e-1", "1e-1");
assertEquals("1.0e-1", "1.0e-1");
assertEquals("1.1e-1", "1.1e-1");
assertEquals("1.1e-1", "1.1e-1");
assertEquals("1.00e-1", "1.00e-1");
assertEquals("1.10e-1", "1.10e-1");
assertEquals("1.12e-1", "1.12e-1");
assertEquals("1.000e-1", "1.000e-1");
assertEquals("1.100e-1", "1.100e-1");
assertEquals("1.120e-1", "1.120e-1");
assertEquals("-1e+0", "-1e+0");
assertEquals("-1.1e+1", "-1.1e+1");
assertEquals("-1.12e+2", "-1.12e+2");
assertEquals("-1e+0", "-1e+0");
assertEquals("-1e+1", "-1e+1");
assertEquals("-1e+2", "-1e+2");
assertEquals("-1.0e+0", "-1.0e+0");
assertEquals("-1.1e+1", "-1.1e+1");
assertEquals("-1.1e+2", "-1.1e+2");
assertEquals("-1.00e+0", "-1.00e+0");
assertEquals("-1.10e+1", "-1.10e+1");
assertEquals("-1.12e+2", "-1.12e+2");
assertEquals("-1.000e+0", "-1.000e+0");
assertEquals("-1.100e+1", "-1.100e+1");
assertEquals("-1.120e+2", "-1.120e+2");
assertEquals("-1e-1", "-1e-1");
assertEquals("-1.1e-1", "-1.1e-1");
assertEquals("-1.12e-1", "-1.12e-1");
assertEquals("-1e-1", "-1e-1");
assertEquals("-1e-1", "-1e-1");
assertEquals("-1e-1", "-1e-1");
assertEquals("-1.0e-1", "-1.0e-1");
assertEquals("-1.1e-1", "-1.1e-1");
assertEquals("-1.1e-1", "-1.1e-1");
assertEquals("-1.00e-1", "-1.00e-1");
assertEquals("-1.10e-1", "-1.10e-1");
assertEquals("-1.12e-1", "-1.12e-1");
assertEquals("-1.000e-1", "-1.000e-1");
assertEquals("-1.100e-1", "-1.100e-1");
assertEquals("-1.120e-1", "-1.120e-1");
assertEquals("NaN", NaN.toExponential(2));
assertEquals("Infinity", (1 / 0).toExponential(2));
assertEquals("-Infinity", (-1 / 0).toExponential(2));
assertEquals("1e+0", "1e+0");
assertEquals("0e+0", "0e+0");
assertEquals("0.00e+0", "0.00e+0");
assertEquals("1e+1", "1e+1");
assertEquals("1.1236e+1", "1.1236e+1");
assertEquals("1.1236e-4", "1.1236e-4");
assertEquals("-1.1236e-4", "-1.1236e-4");
assertEquals("1.12356e-4", "1.12356e-4");
assertEquals("-1.12356e-4", "-1.12356e-4");
// ----------------------------------------------------------------------
// toPrecision
assertEquals("NaN", NaN.toPrecision(1));
assertEquals("Infinity", (1 / 0).toPrecision(2));
assertEquals("-Infinity", (-1 / 0).toPrecision(2));
assertEquals("0.000555000000000000", "0.000555000000000000");
assertEquals("5.55000000000000e-7", "5.55000000000000e-7");
assertEquals("-5.55000000000000e-7", "-5.55000000000000e-7");
assertEquals("1e+8", "1e+8");
assertEquals("123456789", "123456789");
assertEquals("1.2345679e+8", "1.2345679e+8");
assertEquals("1.234568e+8", "1.234568e+8");
assertEquals("-1.234568e+8", "-1.234568e+8");
assertEquals("-1.2e-9", Number(-0.0000000012345).toPrecision(2));
assertEquals("-1.2e-8", Number(-0.000000012345).toPrecision(2));
assertEquals("-1.2e-7", Number(-0.00000012345).toPrecision(2));
assertEquals("-0.0000012", Number(-0.0000012345).toPrecision(2));
assertEquals("-0.000012", Number(-0.000012345).toPrecision(2));
assertEquals("-0.00012", Number(-0.00012345).toPrecision(2));
assertEquals("-0.0012", Number(-0.0012345).toPrecision(2));
assertEquals("-0.012", Number(-0.012345).toPrecision(2));
assertEquals("-0.12", Number(-0.12345).toPrecision(2));
assertEquals("-1.2", Number(-1.2345).toPrecision(2));
assertEquals("-12", Number(-12.345).toPrecision(2));
assertEquals("-1.2e+2", Number(-123.45).toPrecision(2));
assertEquals("-1.2e+3", Number(-1234.5).toPrecision(2));
assertEquals("-1.2e+4", Number(-12345).toPrecision(2));
assertEquals("-1.235e+4", Number(-12345.67).toPrecision(4));
assertEquals("-1.234e+4", Number(-12344.67).toPrecision(4));
// Test that we round up even when the last digit generated is even.
// dtoa does not do this in its original form.
assertEquals("1.3", "1.3", "1.25.toPrecision(2)");
assertEquals("1.4", "1.4", "1.35.toPrecision(2)");
