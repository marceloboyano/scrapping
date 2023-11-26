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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let body = {
                records: [
                    {
                        fields: {
                            Contenido: "test content api from script",
                            Link: "testlink.com",
                            Titulo: "test api from script"
                        }
                    }
                ]
            };
            let headers = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
                }
            };
            let response = yield axios_1.default.post('https://api.airtable.com/v0/app9dJOHfY6Sf36YV/news', body, headers);
            console.log(response);
        }
        catch (error) {
            console.error('Error al realizar la solicitud:', console.log(JSON.stringify(error)));
        }
    });
}
main();
