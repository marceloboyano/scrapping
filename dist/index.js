"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const program_1 = require("./program");
dotenv_1.default.config();
let baseUri = "https://www.joinsuperhuman.ai";
new program_1.Program(baseUri).main();
