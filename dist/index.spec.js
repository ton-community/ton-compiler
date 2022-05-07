"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
var testContract = "\n;; Simple wallet smart contract\n\n() recv_internal(slice in_msg) impure {\n  ;; do nothing for internal messages\n}\n\n() recv_external(slice in_msg) impure {\n  var signature = in_msg~load_bits(512);\n  var cs = in_msg;\n  int msg_seqno = cs~load_uint(32);\n  var cs2 = begin_parse(get_data());\n  var stored_seqno = cs2~load_uint(32);\n  var public_key = cs2~load_uint(256);\n  cs2.end_parse();\n  throw_unless(33, msg_seqno == stored_seqno);\n  throw_unless(34, check_signature(slice_hash(in_msg), signature, public_key));\n  accept_message();\n  cs~touch();\n  if (cs.slice_refs()) {\n    var mode = cs~load_uint(8);\n    send_raw_message(cs~load_ref(), mode);\n  }\n  cs.end_parse();\n  set_data(begin_cell().store_uint(stored_seqno + 1, 32).store_uint(public_key, 256).end_cell());\n}\n";
describe('ton-compiler', function () {
    it('should compile source', function () { return __awaiter(void 0, void 0, void 0, function () {
        var compiled, cell;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, _1.compileFunc)(testContract)];
                case 1:
                    compiled = _a.sent();
                    expect(compiled).toMatchSnapshot();
                    return [4 /*yield*/, (0, _1.compileFift)(compiled)];
                case 2:
                    cell = _a.sent();
                    expect(cell.toString('hex')).toEqual('b5ee9c7201010401004f000114ff00f4a413f4bcf2c80b0102012002030004d230006ef28308d71820d31fed44d0d31fd3ffd15131baf2a103f901541042f910f2a2f8005120d74a96d307d402fb00ded1a4c8cb1fcbffc9ed54');
                    return [2 /*return*/];
            }
        });
    }); });
});
