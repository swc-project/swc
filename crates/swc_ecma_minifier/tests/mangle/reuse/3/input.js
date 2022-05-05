const encoder = new TextEncoder();
function encode(input) {
    return encoder.encode(input);
}
new TextDecoder();
const noColor = globalThis.Deno?.noColor ?? true;
let enabled = !noColor;
function code1(open, close) {
    return {
        open: `\x1b[${open.join(";")}m`,
        close: `\x1b[${close}m`,
        regexp: new RegExp(`\\x1b\\[${close}m`, "g"),
    };
}
function run(str, code) {
    return enabled
        ? `${code.open}${str.replace(code.regexp, code.open)}${code.close}`
        : str;
}
function bold(str) {
    return run(str, code1([1], 22));
}
function dim(str) {
    return run(str, code1([2], 22));
}
function red(str) {
    return run(str, code1([31], 39));
}
function green(str) {
    return run(str, code1([32], 39));
}
function yellow(str) {
    return run(str, code1([33], 39));
}
function blue(str) {
    return run(str, code1([34], 39));
}
function magenta(str) {
    return run(str, code1([35], 39));
}
new RegExp(
    [
        "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
        "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))",
    ].join("|"),
    "g"
);
const camelCaseRegexp =
    /([a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A])/g;
const camelCaseUpperRegexp =
    /([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A])([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A][a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A])/g;
const nonWordRegexp =
    /[^A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]+/g;
const LANGUAGES = {
    tr: {
        regexp: /\u0130|\u0049|\u0049\u0307/g,
        map: {
            İ: "\u0069",
            I: "\u0131",
        },
    },
    az: {
        regexp: /[\u0130]/g,
        map: {
            İ: "\u0069",
            I: "\u0131",
        },
    },
    lt: {
        regexp: /[\u0049\u004A\u012E\u00CC\u00CD\u0128]/g,
        map: {
            I: "\u0069\u0307",
            J: "\u006A\u0307",
            Į: "\u012F\u0307",
            Ì: "\u0069\u0307\u0300",
            Í: "\u0069\u0307\u0301",
            Ĩ: "\u0069\u0307\u0303",
        },
    },
};
function __default(str, locale) {
    const lang = locale && LANGUAGES[locale];
    str = str == null ? "" : String(str);
    if (lang) {
        str = str.replace(lang.regexp, (m) => lang.map[m]);
    }
    return str.toLowerCase();
}
function normalCase(str, locale, replacement) {
    if (str == null) {
        return "";
    }
    replacement = typeof replacement !== "string" ? " " : replacement;
    function replace(match, index, value) {
        if (index === 0 || index === value.length - match.length) {
            return "";
        }
        return replacement || "";
    }
    str = String(str)
        .replace(camelCaseRegexp, "$1 $2")
        .replace(camelCaseUpperRegexp, "$1 $2")
        .replace(nonWordRegexp, replace);
    return __default(str, locale);
}
const LANGUAGES1 = {
    tr: {
        regexp: /[\u0069]/g,
        map: {
            i: "\u0130",
        },
    },
    az: {
        regexp: /[\u0069]/g,
        map: {
            i: "\u0130",
        },
    },
    lt: {
        regexp: /[\u0069\u006A\u012F]\u0307|\u0069\u0307[\u0300\u0301\u0303]/g,
        map: {
            i̇: "\u0049",
            j̇: "\u004A",
            į̇: "\u012E",
            i̇̀: "\u00CC",
            i̇́: "\u00CD",
            i̇̃: "\u0128",
        },
    },
};
function __default1(str, locale) {
    const lang = locale && LANGUAGES1[locale];
    str = str == null ? "" : String(str);
    if (lang) {
        str = str.replace(lang.regexp, function (m) {
            return lang.map[m];
        });
    }
    return str.toUpperCase();
}
function camelCase(value, locale, mergeNumbers) {
    let result = normalCase(value, locale);
    if (!mergeNumbers) {
        result = result.replace(/ (?=\d)/g, "_");
    }
    return result.replace(/ (.)/g, function (m, $1) {
        return __default1($1, locale);
    });
}
function paramCase(value, locale) {
    return normalCase(value, locale, "-");
}
function normalize(args) {
    const normalized = [];
    let inLiteral = false;
    for (const arg of args) {
        if (inLiteral) {
            normalized.push(arg);
        } else if (arg === "--") {
            inLiteral = true;
            normalized.push(arg);
        } else if (arg[0] === "-") {
            const isLong = arg[1] === "-";
            if (arg.includes("=")) {
                const parts = arg.split("=");
                const flag = parts.shift();
                if (isLong) {
                    normalized.push(flag);
                } else {
                    normalizeShortFlags(flag);
                }
                normalized.push(parts.join("="));
            } else if (isLong) {
                normalized.push(arg);
            } else {
                normalizeShortFlags(arg);
            }
        } else {
            normalized.push(arg);
        }
    }
    return normalized;
    function normalizeShortFlags(flag) {
        const flags = flag.slice(1).split("");
        if (isNaN(flag[flag.length - 1])) {
            flags.forEach((val) => normalized.push(`-${val}`));
        } else {
            normalized.push(`-${flags.shift()}`);
            normalized.push(flags.join(""));
        }
    }
}
var OptionType1;
(function (OptionType) {
    OptionType["STRING"] = "string";
    OptionType["NUMBER"] = "number";
    OptionType["BOOLEAN"] = "boolean";
})(OptionType1 || (OptionType1 = {}));
const __boolean = (option, arg, value) => {
    if (~["1", "true"].indexOf(value)) {
        return true;
    }
    if (~["0", "false"].indexOf(value)) {
        return false;
    }
    throw new Error(
        `Option --${option.name} must be of type boolean but got: ${value}`
    );
};
const number = (option, arg, value) => {
    if (isNaN(value)) {
        throw new Error(
            `Option --${option.name} must be of type number but got: ${value}`
        );
    }
    return parseFloat(value);
};
const string1 = (option, arg, value) => {
    return value;
};
const Types = {
    [OptionType1.STRING]: string1,
    [OptionType1.NUMBER]: number,
    [OptionType1.BOOLEAN]: __boolean,
};
function getOption(flags, name) {
    while (name[0] === "-") {
        name = name.slice(1);
    }
    for (const flag of flags) {
        if (isOption(flag, name)) {
            return flag;
        }
    }
    return;
}
function validateFlags(flags, values, knownFlaks, allowEmpty) {
    const defaultValues = {};
    for (const option of flags) {
        const name = camelCase(option.name);
        if (
            typeof values[name] === "undefined" &&
            typeof option.default !== "undefined"
        ) {
            values[name] =
                typeof option.default === "function"
                    ? option.default()
                    : option.default;
            defaultValues[name] = true;
        }
    }
    const keys = Object.keys(values);
    if (keys.length === 0 && allowEmpty) {
        return;
    }
    const options = keys.map((name) => ({
        name,
        option: getOption(flags, paramCase(name)),
    }));
    for (const { name: name1, option: option1 } of options) {
        if (!option1) {
            throw new Error("Unknown option: --" + name1);
        }
        if (option1.standalone) {
            if (keys.length > 1) {
                if (
                    options.every(
                        ({ option: opt }) =>
                            opt && (option1 === opt || defaultValues[opt.name])
                    )
                ) {
                    return;
                }
                throw new Error(
                    `Option --${option1.name} cannot be combined with other options.`
                );
            }
            return;
        }
        option1.conflicts?.forEach((flag) => {
            if (isset(flag)) {
                throw new Error(
                    `Option --${option1.name} conflicts with option: --${flag}`
                );
            }
        });
        option1.depends?.forEach((flag) => {
            if (!isset(flag) && !defaultValues[option1.name]) {
                throw new Error(
                    `Option --${option1.name} depends on option: --${flag}`
                );
            }
        });
        const isArray = (option1.args?.length || 0) > 1;
        option1.args?.forEach((arg, i) => {
            if (
                arg.requiredValue &&
                (typeof values[name1] === "undefined" ||
                    (isArray && typeof values[name1][i] === "undefined"))
            ) {
                throw new Error(`Missing value for option: --${option1.name}`);
            }
        });
        function isset(flag) {
            const name = camelCase(flag);
            return typeof values[name] !== "undefined";
        }
    }
    for (const option2 of flags) {
        if (option2.required && !(camelCase(option2.name) in values)) {
            if (
                (!option2.conflicts ||
                    !option2.conflicts.find((flag) => !!values[flag])) &&
                !options.find((opt) =>
                    opt.option?.conflicts?.find((flag) => flag === option2.name)
                )
            ) {
                throw new Error(`Missing required option: --${option2.name}`);
            }
        }
    }
    if (keys.length === 0 && !allowEmpty) {
        throw new Error("No arguments.");
    }
}
function parseFlags(args2, opts = {}) {
    !opts.flags && (opts.flags = []);
    const normalized = normalize(args2);
    let inLiteral = false;
    let negate = false;
    const flags = {};
    const literal = [];
    const unknown = [];
    let stopEarly = false;
    opts.flags.forEach((opt) => {
        opt.depends?.forEach((flag) => {
            if (!opts.flags || !getOption(opts.flags, flag)) {
                throw new Error(`Unknown required option: ${flag}`);
            }
        });
        opt.conflicts?.forEach((flag) => {
            if (!opts.flags || !getOption(opts.flags, flag)) {
                throw new Error(`Unknown conflicting option: ${flag}`);
            }
        });
    });
    for (let i = 0; i < normalized.length; i++) {
        let option3;
        let args1;
        const current = normalized[i];
        if (inLiteral) {
            literal.push(current);
            continue;
        }
        if (current === "--") {
            inLiteral = true;
            continue;
        }
        const isFlag = current.length > 1 && current[0] === "-";
        const next = () => normalized[i + 1];
        if (isFlag && !stopEarly) {
            if (
                current[2] === "-" ||
                (current[1] === "-" && current.length === 3)
            ) {
                throw new Error(`Invalid flag name: ${current}`);
            }
            negate = current.indexOf("--no-") === 0;
            const name = current.replace(/^-+(no-)?/, "");
            option3 = getOption(opts.flags, name);
            if (!option3) {
                if (opts.flags.length) {
                    throw new Error(`Unknown option: ${current}`);
                }
                option3 = {
                    name,
                    optionalValue: true,
                    type: OptionType1.STRING,
                };
            }
            if (!option3.name) {
                throw new Error(`Missing name for option: ${current}`);
            }
            const friendlyName = camelCase(option3.name);
            if (
                typeof flags[friendlyName] !== "undefined" &&
                !option3.collect
            ) {
                throw new Error(`Duplicate option: ${current}`);
            }
            args1 = option3.args?.length
                ? option3.args
                : [
                      {
                          type: option3.type,
                          requiredValue: option3.requiredValue,
                          optionalValue: option3.optionalValue,
                          variadic: option3.variadic,
                          list: option3.list,
                          separator: option3.separator,
                      },
                  ];
            let argIndex = 0;
            let inOptionalArg = false;
            const previous = flags[friendlyName];
            parseNext(option3, args1);
            if (typeof flags[friendlyName] === "undefined") {
                if (typeof option3.default !== "undefined") {
                    flags[friendlyName] =
                        typeof option3.default === "function"
                            ? option3.default()
                            : option3.default;
                } else if (args1[argIndex].requiredValue) {
                    throw new Error(
                        `Missing value for option: --${option3.name}`
                    );
                } else {
                    flags[friendlyName] = true;
                }
            }
            if (typeof option3.value !== "undefined") {
                flags[friendlyName] = option3.value(
                    flags[friendlyName],
                    previous
                );
            } else if (option3.collect) {
                const value = previous || [];
                value.push(flags[friendlyName]);
                flags[friendlyName] = value;
            }
            function parseNext(option4, args) {
                const arg1 = args[argIndex];
                if (!arg1) {
                    throw new Error("Unknown option: " + next());
                }
                if (!arg1.type) {
                    arg1.type = OptionType1.BOOLEAN;
                }
                if (option4.args?.length) {
                    if (
                        (typeof arg1.optionalValue === "undefined" ||
                            arg1.optionalValue === false) &&
                        typeof arg1.requiredValue === "undefined"
                    ) {
                        arg1.requiredValue = true;
                    }
                } else {
                    if (
                        arg1.type !== OptionType1.BOOLEAN &&
                        (typeof arg1.optionalValue === "undefined" ||
                            arg1.optionalValue === false) &&
                        typeof arg1.requiredValue === "undefined"
                    ) {
                        arg1.requiredValue = true;
                    }
                }
                if (arg1.requiredValue) {
                    if (inOptionalArg) {
                        throw new Error(
                            `An required argument can not follow an optional argument but found in: ${option4.name}`
                        );
                    }
                } else {
                    inOptionalArg = true;
                }
                if (negate) {
                    if (
                        arg1.type !== OptionType1.BOOLEAN &&
                        !arg1.optionalValue
                    ) {
                        throw new Error(
                            `Negate not supported by --${option4.name}. Only optional option or options of type boolean can be negated.`
                        );
                    }
                    flags[friendlyName] = false;
                    return;
                }
                let result1;
                let increase = false;
                if (arg1.list && hasNext(arg1)) {
                    const parsed = next()
                        .split(arg1.separator || ",")
                        .map((nextValue) => {
                            const value = parseValue(option4, arg1, nextValue);
                            if (typeof value === "undefined") {
                                throw new Error(
                                    `List item of option --${option4?.name} must be of type ${arg1.type} but got: ${nextValue}`
                                );
                            }
                            return value;
                        });
                    if (parsed?.length) {
                        result1 = parsed;
                    }
                } else {
                    if (hasNext(arg1)) {
                        result1 = parseValue(option4, arg1, next());
                    } else if (
                        arg1.optionalValue &&
                        arg1.type === OptionType1.BOOLEAN
                    ) {
                        result1 = true;
                    }
                }
                if (increase) {
                    i++;
                    if (!arg1.variadic) {
                        argIndex++;
                    } else if (args[argIndex + 1]) {
                        throw new Error(
                            "An argument cannot follow an variadic argument: " +
                                next()
                        );
                    }
                }
                if (
                    typeof result1 !== "undefined" &&
                    (args.length > 1 || arg1.variadic)
                ) {
                    if (!flags[friendlyName]) {
                        flags[friendlyName] = [];
                    }
                    flags[friendlyName].push(result1);
                    if (hasNext(arg1)) {
                        parseNext(option4, args);
                    }
                } else {
                    flags[friendlyName] = result1;
                }
                function hasNext(arg) {
                    return !!(
                        normalized[i + 1] &&
                        (arg.optionalValue ||
                            arg.requiredValue ||
                            arg.variadic) &&
                        (normalized[i + 1][0] !== "-" ||
                            (arg.type === OptionType1.NUMBER &&
                                !isNaN(normalized[i + 1]))) &&
                        arg
                    );
                }
                function parseValue(option, arg, nextValue) {
                    let result = opts.parse
                        ? opts.parse(
                              arg.type || OptionType1.STRING,
                              option,
                              arg,
                              nextValue
                          )
                        : parseFlagValue(option, arg, nextValue);
                    if (typeof result !== "undefined") {
                        increase = true;
                    }
                    return result;
                }
            }
        } else {
            if (opts.stopEarly) {
                stopEarly = true;
            }
            unknown.push(current);
        }
    }
    if (opts.flags && opts.flags.length) {
        validateFlags(opts.flags, flags, opts.knownFlaks, opts.allowEmpty);
    }
    return {
        flags: flags,
        unknown,
        literal,
    };
}
function parseFlagValue(option, arg, nextValue) {
    const type = Types[arg.type || OptionType1.STRING];
    if (!type) {
        throw new Error(`Unknown type ${arg.type}`);
    }
    return type(option, arg, nextValue);
}
function isOption(option, name) {
    return (
        option.name === name ||
        (option.aliases && option.aliases.indexOf(name) !== -1)
    );
}
function fill(count, str = "", __char = " ") {
    while (str.length < count) {
        str += __char;
    }
    return str;
}
const { inspect } = Deno;
const formatRegExp = /%[sdjoO%]/g;
function format(...args) {
    if (typeof args[0] !== "string") {
        let objects = [];
        for (let i = 0; i < arguments.length; i++) {
            objects.push(inspect(arguments[i]));
        }
        return objects.join(" ");
    }
    let i = 1;
    const f = args[0];
    const len = args.length;
    let str = String(f).replace(formatRegExp, function (x) {
        if (x === "%%") {
            return "%";
        }
        if (i >= len) {
            return x;
        }
        switch (x) {
            case "%s":
                return String(args[i++]);
            case "%d":
                return String(Number(args[i++]));
            case "%j":
                try {
                    return JSON.stringify(args[i++]);
                } catch (_) {
                    return "[Circular]";
                }
            case "%o":
            case "%O":
                return inspect(args[i++]);
            default:
                return x;
        }
    });
    for (let x1 = args[i]; i < len; x1 = args[++i]) {
        if (x1 == null || typeof x1 !== "object") {
            str += " " + x1;
        } else {
            str += " " + inspect(x1);
        }
    }
    return str;
}
class Type {}
class BooleanType extends Type {
    parse(option7, arg4, value7) {
        return __boolean(option7, arg4, value7);
    }
    complete() {
        return ["true", "false"];
    }
}
class NumberType extends Type {
    parse(option5, arg2, value1) {
        return number(option5, arg2, value1);
    }
}
class StringType extends Type {
    parse(option6, arg3, value2) {
        return string1(option6, arg3, value2);
    }
}
class ArgumentsParser {
    static splitArguments(args) {
        const parts = args.trim().split(/[, =] */g);
        const typeParts = [];
        while (
            parts[parts.length - 1] &&
            this.ARGUMENT_REGEX.test(parts[parts.length - 1])
        ) {
            typeParts.unshift(parts.pop());
        }
        const typeDefinition = typeParts.join(" ");
        return {
            args: parts,
            typeDefinition,
        };
    }
    static parseArgumentsDefinition(argsDefinition) {
        const argumentDetails = [];
        let hasOptional = false;
        let hasVariadic = false;
        const parts = argsDefinition.split(/ +/);
        for (const arg of parts) {
            if (hasVariadic) {
                throw new Error(
                    "An argument can not follow an variadic argument."
                );
            }
            const parts = arg.split(this.ARGUMENT_DETAILS_REGEX);
            const type = parts[2] || OptionType1.STRING;
            let details = {
                optionalValue: arg[0] !== "<",
                name: parts[1],
                action: parts[3] || type,
                variadic: false,
                list: type ? arg.indexOf(type + "[]") !== -1 : false,
                type,
            };
            if (!details.optionalValue && hasOptional) {
                throw new Error(
                    "An required argument can not follow an optional argument."
                );
            }
            if (arg[0] === "[") {
                hasOptional = true;
            }
            if (details.name.length > 3) {
                const istVariadicLeft = details.name.slice(0, 3) === "...";
                const istVariadicRight = details.name.slice(-3) === "...";
                hasVariadic = details.variadic =
                    istVariadicLeft || istVariadicRight;
                if (istVariadicLeft) {
                    details.name = details.name.slice(3);
                } else if (istVariadicRight) {
                    details.name = details.name.slice(0, -3);
                }
            }
            if (details.name) {
                argumentDetails.push(details);
            }
        }
        return argumentDetails;
    }
    static highlightArguments(argsDefinition1) {
        if (!argsDefinition1) {
            return "";
        }
        return this.parseArgumentsDefinition(argsDefinition1)
            .map((arg) => this.highlightArgumentDetails(arg))
            .join(" ");
    }
    static highlightArgumentDetails(arg5) {
        let str = "";
        str += yellow(arg5.optionalValue ? "[" : "<");
        let name = "";
        name += arg5.name;
        if (arg5.variadic) {
            name += "...";
        }
        name = magenta(name);
        str += name;
        str += yellow(":");
        str += red(arg5.type);
        if (arg5.list) {
            str += green("[]");
        }
        str += yellow(arg5.optionalValue ? "]" : ">");
        return str;
    }
}
ArgumentsParser.ARGUMENT_REGEX = /^[<\[].+[\]>]$/;
ArgumentsParser.ARGUMENT_DETAILS_REGEX = /[<\[:>\]]/;
const border = {
    top: "─",
    topMid: "┬",
    topLeft: "┌",
    topRight: "┐",
    bottom: "─",
    bottomMid: "┴",
    bottomLeft: "└",
    bottomRight: "┘",
    left: "│",
    leftMid: "├",
    mid: "─",
    midMid: "┼",
    right: "│",
    rightMid: "┤",
    middle: "│",
};
class Cell {
    get length() {
        return this.toString().length;
    }
    static from(value3) {
        const cell = new this(value3);
        if (value3 instanceof Cell) {
            cell.options = Object.assign({}, value3.options);
        }
        return cell;
    }
    constructor(value4) {
        this.value = value4;
        this.options = {};
    }
    toString() {
        return this.value.toString();
    }
    setValue(value5) {
        this.value = value5;
        return this;
    }
    clone(value6) {
        const cell = new Cell(value6 ?? this);
        cell.options = Object.assign({}, this.options);
        return cell;
    }
    border(enable, override = true) {
        if (override || typeof this.options.border === "undefined") {
            this.options.border = enable;
        }
        return this;
    }
    colSpan(span2, override1 = true) {
        if (override1 || typeof this.options.colSpan === "undefined") {
            this.options.colSpan = span2;
        }
        return this;
    }
    rowSpan(span1, override2 = true) {
        if (override2 || typeof this.options.rowSpan === "undefined") {
            this.options.rowSpan = span1;
        }
        return this;
    }
    getBorder() {
        return this.options.border === true;
    }
    getColSpan() {
        return typeof this.options.colSpan === "number" &&
            this.options.colSpan > 0
            ? this.options.colSpan
            : 1;
    }
    getRowSpan() {
        return typeof this.options.rowSpan === "number" &&
            this.options.rowSpan > 0
            ? this.options.rowSpan
            : 1;
    }
}
class Row extends Array {
    static from(cells) {
        const row = new this(...cells);
        if (cells instanceof Row) {
            row.options = Object.assign({}, cells.options);
        }
        return row;
    }
    clone() {
        const row = new Row(
            ...this.map((cell) => (cell instanceof Cell ? cell.clone() : cell))
        );
        row.options = Object.assign({}, this.options);
        return row;
    }
    border(enable1, override3 = true) {
        if (override3 || typeof this.options.border === "undefined") {
            this.options.border = enable1;
        }
        return this;
    }
    getBorder() {
        return this.options.border === true;
    }
    hasBorder() {
        return (
            this.getBorder() ||
            this.some((cell) => cell instanceof Cell && cell.getBorder())
        );
    }
    constructor(...args3) {
        super(...args3);
        this.options = {};
    }
}
function consumeWords(length, content) {
    let consumed = "";
    const words = content.split(/ /g);
    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        let hasLineBreak = word.indexOf("\n") !== -1;
        if (hasLineBreak) {
            word = word.split("\n").shift();
        }
        if (consumed) {
            const nextLength = stripeColors(word).length;
            const consumedLength = stripeColors(consumed).length;
            if (consumedLength + nextLength >= length) {
                break;
            }
        }
        consumed += (i > 0 ? " " : "") + word;
        if (hasLineBreak) {
            break;
        }
    }
    return consumed;
}
const COLOR_REGEX = /(\x1b|\e|\033)\[([0-9]{1,3}(;[0-9]{1,2})?)?[mGK]/g;
function stripeColors(str) {
    return str.replace(COLOR_REGEX, "");
}
function longest(index, rows, maxWidth) {
    return Math.max(
        ...rows
            .map((row) =>
                (row[index] instanceof Cell && row[index].getColSpan() > 1
                    ? ""
                    : row[index]?.toString() || ""
                )
                    .split("\n")
                    .map((r) => {
                        const str =
                            typeof maxWidth === "undefined"
                                ? r
                                : consumeWords(maxWidth, r);
                        return stripeColors(str).length || 0;
                    })
            )
            .flat()
    );
}
class TableLayout {
    constructor(table, options5) {
        this.table = table;
        this.options = options5;
    }
    toString() {
        const opts = this.createLayout();
        return opts.rows.length ? this.renderRows(opts) : "";
    }
    createLayout() {
        Object.keys(this.options.chars).forEach((key) => {
            if (typeof this.options.chars[key] !== "string") {
                this.options.chars[key] = "";
            }
        });
        const hasBodyBorder =
            this.table.getBorder() || this.table.hasBodyBorder();
        const hasHeaderBorder = this.table.hasHeaderBorder();
        const hasBorder = hasHeaderBorder || hasBodyBorder;
        const header = this.table.getHeader();
        const rows = this.spanRows(
            header ? [header, ...this.table] : this.table.slice()
        );
        const columns = Math.max(...rows.map((row) => row.length));
        for (const row1 of rows) {
            const length = row1.length;
            if (length < columns) {
                const diff = columns - length;
                for (let i = 0; i < diff; i++) {
                    row1.push(this.createCell(null, row1));
                }
            }
        }
        const padding = [];
        const width = [];
        for (let colIndex = 0; colIndex < columns; colIndex++) {
            const minCellWidth = Array.isArray(this.options.minCellWidth)
                ? this.options.minCellWidth[colIndex]
                : this.options.minCellWidth;
            const maxCellWidth = Array.isArray(this.options.maxCellWidth)
                ? this.options.maxCellWidth[colIndex]
                : this.options.maxCellWidth;
            const cellWidth = longest(colIndex, rows, maxCellWidth);
            width[colIndex] = Math.min(
                maxCellWidth,
                Math.max(minCellWidth, cellWidth)
            );
            padding[colIndex] = Array.isArray(this.options.padding)
                ? this.options.padding[colIndex]
                : this.options.padding;
        }
        return {
            padding,
            width,
            rows,
            columns,
            hasBorder,
            hasBodyBorder,
            hasHeaderBorder,
        };
    }
    spanRows(_rows, rowIndex = 0, colIndex = 0, rowSpan = [], colSpan = 1) {
        const rows = _rows;
        if (rowIndex >= rows.length && rowSpan.every((span) => span === 1)) {
            return rows;
        } else if (
            rows[rowIndex] &&
            colIndex >= rows[rowIndex].length &&
            colIndex >= rowSpan.length &&
            colSpan === 1
        ) {
            return this.spanRows(rows, ++rowIndex, 0, rowSpan, 1);
        }
        if (colSpan > 1) {
            colSpan--;
            rowSpan[colIndex] = rowSpan[colIndex - 1];
            rows[rowIndex].splice(
                colIndex - 1,
                0,
                rows[rowIndex][colIndex - 1]
            );
            return this.spanRows(rows, rowIndex, ++colIndex, rowSpan, colSpan);
        }
        if (colIndex === 0) {
            rows[rowIndex] = this.createRow(rows[rowIndex] || []);
        }
        if (rowSpan[colIndex] > 1) {
            rowSpan[colIndex]--;
            rows[rowIndex].splice(colIndex, 0, rows[rowIndex - 1][colIndex]);
            return this.spanRows(rows, rowIndex, ++colIndex, rowSpan, colSpan);
        }
        rows[rowIndex][colIndex] = this.createCell(
            rows[rowIndex][colIndex] || null,
            rows[rowIndex]
        );
        colSpan = rows[rowIndex][colIndex].getColSpan();
        rowSpan[colIndex] = rows[rowIndex][colIndex].getRowSpan();
        return this.spanRows(rows, rowIndex, ++colIndex, rowSpan, colSpan);
    }
    createRow(row4) {
        return Row.from(row4).border(this.table.getBorder(), false);
    }
    createCell(cell2, row2) {
        return Cell.from(cell2 ?? "").border(row2.getBorder(), false);
    }
    renderRows(opts) {
        let result = "";
        const rowSpan = new Array(opts.columns).fill(1);
        for (let rowIndex = 0; rowIndex < opts.rows.length; rowIndex++) {
            result += this.renderRow(rowSpan, rowIndex, opts);
        }
        return result.slice(0, -1);
    }
    renderRow(rowSpan1, rowIndex1, opts1, inMultiline) {
        const row = opts1.rows[rowIndex1];
        const prevRow = opts1.rows[rowIndex1 - 1];
        const nextRow = opts1.rows[rowIndex1 + 1];
        let result = "";
        let colSpan = 1;
        if (!inMultiline && rowIndex1 === 0 && row.hasBorder()) {
            result += this.renderBorderRow(undefined, row, rowSpan1, opts1);
        }
        let isMultilineRow = false;
        result += " ".repeat(this.options.indent || 0);
        for (let colIndex = 0; colIndex < opts1.columns; colIndex++) {
            if (colSpan > 1) {
                colSpan--;
                rowSpan1[colIndex] = rowSpan1[colIndex - 1];
                continue;
            }
            result += this.renderCell(colIndex, row, prevRow, rowSpan1, opts1);
            if (rowSpan1[colIndex] > 1) {
                if (!inMultiline) {
                    rowSpan1[colIndex]--;
                }
            } else if (!prevRow || prevRow[colIndex] !== row[colIndex]) {
                rowSpan1[colIndex] = row[colIndex].getRowSpan();
            }
            colSpan = row[colIndex].getColSpan();
            if (rowSpan1[colIndex] === 1 && row[colIndex].length) {
                isMultilineRow = true;
            }
        }
        if (opts1.columns > 0) {
            if (row[opts1.columns - 1].getBorder()) {
                result += this.options.chars.right;
            } else if (opts1.hasBorder) {
                result += " ";
            }
        }
        result += "\n";
        if (isMultilineRow) {
            return (
                result +
                this.renderRow(rowSpan1, rowIndex1, opts1, isMultilineRow)
            );
        }
        if (
            (rowIndex1 === 0 && opts1.hasHeaderBorder) ||
            (rowIndex1 < opts1.rows.length - 1 && opts1.hasBodyBorder)
        ) {
            result += this.renderBorderRow(row, nextRow, rowSpan1, opts1);
        }
        if (rowIndex1 === opts1.rows.length - 1 && row.hasBorder()) {
            result += this.renderBorderRow(row, undefined, rowSpan1, opts1);
        }
        return result;
    }
    renderCell(colIndex1, row3, prevRow, rowSpan2, opts2, noBorder) {
        let result = "";
        const prevCell = row3[colIndex1 - 1];
        const cell = row3[colIndex1];
        if (!noBorder) {
            if (colIndex1 === 0) {
                if (cell.getBorder()) {
                    result += this.options.chars.left;
                } else if (opts2.hasBorder) {
                    result += " ";
                }
            } else {
                if (cell.getBorder() || prevCell?.getBorder()) {
                    result += this.options.chars.middle;
                } else if (opts2.hasBorder) {
                    result += " ";
                }
            }
        }
        let maxLength = opts2.width[colIndex1];
        const colSpan = cell.getColSpan();
        if (colSpan > 1) {
            for (let o = 1; o < colSpan; o++) {
                maxLength +=
                    opts2.width[colIndex1 + o] + opts2.padding[colIndex1 + o];
                if (opts2.hasBorder) {
                    maxLength += opts2.padding[colIndex1 + o] + 1;
                }
            }
        }
        const { current, next } = this.renderCellValue(cell, maxLength);
        row3[colIndex1].setValue(next);
        if (opts2.hasBorder) {
            result += " ".repeat(opts2.padding[colIndex1]);
        }
        result += current;
        if (opts2.hasBorder || colIndex1 < opts2.columns - 1) {
            result += " ".repeat(opts2.padding[colIndex1]);
        }
        return result;
    }
    renderCellValue(cell1, maxLength) {
        const length = Math.min(
            maxLength,
            stripeColors(cell1.toString()).length
        );
        let words = consumeWords(length, cell1.toString());
        const breakWord = stripeColors(words).length > length;
        if (breakWord) {
            words = words.slice(0, length);
        }
        const next = cell1.toString().slice(words.length + (breakWord ? 0 : 1));
        const fillLength = maxLength - stripeColors(words).length;
        const current = words + " ".repeat(fillLength);
        return {
            current,
            next: cell1.clone(next),
        };
    }
    renderBorderRow(prevRow1, nextRow, rowSpan3, opts3) {
        let result = "";
        let colSpan = 1;
        for (let colIndex = 0; colIndex < opts3.columns; colIndex++) {
            if (rowSpan3[colIndex] > 1) {
                if (!nextRow) {
                    throw new Error("invalid layout");
                }
                if (colSpan > 1) {
                    colSpan--;
                    continue;
                }
            }
            result += this.renderBorderCell(
                colIndex,
                prevRow1,
                nextRow,
                rowSpan3,
                opts3
            );
            colSpan = nextRow?.[colIndex].getColSpan() ?? 1;
        }
        return result.length
            ? " ".repeat(this.options.indent) + result + "\n"
            : "";
    }
    renderBorderCell(colIndex2, prevRow2, nextRow1, rowSpan4, opts4) {
        const a1 = prevRow2?.[colIndex2 - 1];
        const a2 = nextRow1?.[colIndex2 - 1];
        const b1 = prevRow2?.[colIndex2];
        const b2 = nextRow1?.[colIndex2];
        const a1Border = !!a1?.getBorder();
        const a2Border = !!a2?.getBorder();
        const b1Border = !!b1?.getBorder();
        const b2Border = !!b2?.getBorder();
        const hasColSpan = (cell) => (cell?.getColSpan() ?? 1) > 1;
        const hasRowSpan = (cell) => (cell?.getRowSpan() ?? 1) > 1;
        let result = "";
        if (colIndex2 === 0) {
            if (rowSpan4[colIndex2] > 1) {
                if (b1Border) {
                    result += this.options.chars.left;
                } else {
                    result += " ";
                }
            } else if (b1Border && b2Border) {
                result += this.options.chars.leftMid;
            } else if (b1Border) {
                result += this.options.chars.bottomLeft;
            } else if (b2Border) {
                result += this.options.chars.topLeft;
            } else {
                result += " ";
            }
        } else if (colIndex2 < opts4.columns) {
            if ((a1Border && b2Border) || (b1Border && a2Border)) {
                const a1ColSpan = hasColSpan(a1);
                const a2ColSpan = hasColSpan(a2);
                const b1ColSpan = hasColSpan(b1);
                const b2ColSpan = hasColSpan(b2);
                const a1RowSpan = hasRowSpan(a1);
                const a2RowSpan = hasRowSpan(a2);
                const b1RowSpan = hasRowSpan(b1);
                const b2RowSpan = hasRowSpan(b2);
                const hasAllBorder =
                    a1Border && b2Border && b1Border && a2Border;
                const hasAllRowSpan =
                    a1RowSpan && b1RowSpan && a2RowSpan && b2RowSpan;
                const hasAllColSpan =
                    a1ColSpan && b1ColSpan && a2ColSpan && b2ColSpan;
                if (hasAllRowSpan && hasAllBorder) {
                    result += this.options.chars.middle;
                } else if (
                    hasAllColSpan &&
                    hasAllBorder &&
                    a1 === b1 &&
                    a2 === b2
                ) {
                    result += this.options.chars.mid;
                } else if (a1ColSpan && b1ColSpan && a1 === b1) {
                    result += this.options.chars.topMid;
                } else if (a2ColSpan && b2ColSpan && a2 === b2) {
                    result += this.options.chars.bottomMid;
                } else if (a1RowSpan && a2RowSpan && a1 === a2) {
                    result += this.options.chars.leftMid;
                } else if (b1RowSpan && b2RowSpan && b1 === b2) {
                    result += this.options.chars.rightMid;
                } else {
                    result += this.options.chars.midMid;
                }
            } else if (a1Border && b1Border) {
                if (hasColSpan(a1) && hasColSpan(b1) && a1 === b1) {
                    result += this.options.chars.bottom;
                } else {
                    result += this.options.chars.bottomMid;
                }
            } else if (b1Border && b2Border) {
                if (rowSpan4[colIndex2] > 1) {
                    result += this.options.chars.left;
                } else {
                    result += this.options.chars.leftMid;
                }
            } else if (b2Border && a2Border) {
                if (hasColSpan(a2) && hasColSpan(b2) && a2 === b2) {
                    result += this.options.chars.top;
                } else {
                    result += this.options.chars.topMid;
                }
            } else if (a1Border && a2Border) {
                if (hasRowSpan(a1) && a1 === a2) {
                    result += this.options.chars.right;
                } else {
                    result += this.options.chars.rightMid;
                }
            } else if (a1Border) {
                result += this.options.chars.bottomRight;
            } else if (b1Border) {
                result += this.options.chars.bottomLeft;
            } else if (a2Border) {
                result += this.options.chars.topRight;
            } else if (b2Border) {
                result += this.options.chars.topLeft;
            } else {
                result += " ";
            }
        }
        const length =
            opts4.padding[colIndex2] +
            opts4.width[colIndex2] +
            opts4.padding[colIndex2];
        if (rowSpan4[colIndex2] > 1 && nextRow1) {
            result += this.renderCell(
                colIndex2,
                nextRow1,
                prevRow2,
                rowSpan4,
                opts4,
                true
            );
            if (nextRow1[colIndex2] === nextRow1[nextRow1.length - 1]) {
                if (b1Border) {
                    result += this.options.chars.right;
                } else {
                    result += " ";
                }
                return result;
            }
        } else if (b1Border && b2Border) {
            result += this.options.chars.mid.repeat(length);
        } else if (b1Border) {
            result += this.options.chars.bottom.repeat(length);
        } else if (b2Border) {
            result += this.options.chars.top.repeat(length);
        } else {
            result += " ".repeat(length);
        }
        if (colIndex2 === opts4.columns - 1) {
            if (b1Border && b2Border) {
                result += this.options.chars.rightMid;
            } else if (b1Border) {
                result += this.options.chars.bottomRight;
            } else if (b2Border) {
                result += this.options.chars.topRight;
            } else {
                result += " ";
            }
        }
        return result;
    }
}
class Table extends Array {
    static from(rows) {
        const table = new this(...rows);
        if (rows instanceof Table) {
            table.options = Object.assign({}, rows.options);
            table.headerRow = rows.headerRow
                ? Row.from(rows.headerRow)
                : undefined;
        }
        return table;
    }
    static fromJson(rows1) {
        return new this().fromJson(rows1);
    }
    static render(rows2) {
        Table.from(rows2).render();
    }
    fromJson(rows3) {
        this.header(Object.keys(rows3[0]));
        this.body(rows3.map((row) => Object.values(row)));
        return this;
    }
    header(header) {
        this.headerRow = header instanceof Row ? header : Row.from(header);
        return this;
    }
    body(rows4) {
        this.length = 0;
        this.push(...rows4);
        return this;
    }
    clone() {
        const table = new Table(
            ...this.map((row) =>
                row instanceof Row ? row.clone() : Row.from(row).clone()
            )
        );
        table.options = Object.assign({}, this.options);
        table.headerRow = this.headerRow?.clone();
        return table;
    }
    toString() {
        return new TableLayout(this, this.options).toString();
    }
    render() {
        Deno.stdout.writeSync(encode(this.toString() + "\n"));
        return this;
    }
    maxCellWidth(width, override4 = true) {
        if (override4 || typeof this.options.maxCellWidth === "undefined") {
            this.options.maxCellWidth = width;
        }
        return this;
    }
    minCellWidth(width1, override5 = true) {
        if (override5 || typeof this.options.minCellWidth === "undefined") {
            this.options.minCellWidth = width1;
        }
        return this;
    }
    indent(width2, override6 = true) {
        if (override6 || typeof this.options.indent === "undefined") {
            this.options.indent = width2;
        }
        return this;
    }
    padding(padding, override7 = true) {
        if (override7 || typeof this.options.padding === "undefined") {
            this.options.padding = padding;
        }
        return this;
    }
    border(enable2, override8 = true) {
        if (override8 || typeof this.options.border === "undefined") {
            this.options.border = enable2;
        }
        return this;
    }
    chars(chars) {
        Object.assign(this.options.chars, chars);
        return this;
    }
    getHeader() {
        return this.headerRow;
    }
    getBody() {
        return this.slice();
    }
    getMaxCellWidth() {
        return this.options.maxCellWidth;
    }
    getMinCellWidth() {
        return this.options.minCellWidth;
    }
    getIndent() {
        return this.options.indent;
    }
    getPadding() {
        return this.options.padding;
    }
    getBorder() {
        return this.options.border === true;
    }
    hasHeaderBorder() {
        return (
            this.getBorder() ||
            (this.headerRow instanceof Row && this.headerRow.hasBorder())
        );
    }
    hasBodyBorder() {
        return (
            this.getBorder() ||
            this.some((row) =>
                row instanceof Row
                    ? row.hasBorder()
                    : row.some((cell) =>
                          cell instanceof Cell ? cell.getBorder : false
                      )
            )
        );
    }
    hasBorder() {
        return this.hasHeaderBorder() || this.hasBodyBorder();
    }
    constructor(...args4) {
        super(...args4);
        this.options = {
            indent: 0,
            border: false,
            maxCellWidth: Infinity,
            minCellWidth: 0,
            padding: 1,
            chars: border,
        };
    }
}
class HelpGenerator {
    static generate(cmd3) {
        return new HelpGenerator(cmd3).generate();
    }
    constructor(cmd1) {
        this.cmd = cmd1;
        this.indent = 2;
    }
    generate() {
        return (
            this.generateHeader() +
            this.generateDescription() +
            this.generateOptions() +
            this.generateCommands() +
            this.generateEnvironmentVariables() +
            this.generateExamples() +
            "\n"
        );
    }
    generateHeader() {
        return (
            "\n" +
            Table.from([
                [
                    bold("Usage:"),
                    magenta(
                        `${this.cmd.getName()}${
                            this.cmd.getArgsDefinition()
                                ? " " + this.cmd.getArgsDefinition()
                                : ""
                        }`
                    ),
                ],
                [bold("Version:"), yellow(`v${this.cmd.getVersion()}`)],
            ])
                .indent(this.indent)
                .padding(1)
                .toString() +
            "\n"
        );
    }
    generateDescription() {
        if (!this.cmd.getDescription()) {
            return "";
        }
        return (
            this.label("Description") +
            Table.from([[this.cmd.getDescription()]])
                .indent(this.indent * 2)
                .maxCellWidth(140)
                .padding(1)
                .toString() +
            "\n"
        );
    }
    generateOptions() {
        const options = this.cmd.getOptions(false);
        if (!options.length) {
            return "";
        }
        const hasTypeDefinitions = !!options.find(
            (option) => !!option.typeDefinition
        );
        if (hasTypeDefinitions) {
            return (
                this.label("Options") +
                Table.from([
                    ...options.map((option) => [
                        option.flags
                            .split(/,? +/g)
                            .map((flag) => blue(flag))
                            .join(", "),
                        ArgumentsParser.highlightArguments(
                            option.typeDefinition || ""
                        ),
                        red(bold("-")) +
                            " " +
                            option.description.split("\n").shift(),
                        this.generateHints(option),
                    ]),
                ])
                    .padding([2, 2, 2])
                    .indent(this.indent * 2)
                    .maxCellWidth([60, 60, 80, 60])
                    .toString() +
                "\n"
            );
        }
        return (
            this.label("Options") +
            Table.from([
                ...options.map((option) => [
                    option.flags
                        .split(/,? +/g)
                        .map((flag) => blue(flag))
                        .join(", "),
                    red(bold("-")) +
                        " " +
                        option.description.split("\n").shift(),
                    this.generateHints(option),
                ]),
            ])
                .padding([2, 2])
                .indent(this.indent * 2)
                .maxCellWidth([60, 80, 60])
                .toString() +
            "\n"
        );
    }
    generateCommands() {
        const commands = this.cmd.getCommands(false);
        if (!commands.length) {
            return "";
        }
        const hasTypeDefinitions = !!commands.find(
            (command) => !!command.getArgsDefinition()
        );
        if (hasTypeDefinitions) {
            return (
                this.label("Commands") +
                Table.from([
                    ...commands.map((command) => [
                        [command.getName(), ...command.getAliases()]
                            .map((name) => blue(name))
                            .join(", "),
                        ArgumentsParser.highlightArguments(
                            command.getArgsDefinition() || ""
                        ),
                        red(bold("-")) +
                            " " +
                            command.getDescription().split("\n").shift(),
                    ]),
                ])
                    .padding([2, 2, 2])
                    .indent(this.indent * 2)
                    .toString() +
                "\n"
            );
        }
        return (
            this.label("Commands") +
            Table.from([
                ...commands.map((command) => [
                    [command.getName(), ...command.getAliases()]
                        .map((name) => blue(name))
                        .join(", "),
                    red(bold("-")) +
                        " " +
                        command.getDescription().split("\n").shift(),
                ]),
            ])
                .padding([2, 2])
                .indent(this.indent * 2)
                .toString() +
            "\n"
        );
    }
    generateEnvironmentVariables() {
        const envVars = this.cmd.getEnvVars(false);
        if (!envVars.length) {
            return "";
        }
        return (
            this.label("Environment variables") +
            Table.from([
                ...envVars.map((envVar) => [
                    envVar.names.map((name) => blue(name)).join(", "),
                    ArgumentsParser.highlightArgumentDetails(envVar.details),
                    `${red(bold("-"))} ${envVar.description}`,
                ]),
            ])
                .padding(2)
                .indent(this.indent * 2)
                .toString() +
            "\n"
        );
    }
    generateExamples() {
        const examples = this.cmd.getExamples();
        if (!examples.length) {
            return "";
        }
        return (
            this.label("Examples") +
            Table.from(
                examples.map((example) => [
                    dim(bold(`${capitalize(example.name)}:`)),
                    `\n${example.description}`,
                ])
            )
                .padding(1)
                .indent(this.indent * 2)
                .maxCellWidth(150)
                .toString() +
            "\n"
        );
    }
    generateHints(option8) {
        const hints = [];
        option8.required && hints.push(yellow(`required`));
        typeof option8.default !== "undefined" &&
            hints.push(blue(bold(`Default: `)) + blue(format(option8.default)));
        option8.depends &&
            option8.depends.length &&
            hints.push(
                red(bold(`depends: `)) +
                    option8.depends.map((depends) => red(depends)).join(", ")
            );
        option8.conflicts &&
            option8.conflicts.length &&
            hints.push(
                red(bold(`conflicts: `)) +
                    option8.conflicts
                        .map((conflict) => red(conflict))
                        .join(", ")
            );
        if (hints.length) {
            return `(${hints.join(", ")})`;
        }
        return "";
    }
    line(...args5) {
        return (
            (args5.length ? " ".repeat(this.indent) + format(...args5) : "") +
            "\n"
        );
    }
    label(label) {
        return "\n" + this.line(bold(`${label}:`)) + "\n";
    }
}
function capitalize(string) {
    return string?.charAt(0).toUpperCase() + string.slice(1) ?? "";
}
const { stdout, stderr } = Deno;
const permissions = Deno.permissions;
const envPermissionStatus =
    permissions &&
    permissions.query &&
    (await permissions.query({
        name: "env",
    }));
const hasEnvPermissions =
    !!envPermissionStatus && envPermissionStatus.state === "granted";
class Command {
    versionOption(flags, desc, opts5) {
        this._versionOption =
            flags === false
                ? flags
                : {
                      flags,
                      desc,
                      opts:
                          typeof opts5 === "function"
                              ? {
                                    action: opts5,
                                }
                              : opts5,
                  };
        return this;
    }
    helpOption(flags1, desc1, opts6) {
        this._helpOption =
            flags1 === false
                ? flags1
                : {
                      flags: flags1,
                      desc: desc1,
                      opts:
                          typeof opts6 === "function"
                              ? {
                                    action: opts6,
                                }
                              : opts6,
                  };
        return this;
    }
    command(nameAndArguments, cmd2, override9) {
        let executableDescription;
        if (typeof cmd2 === "string") {
            executableDescription = cmd2;
            cmd2 = undefined;
        }
        const result = ArgumentsParser.splitArguments(nameAndArguments);
        const name = result.args.shift();
        const aliases = result.args;
        if (!name) {
            throw this.error(new Error("Missing command name."));
        }
        if (this.getBaseCommand(name, true)) {
            if (!override9) {
                throw this.error(new Error(`Duplicate command: ${name}`));
            }
            this.removeCommand(name);
        }
        const subCommand = (cmd2 || new Command()).reset();
        subCommand._name = name;
        subCommand._parent = this;
        if (executableDescription) {
            subCommand.isExecutable = true;
            subCommand.description(executableDescription);
        }
        if (result.typeDefinition) {
            subCommand.arguments(result.typeDefinition);
        }
        aliases.forEach((alias) => subCommand.aliases.push(alias));
        this.commands.set(name, subCommand);
        this.select(name);
        return this;
    }
    alias(alias) {
        if (this.cmd === this) {
            throw this.error(
                new Error(
                    `Failed to add alias '${alias}'. No sub command selected.`
                )
            );
        }
        if (this.cmd.aliases.indexOf(alias) !== -1) {
            throw this.error(new Error(`Duplicate alias: ${alias}`));
        }
        this.cmd.aliases.push(alias);
        return this;
    }
    reset() {
        return (this.cmd = this);
    }
    select(name12) {
        const cmd = this.getBaseCommand(name12, true);
        if (!cmd) {
            throw this.error(new Error(`Sub-command not found: ${name12}`));
        }
        this.cmd = cmd;
        return this;
    }
    name(name2) {
        this.cmd._name = name2;
        return this;
    }
    version(version) {
        this.cmd.ver = version;
        return this;
    }
    description(description) {
        this.cmd.desc = description;
        return this;
    }
    hidden() {
        this.cmd.isHidden = true;
        return this;
    }
    global() {
        this.cmd.isGlobal = true;
        return this;
    }
    arguments(args6) {
        this.cmd.argsDefinition = args6;
        return this;
    }
    action(fn) {
        this.cmd.fn = fn;
        return this;
    }
    allowEmpty(allowEmpty = true) {
        this.cmd._allowEmpty = allowEmpty;
        return this;
    }
    stopEarly(stopEarly = true) {
        this.cmd._stopEarly = stopEarly;
        return this;
    }
    useRawArgs(useRawArgs = true) {
        this.cmd._useRawArgs = useRawArgs;
        return this;
    }
    default(name3) {
        this.cmd.defaultCommand = name3;
        return this;
    }
    type(name4, handler, options1) {
        if (this.cmd.types.get(name4) && !options1?.override) {
            throw this.error(new Error(`Type '${name4}' already exists.`));
        }
        this.cmd.types.set(name4, {
            ...options1,
            name: name4,
            handler,
        });
        if (
            handler instanceof Type &&
            typeof handler.complete !== "undefined"
        ) {
            this.complete(
                name4,
                (cmd, parent) => handler.complete?.(cmd, parent) || [],
                options1
            );
        }
        return this;
    }
    complete(name5, complete, options2) {
        if (this.cmd.completions.has(name5) && !options2?.override) {
            throw this.error(
                new Error(`Completion '${name5}' already exists.`)
            );
        }
        this.cmd.completions.set(name5, {
            name: name5,
            complete,
            ...options2,
        });
        return this;
    }
    throwErrors() {
        this.cmd.throwOnError = true;
        return this;
    }
    shouldThrowErrors() {
        return this.cmd.throwOnError || !!this.cmd._parent?.shouldThrowErrors();
    }
    getCompletions() {
        return this.getGlobalCompletions().concat(this.getBaseCompletions());
    }
    getBaseCompletions() {
        return Array.from(this.completions.values());
    }
    getGlobalCompletions() {
        const getCompletions = (cmd, completions = [], names = []) => {
            if (cmd) {
                if (cmd.completions.size) {
                    cmd.completions.forEach((completion) => {
                        if (
                            completion.global &&
                            !this.completions.has(completion.name) &&
                            names.indexOf(completion.name) === -1
                        ) {
                            names.push(completion.name);
                            completions.push(completion);
                        }
                    });
                }
                return getCompletions(cmd._parent, completions, names);
            }
            return completions;
        };
        return getCompletions(this._parent);
    }
    getCompletion(name6) {
        return this.getBaseCompletion(name6) ?? this.getGlobalCompletion(name6);
    }
    getBaseCompletion(name7) {
        return this.completions.get(name7);
    }
    getGlobalCompletion(name8) {
        if (!this._parent) {
            return;
        }
        let completion = this._parent.getBaseCompletion(name8);
        if (!completion?.global) {
            return this._parent.getGlobalCompletion(name8);
        }
        return completion;
    }
    option(flags2, desc2, opts7) {
        if (typeof opts7 === "function") {
            return this.option(flags2, desc2, {
                value: opts7,
            });
        }
        const result = ArgumentsParser.splitArguments(flags2);
        const args = result.typeDefinition
            ? ArgumentsParser.parseArgumentsDefinition(result.typeDefinition)
            : [];
        const option = {
            name: "",
            description: desc2,
            args,
            flags: result.args.join(", "),
            typeDefinition: result.typeDefinition,
            ...opts7,
        };
        if (option.separator) {
            for (const arg of args) {
                if (arg.list) {
                    arg.separator = option.separator;
                }
            }
        }
        for (const part of result.args) {
            const arg = part.trim();
            const isLong = /^--/.test(arg);
            const name = isLong ? arg.slice(2) : arg.slice(1);
            if (
                option.name === name ||
                (option.aliases && ~option.aliases.indexOf(name))
            ) {
                throw this.error(new Error(`Duplicate command name: ${name}`));
            }
            if (!option.name && isLong) {
                option.name = name;
            } else if (!option.aliases) {
                option.aliases = [name];
            } else {
                option.aliases.push(name);
            }
            if (this.cmd.getBaseOption(name, true)) {
                if (opts7?.override) {
                    this.removeOption(name);
                } else {
                    throw this.error(
                        new Error(`Duplicate option name: ${name}`)
                    );
                }
            }
        }
        if (option.prepend) {
            this.cmd.options.unshift(option);
        } else {
            this.cmd.options.push(option);
        }
        return this;
    }
    example(name9, description1) {
        if (this.cmd.hasExample(name9)) {
            throw this.error(new Error("Example already exists."));
        }
        this.cmd.examples.push({
            name: name9,
            description: description1,
        });
        return this;
    }
    env(name10, description2, options3) {
        const result = ArgumentsParser.splitArguments(name10);
        if (!result.typeDefinition) {
            result.typeDefinition = "<value:boolean>";
        }
        if (
            result.args.some((envName) => this.cmd.getBaseEnvVar(envName, true))
        ) {
            throw this.error(
                new Error(`Environment variable already exists: ${name10}`)
            );
        }
        const details = ArgumentsParser.parseArgumentsDefinition(
            result.typeDefinition
        );
        if (details.length > 1) {
            throw this.error(
                new Error(
                    `An environment variable can only have one value but got: ${name10}`
                )
            );
        } else if (details.length && details[0].optionalValue) {
            throw this.error(
                new Error(
                    `An environment variable can not have an optional value but '${name10}' is defined as optional.`
                )
            );
        } else if (details.length && details[0].variadic) {
            throw this.error(
                new Error(
                    `An environment variable can not have an variadic value but '${name10}' is defined as variadic.`
                )
            );
        }
        this.cmd.envVars.push({
            names: result.args,
            description: description2,
            type: details[0].type,
            details: details.shift(),
            ...options3,
        });
        return this;
    }
    async parse(args7 = Deno.args, dry) {
        this.reset().registerDefaults();
        this.rawArgs = args7;
        const subCommand =
            this.rawArgs.length > 0 && this.getCommand(this.rawArgs[0], true);
        if (subCommand) {
            subCommand._globalParent = this;
            return await subCommand.parse(this.rawArgs.slice(1), dry);
        }
        if (this.isExecutable) {
            if (!dry) {
                await this.executeExecutable(this.rawArgs);
            }
            return {
                options: {},
                args: this.rawArgs,
                cmd: this,
                literal: this.literalArgs,
            };
        } else if (this._useRawArgs) {
            if (dry) {
                return {
                    options: {},
                    args: this.rawArgs,
                    cmd: this,
                    literal: this.literalArgs,
                };
            }
            return await this.execute({}, ...this.rawArgs);
        } else {
            const { flags, unknown, literal } = this.parseFlags(this.rawArgs);
            this.literalArgs = literal;
            const params = this.parseArguments(unknown, flags);
            this.validateEnvVars();
            if (dry) {
                return {
                    options: flags,
                    args: params,
                    cmd: this,
                    literal: this.literalArgs,
                };
            }
            return await this.execute(flags, ...params);
        }
    }
    registerDefaults() {
        if (this.getParent() || this.hasDefaults) {
            return this;
        }
        this.hasDefaults = true;
        this.reset();
        if (this._versionOption !== false) {
            this.option(
                this._versionOption?.flags || "-V, --version",
                this._versionOption?.desc ||
                    "Show the version number for this program.",
                Object.assign(
                    {
                        standalone: true,
                        prepend: true,
                        action: async function () {
                            await Deno.stdout.writeSync(
                                encode(this.getVersion() + "\n")
                            );
                            Deno.exit(0);
                        },
                    },
                    this._versionOption?.opts ?? {}
                )
            );
        }
        if (this._helpOption !== false) {
            this.option(
                this._helpOption?.flags || "-h, --help",
                this._helpOption?.desc || "Show this help.",
                Object.assign(
                    {
                        standalone: true,
                        global: true,
                        prepend: true,
                        action: function () {
                            this.help();
                            Deno.exit(0);
                        },
                    },
                    this._helpOption?.opts ?? {}
                )
            );
        }
        return this;
    }
    async execute(options4, ...args8) {
        const actionOption = this.findActionFlag(options4);
        if (actionOption && actionOption.action) {
            await actionOption.action.call(this, options4, ...args8);
            return {
                options: options4,
                args: args8,
                cmd: this,
                literal: this.literalArgs,
            };
        }
        if (this.fn) {
            try {
                await this.fn(options4, ...args8);
            } catch (e) {
                throw this.error(e);
            }
        } else if (this.defaultCommand) {
            const cmd = this.getCommand(this.defaultCommand, true);
            if (!cmd) {
                throw this.error(
                    new Error(
                        `Default command '${this.defaultCommand}' not found.`
                    )
                );
            }
            cmd._globalParent = this;
            try {
                await cmd.execute(options4, ...args8);
            } catch (e) {
                throw this.error(e);
            }
        }
        return {
            options: options4,
            args: args8,
            cmd: this,
            literal: this.literalArgs,
        };
    }
    async executeExecutable(args9) {
        const [main, ...names] = this.getPath().split(" ");
        names.unshift(main.replace(/\.ts$/, ""));
        const executable = names.join("-");
        try {
            await Deno.run({
                cmd: [executable, ...args9],
            });
            return;
        } catch (e) {
            if (!e.message.match(/No such file or directory/)) {
                throw e;
            }
        }
        try {
            await Deno.run({
                cmd: [executable + ".ts", ...args9],
            });
            return;
        } catch (e1) {
            if (!e1.message.match(/No such file or directory/)) {
                throw e1;
            }
        }
        throw this.error(
            new Error(
                `Sub-command executable not found: ${executable}${dim("(.ts)")}`
            )
        );
    }
    parseFlags(args10) {
        try {
            return parseFlags(args10, {
                stopEarly: this._stopEarly,
                allowEmpty: this._allowEmpty,
                flags: this.getOptions(true),
                parse: (type, option, arg, nextValue) =>
                    this.parseType(type, option, arg, nextValue),
            });
        } catch (e) {
            throw this.error(e);
        }
    }
    parseType(name11, option9, arg6, nextValue) {
        const type = this.getType(name11);
        if (!type) {
            throw this.error(
                new Error(`No type registered with name: ${name11}`)
            );
        }
        return type.handler instanceof Type
            ? type.handler.parse(option9, arg6, nextValue)
            : type.handler(option9, arg6, nextValue);
    }
    validateEnvVars() {
        const envVars = this.getEnvVars(true);
        if (!envVars.length) {
            return;
        }
        if (hasEnvPermissions) {
            envVars.forEach((env) => {
                const name13 = env.names.find((name) => !!Deno.env.get(name));
                if (name13) {
                    const value = Deno.env.get(name13);
                    try {
                        this.parseType(
                            env.type,
                            {
                                name: name13,
                            },
                            env,
                            value || ""
                        );
                    } catch (e) {
                        throw new Error(
                            `Environment variable '${name13}' must be of type ${env.type} but got: ${value}`
                        );
                    }
                }
            });
        }
    }
    parseArguments(args11, flags3) {
        const params = [];
        args11 = args11.slice(0);
        if (!this.hasArguments()) {
            if (args11.length) {
                if (this.hasCommands(true)) {
                    throw this.error(
                        new Error(`Unknown command: ${args11.join(" ")}`)
                    );
                } else {
                    throw this.error(
                        new Error(
                            `No arguments allowed for command: ${this._name}`
                        )
                    );
                }
            }
        } else {
            if (!args11.length) {
                const required = this.getArguments()
                    .filter((expectedArg) => !expectedArg.optionalValue)
                    .map((expectedArg) => expectedArg.name);
                if (required.length) {
                    const flagNames = Object.keys(flags3);
                    const hasStandaloneOption = !!flagNames.find(
                        (name) => this.getOption(name, true)?.standalone
                    );
                    if (!hasStandaloneOption) {
                        throw this.error(
                            new Error(
                                "Missing argument(s): " + required.join(", ")
                            )
                        );
                    }
                }
                return params;
            }
            for (const expectedArg1 of this.getArguments()) {
                if (!expectedArg1.optionalValue && !args11.length) {
                    throw this.error(
                        new Error(`Missing argument: ${expectedArg1.name}`)
                    );
                }
                let arg;
                if (expectedArg1.variadic) {
                    arg = args11.splice(0, args11.length);
                } else {
                    arg = args11.shift();
                }
                if (arg) {
                    params.push(arg);
                }
            }
            if (args11.length) {
                throw this.error(
                    new Error(`To many arguments: ${args11.join(" ")}`)
                );
            }
        }
        return params;
    }
    findActionFlag(flags4) {
        const flagNames = Object.keys(flags4);
        for (const flag of flagNames) {
            const option = this.getOption(flag, true);
            if (option?.action) {
                return option;
            }
        }
        return;
    }
    getName() {
        return this._name;
    }
    getParent() {
        return this._parent;
    }
    getGlobalParent() {
        return this._globalParent;
    }
    getMainCommand() {
        return this._parent?.getMainCommand() ?? this;
    }
    getAliases() {
        return this.aliases;
    }
    getPath() {
        return this._parent
            ? this._parent.getPath() + " " + this._name
            : this._name;
    }
    getArgsDefinition() {
        return this.argsDefinition;
    }
    getArgument(name33) {
        return this.getArguments().find((arg) => arg.name === name33);
    }
    getArguments() {
        if (!this.args.length && this.argsDefinition) {
            this.args = ArgumentsParser.parseArgumentsDefinition(
                this.argsDefinition
            );
        }
        return this.args;
    }
    hasArguments() {
        return !!this.argsDefinition;
    }
    getVersion() {
        return this.ver || (this._parent?.getVersion() ?? "");
    }
    getDescription() {
        return typeof this.desc === "function"
            ? (this.desc = this.desc())
            : this.desc;
    }
    getShortDescription() {
        return this.getDescription().trim().split("\n").shift();
    }
    hasOptions(hidden) {
        return this.getOptions(hidden).length > 0;
    }
    getOptions(hidden1) {
        return this.getGlobalOptions(hidden1).concat(
            this.getBaseOptions(hidden1)
        );
    }
    getBaseOptions(hidden2) {
        if (!this.options.length) {
            return [];
        }
        return hidden2
            ? this.options.slice(0)
            : this.options.filter((opt) => !opt.hidden);
    }
    getGlobalOptions(hidden3) {
        const getOptions = (cmd, options = [], names = []) => {
            if (cmd) {
                if (cmd.options.length) {
                    cmd.options.forEach((option) => {
                        if (
                            option.global &&
                            !this.options.find(
                                (opt) => opt.name === option.name
                            ) &&
                            names.indexOf(option.name) === -1 &&
                            (hidden3 || !option.hidden)
                        ) {
                            names.push(option.name);
                            options.push(option);
                        }
                    });
                }
                return getOptions(cmd._parent, options, names);
            }
            return options;
        };
        return getOptions(this._parent);
    }
    hasOption(name14, hidden4) {
        return !!this.getOption(name14, hidden4);
    }
    getOption(name15, hidden5) {
        return (
            this.getBaseOption(name15, hidden5) ??
            this.getGlobalOption(name15, hidden5)
        );
    }
    getBaseOption(name16, hidden6) {
        const option10 = this.options.find((option) => option.name === name16);
        return option10 && (hidden6 || !option10.hidden) ? option10 : undefined;
    }
    getGlobalOption(name17, hidden7) {
        if (!this._parent) {
            return;
        }
        let option = this._parent.getBaseOption(name17, hidden7);
        if (!option || !option.global) {
            return this._parent.getGlobalOption(name17, hidden7);
        }
        return option;
    }
    removeOption(name18) {
        const index = this.options.findIndex(
            (option) => option.name === name18
        );
        if (index === -1) {
            return;
        }
        return this.options.splice(index, 1)[0];
    }
    hasCommands(hidden8) {
        return this.getCommands(hidden8).length > 0;
    }
    getCommands(hidden9) {
        return this.getGlobalCommands(hidden9).concat(
            this.getBaseCommands(hidden9)
        );
    }
    getBaseCommands(hidden10) {
        const commands = Array.from(this.commands.values());
        return hidden10 ? commands : commands.filter((cmd) => !cmd.isHidden);
    }
    getGlobalCommands(hidden11) {
        const getCommands = (cmd4, commands = [], names = []) => {
            if (cmd4) {
                if (cmd4.commands.size) {
                    cmd4.commands.forEach((cmd) => {
                        if (
                            cmd.isGlobal &&
                            this !== cmd &&
                            !this.commands.has(cmd._name) &&
                            names.indexOf(cmd._name) === -1 &&
                            (hidden11 || !cmd.isHidden)
                        ) {
                            names.push(cmd._name);
                            commands.push(cmd);
                        }
                    });
                }
                return getCommands(cmd4._parent, commands, names);
            }
            return commands;
        };
        return getCommands(this._parent);
    }
    hasCommand(name19, hidden12) {
        return !!this.getCommand(name19, hidden12);
    }
    getCommand(name20, hidden13) {
        return (
            this.getBaseCommand(name20, hidden13) ??
            this.getGlobalCommand(name20, hidden13)
        );
    }
    getBaseCommand(name21, hidden14) {
        let cmd = this.commands.get(name21);
        return cmd && (hidden14 || !cmd.isHidden) ? cmd : undefined;
    }
    getGlobalCommand(name22, hidden15) {
        if (!this._parent) {
            return;
        }
        let cmd = this._parent.getBaseCommand(name22, hidden15);
        if (!cmd?.isGlobal) {
            return this._parent.getGlobalCommand(name22, hidden15);
        }
        return cmd;
    }
    removeCommand(name23) {
        const command = this.getBaseCommand(name23, true);
        if (command) {
            this.commands.delete(name23);
        }
        return command;
    }
    getTypes() {
        return this.getGlobalTypes().concat(this.getBaseTypes());
    }
    getBaseTypes() {
        return Array.from(this.types.values());
    }
    getGlobalTypes() {
        const getTypes = (cmd, types = [], names = []) => {
            if (cmd) {
                if (cmd.types.size) {
                    cmd.types.forEach((type) => {
                        if (
                            type.global &&
                            !this.types.has(type.name) &&
                            names.indexOf(type.name) === -1
                        ) {
                            names.push(type.name);
                            types.push(type);
                        }
                    });
                }
                return getTypes(cmd._parent, types, names);
            }
            return types;
        };
        return getTypes(this._parent);
    }
    getType(name24) {
        return this.getBaseType(name24) ?? this.getGlobalType(name24);
    }
    getBaseType(name25) {
        return this.types.get(name25);
    }
    getGlobalType(name26) {
        if (!this._parent) {
            return;
        }
        let cmd = this._parent.getBaseType(name26);
        if (!cmd?.global) {
            return this._parent.getGlobalType(name26);
        }
        return cmd;
    }
    hasEnvVars(hidden16) {
        return this.getEnvVars(hidden16).length > 0;
    }
    getEnvVars(hidden17) {
        return this.getGlobalEnvVars(hidden17).concat(
            this.getBaseEnvVars(hidden17)
        );
    }
    getBaseEnvVars(hidden18) {
        if (!this.envVars.length) {
            return [];
        }
        return hidden18
            ? this.envVars.slice(0)
            : this.envVars.filter((env) => !env.hidden);
    }
    getGlobalEnvVars(hidden19) {
        const getEnvVars = (cmd, envVars = [], names = []) => {
            if (cmd) {
                if (cmd.envVars.length) {
                    cmd.envVars.forEach((envVar) => {
                        if (
                            envVar.global &&
                            !this.envVars.find(
                                (env) => env.names[0] === envVar.names[0]
                            ) &&
                            names.indexOf(envVar.names[0]) === -1 &&
                            (hidden19 || !envVar.hidden)
                        ) {
                            names.push(envVar.names[0]);
                            envVars.push(envVar);
                        }
                    });
                }
                return getEnvVars(cmd._parent, envVars, names);
            }
            return envVars;
        };
        return getEnvVars(this._parent);
    }
    hasEnvVar(name27, hidden20) {
        return !!this.getEnvVar(name27, hidden20);
    }
    getEnvVar(name28, hidden21) {
        return (
            this.getBaseEnvVar(name28, hidden21) ??
            this.getGlobalEnvVar(name28, hidden21)
        );
    }
    getBaseEnvVar(name29, hidden22) {
        const envVar = this.envVars.find(
            (env) => env.names.indexOf(name29) !== -1
        );
        return envVar && (hidden22 || !envVar.hidden) ? envVar : undefined;
    }
    getGlobalEnvVar(name30, hidden23) {
        if (!this._parent) {
            return;
        }
        let envVar = this._parent.getBaseEnvVar(name30, hidden23);
        if (!envVar?.global) {
            return this._parent.getGlobalEnvVar(name30, hidden23);
        }
        return envVar;
    }
    hasExamples() {
        return this.examples.length > 0;
    }
    getExamples() {
        return this.examples;
    }
    hasExample(name31) {
        return !!this.getExample(name31);
    }
    getExample(name32) {
        return this.examples.find((example) => example.name === name32);
    }
    getRawArgs() {
        return this.rawArgs;
    }
    getLiteralArgs() {
        return this.literalArgs;
    }
    write(...args12) {
        stdout.writeSync(encode(fill(2) + format(...args12)));
    }
    writeError(...args13) {
        stderr.writeSync(
            encode(fill(2) + red(format(`[ERROR:${this._name}]`, ...args13)))
        );
    }
    log(...args14) {
        this.write(...args14, "\n");
    }
    logError(...args15) {
        this.writeError(...args15, "\n");
    }
    error(error, showHelp = true) {
        if (this.shouldThrowErrors()) {
            return error;
        }
        const CLIFFY_DEBUG = hasEnvPermissions
            ? !!Deno.env.get("CLIFFY_DEBUG")
            : false;
        showHelp && this.help();
        this.logError(CLIFFY_DEBUG ? error : error.message);
        this.log();
        Deno.exit(1);
    }
    help() {
        Deno.stdout.writeSync(encode(this.getHelp()));
    }
    getHelp() {
        this.registerDefaults();
        return HelpGenerator.generate(this);
    }
    constructor() {
        this.types = new Map([
            [
                "string",
                {
                    name: "string",
                    handler: new StringType(),
                },
            ],
            [
                "number",
                {
                    name: "number",
                    handler: new NumberType(),
                },
            ],
            [
                "boolean",
                {
                    name: "boolean",
                    handler: new BooleanType(),
                },
            ],
        ]);
        this.rawArgs = [];
        this.literalArgs = [];
        this._name = "COMMAND";
        this.ver = "0.0.0";
        this.desc = "";
        this.options = [];
        this.commands = new Map();
        this.examples = [];
        this.envVars = [];
        this.aliases = [];
        this.completions = new Map();
        this.cmd = this;
        this.isExecutable = false;
        this.throwOnError = false;
        this._allowEmpty = true;
        this._stopEarly = false;
        this._useRawArgs = false;
        this.args = [];
        this.isHidden = false;
        this.isGlobal = false;
        this.hasDefaults = false;
    }
}
function snakeCase(value, locale) {
    return normalCase(value, locale, "_");
}
class ZshCompletionsGenerator {
    static generate(cmd) {
        return new ZshCompletionsGenerator(cmd).generate();
    }
    constructor(cmd5) {
        this.cmd = cmd5;
        this.actions = new Map();
    }
    generate() {
        return `
# compdef _${snakeCase(this.cmd.getPath())} ${this.cmd.getPath()}
#
# zsh completion for ${this.cmd.getPath()}
#
# version: ${this.cmd.getVersion()}
#

autoload -U is-at-least

(( $+functions[__${snakeCase(this.cmd.getName())}_complete] )) ||
function __${snakeCase(this.cmd.getName())}_complete {
    local name="$1"; shift
    local action="$1"; shift
    integer ret=1
    local -a values
    local expl
    _tags "$name"
    while _tags; do
        if _requested "$name"; then
            values=( \$( ${this.cmd.getName()} completions complete $action $@) )
            if (( \${#values[@]} )); then
                while _next_label "$name" expl "$action"; do
                    compadd -S '' "\$expl[@]" $values[@]
                done
            fi
        fi
    done
}

${this.generateCompletions(this.cmd).trim()}

# _${snakeCase(this.cmd.getPath())} "\${@}"

compdef _${snakeCase(this.cmd.getPath())} ${this.cmd.getPath()}

#
# Local Variables:
# mode: Shell-Script
# sh-indentation: 4
# indent-tabs-mode: nil
# sh-basic-offset: 4
# End:
# vim: ft=zsh sw=4 ts=4 et
`.trim();
    }
    generateCompletions(command3, path = "") {
        if (
            !command3.hasCommands(false) &&
            !command3.hasOptions(false) &&
            !command3.hasArguments()
        ) {
            return "";
        }
        path = (path ? path + " " : "") + command3.getName();
        return (
            `(( $+functions[_${snakeCase(path)}] )) ||
function _${snakeCase(path)}() {` +
            (!command3.getParent()
                ? `\n\n    local context state state_descr line\n    typeset -A opt_args`
                : "") +
            this.generateCommandCompletions(command3, path) +
            this.generateSubCommandCompletions(command3, path) +
            this.generateArgumentCompletions(command3, path) +
            this.generateActions(command3) +
            `\n}\n\n` +
            command3
                .getCommands(false)
                .filter((subCommand) => subCommand !== command3)
                .map((subCommand) => this.generateCompletions(subCommand, path))
                .join("")
        );
    }
    generateCommandCompletions(command1, path1) {
        const commands = command1.getCommands(false);
        let completions = commands
            .map(
                (subCommand) =>
                    `'${subCommand.getName()}:${subCommand.getShortDescription()}'`
            )
            .join("\n            ");
        if (completions) {
            completions = `
        local -a commands
        commands=(
            ${completions}
        )
        _describe 'command' commands`;
        }
        if (command1.hasArguments()) {
            const completionsPath = path1.split(" ").slice(1).join(" ");
            const arg = command1.getArguments()[0];
            const action = this.addAction(arg, completionsPath);
            if (action) {
                completions += `\n        __${snakeCase(
                    this.cmd.getName()
                )}_complete ${action.arg.name} ${action.arg.action} ${
                    action.cmd
                }`;
            }
        }
        if (completions) {
            completions = `\n\n    function _commands() {${completions}\n    }`;
        }
        return completions;
    }
    generateSubCommandCompletions(command2, path2) {
        if (command2.hasCommands(false)) {
            const actions = command2
                .getCommands(false)
                .map(
                    (command) =>
                        `${command.getName()}) _${snakeCase(
                            path2 + " " + command.getName()
                        )} ;;`
                )
                .join("\n            ");
            return `\n
    function _command_args() {
        case "$words[1]" in\n            ${actions}\n        esac
    }`;
        }
        return "";
    }
    generateArgumentCompletions(command, path3) {
        this.actions.clear();
        const options = this.generateOptions(command, path3);
        let argIndex = 0;
        let argsCommand = "\n\n    _arguments -w -s -S -C";
        if (command.hasOptions()) {
            argsCommand += ` \\\n        ${options.join(" \\\n        ")}`;
        }
        if (command.hasCommands(false) || command.hasArguments()) {
            argsCommand += ` \\\n        '${++argIndex}: :_commands'`;
        }
        if (command.hasArguments() || command.hasCommands(false)) {
            const args = [];
            for (const arg7 of command.getArguments().slice(1)) {
                const completionsPath = path3.split(" ").slice(1).join(" ");
                const action = this.addAction(arg7, completionsPath);
                args.push(
                    `${++argIndex}${arg7.optionalValue ? "::" : ":"}${
                        action.name
                    }`
                );
            }
            argsCommand += args.map((arg) => `\\\n        '${arg}'`).join("");
            if (command.hasCommands(false)) {
                argsCommand += ` \\\n        '*:: :->command_args'`;
            }
        }
        return argsCommand;
    }
    generateOptions(command4, path4) {
        const options = [];
        const cmdArgs = path4.split(" ");
        cmdArgs.shift();
        const completionsPath = cmdArgs.join(" ");
        const excludedFlags = command4
            .getOptions(false)
            .map((option) =>
                option.standalone ? option.flags.split(/[, ] */g) : false
            )
            .flat()
            .filter((flag) => typeof flag === "string");
        for (const option11 of command4.getOptions(false)) {
            options.push(
                this.generateOption(option11, completionsPath, excludedFlags)
            );
        }
        return options;
    }
    generateOption(option, completionsPath, excludedOptions) {
        let excludedFlags = option.conflicts?.length
            ? [...excludedOptions, ...option.conflicts]
            : excludedOptions;
        excludedFlags = option.collect
            ? excludedFlags
            : [...excludedFlags, ...option.flags.split(/[, ] */g)];
        let args = "";
        for (const arg of option.args) {
            const action = this.addAction(arg, completionsPath);
            if (arg.variadic) {
                args += `${arg.optionalValue ? "::" : ":"}${arg.name}:->${
                    action.name
                }`;
            } else {
                args += `${arg.optionalValue ? "::" : ":"}${arg.name}:->${
                    action.name
                }`;
            }
        }
        const description = option.description.trim().split("\n").shift();
        const collect = option.collect ? "*" : "";
        const flags = option.flags.replace(/ +/g, "");
        if (option.standalone) {
            return `'(- *)'{${collect}${flags}}'[${description}]${args}'`;
        } else {
            const excluded = excludedFlags.length
                ? `'(${excludedFlags.join(" ")})'`
                : "";
            return `${excluded}{${collect}${flags}}'[${description}]${args}'`;
        }
    }
    addAction(arg, cmd6) {
        const action = `${arg.name}-${arg.action}`;
        if (!this.actions.has(action)) {
            this.actions.set(action, {
                arg: arg,
                label: `${arg.name}: ${arg.action}`,
                name: action,
                cmd: cmd6,
            });
        }
        return this.actions.get(action);
    }
    generateActions(command5) {
        let actions = [];
        if (this.actions.size) {
            actions = Array.from(this.actions).map(
                ([name, action]) =>
                    `${name}) __${snakeCase(this.cmd.getName())}_complete ${
                        action.arg.name
                    } ${action.arg.action} ${action.cmd} ;;`
            );
        }
        if (command5.hasCommands(false)) {
            actions.unshift(`command_args) _command_args ;;`);
        }
        if (actions.length) {
            return `\n\n    case "$state" in\n        ${actions.join(
                "\n        "
            )}\n    esac`;
        }
        return "";
    }
}
new Command();
