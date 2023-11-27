"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Airtable = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const decorators_1 = require("./utils/decorators");
dotenv_1.default.config();
class Airtable {
    constructor() {
        this.newsUri = "https://api.airtable.com/v0/app9dJOHfY6Sf36YV/news";
        this.headers = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
            },
        };
    }
    sendNews(news) {
        return __awaiter(this, void 0, void 0, function* () {
            let body = this.createNewsBody(JSON.parse(news));
            let response = yield axios_1.default.post(this.newsUri, body, this.headers);
            // console.log('body before: ', JSON.stringify(body));
            return null;
        });
    }
    createNewsBody(news) {
        return {
            records: news.map(this.noticiaBuild),
        };
    }
    noticiaBuild(noticiaJson) {
        return {
            fields: {
                Titulo: noticiaJson.Titulo,
                Contenido: noticiaJson.Descripcion,
                Link: noticiaJson.Enlaces,
            },
        };
    }
}
exports.Airtable = Airtable;
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], Airtable.prototype, "sendNews", null);
