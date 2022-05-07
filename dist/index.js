"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileFift = exports.compileFunc = exports.executeFift = exports.executeFunc = void 0;
var tmp = __importStar(require("tmp"));
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var os = __importStar(require("os"));
var child = __importStar(require("child_process"));
var which_1 = __importDefault(require("which"));
var arch = os.arch();
function createTempFile(postfix) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        tmp.file({ postfix: postfix }, function (err, name, fd, removeCallback) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve({ name: name, removeCallback: removeCallback });
                            }
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function writeFile(name, content) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        fs.writeFile(name, content, 'utf-8', function (e) {
                            if (e) {
                                reject(e);
                            }
                            else {
                                resolve();
                            }
                        });
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function readFile(name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        fs.readFile(name, 'utf-8', function (e, d) {
                            if (e) {
                                reject(e);
                            }
                            else {
                                resolve(d);
                            }
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function readFileBuffer(name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        fs.readFile(name, function (e, d) {
                            if (e) {
                                reject(e);
                            }
                            else {
                                resolve(d);
                            }
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function executeFunc(args, onlyBundled) {
    var sys;
    if (!onlyBundled) {
        sys = which_1.default.sync('func', { nothrow: true });
    }
    var funcPath = sys || path.resolve(__dirname, '..', 'bin', 'macos', arch === 'arm64' ? 'func-arm64' : 'func');
    child.execSync(funcPath + ' ' + args.join(' '), {
        stdio: 'inherit'
    });
}
exports.executeFunc = executeFunc;
function executeFift(args, onlyBundled) {
    var sys;
    if (!onlyBundled) {
        sys = which_1.default.sync('fift', { nothrow: true });
    }
    var fiftPath = sys || path.resolve(__dirname, '..', 'bin', 'macos', arch === 'arm64' ? 'fift-arm64' : 'fift');
    child.execSync(fiftPath + ' ' + args.join(' '), {
        stdio: 'inherit',
        env: {
            FIFTPATH: path.resolve(__dirname, '..', 'fiftlib')
        }
    });
}
exports.executeFift = executeFift;
function compileFunc(source, onlyBundled) {
    if (onlyBundled === void 0) { onlyBundled = false; }
    return __awaiter(this, void 0, void 0, function () {
        var sourceFile, fiftFile, funcLib, fiftContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createTempFile('.fc')];
                case 1:
                    sourceFile = _a.sent();
                    return [4 /*yield*/, createTempFile('.fif')];
                case 2:
                    fiftFile = _a.sent();
                    funcLib = path.resolve(__dirname, '..', 'funclib', 'stdlib.fc');
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, , 6, 7]);
                    return [4 /*yield*/, writeFile(sourceFile.name, source)];
                case 4:
                    _a.sent();
                    executeFunc(['-PS', '-o', fiftFile.name, funcLib, sourceFile.name], onlyBundled);
                    return [4 /*yield*/, readFile(fiftFile.name)];
                case 5:
                    fiftContent = _a.sent();
                    fiftContent = fiftContent.slice(fiftContent.indexOf('\n') + 1); // Remove first line
                    return [2 /*return*/, fiftContent];
                case 6:
                    sourceFile.removeCallback();
                    fiftFile.removeCallback();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.compileFunc = compileFunc;
function compileFift(source, onlyBundled) {
    if (onlyBundled === void 0) { onlyBundled = false; }
    return __awaiter(this, void 0, void 0, function () {
        var fiftOpFile, cellFile, body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createTempFile('.fif')];
                case 1:
                    fiftOpFile = _a.sent();
                    return [4 /*yield*/, createTempFile('.cell')];
                case 2:
                    cellFile = _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, , 5, 6]);
                    body = '';
                    body += "\"Asm.fif\" include\n";
                    body += source;
                    body += '\n';
                    body += "boc>B \"" + cellFile.name + "\" B>file";
                    fs.writeFileSync(fiftOpFile.name, body, 'utf-8');
                    executeFift([fiftOpFile.name], onlyBundled);
                    return [4 /*yield*/, readFileBuffer(cellFile.name)];
                case 4: return [2 /*return*/, _a.sent()];
                case 5:
                    fiftOpFile.removeCallback();
                    cellFile.removeCallback();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.compileFift = compileFift;
