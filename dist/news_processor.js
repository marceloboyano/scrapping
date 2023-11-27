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
exports.NewsProcessor = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const openai_api_1 = require("./openai_api");
const decorators_1 = require("./utils/decorators");
class NewsProcessor {
    constructor(uri) {
        this.uri = uri;
        this.newsSelector = 'div[style*="border-radius:10px;border-style:solid;border-width:1px;"]';
        this.titleSelector = 'div h2 span b';
        this.subtituloSelector = 'div h3 span b';
        this.noUtmRegexPattern = /[?&](utm_source|utm_campaign|utm_medium)=[^&]+/g;
    }
    procesarUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield axios_1.default.get(this.uri);
            let $ = cheerio_1.default.load(response.data);
            let noticiaPromises = [];
            $('h2').each((index, element) => __awaiter(this, void 0, void 0, function* () {
                if (index > 0)
                    return;
                let enlace = this.uri + $(element).closest('a').attr('href');
                noticiaPromises.push(this.procesarNoticia(enlace, $));
            }));
            return yield noticiaPromises[0];
        });
    }
    procesarNoticia(enlace, $) {
        return __awaiter(this, void 0, void 0, function* () {
            let noticiasResponse = yield axios_1.default.get(enlace);
            let noticiasHtml = noticiasResponse.data;
            let noticias$ = cheerio_1.default.load(noticiasHtml);
            // Encuentra todos los elementos que representan noticias
            let noticias = noticias$(this.newsSelector);
            let noticiasJson = [];
            noticias.each((_, elementoNoticia) => {
                let tituloNoticia = noticias$(elementoNoticia).find(this.titleSelector).text().trim();
                let subtituloNoticia = noticias$(elementoNoticia).find(this.subtituloSelector).text().trim();
                let descripcionNoticias = [];
                noticias$(elementoNoticia).find('div p span').each((_, p) => {
                    descripcionNoticias.push(noticias$(p).text().trim());
                });
                let enlaces = noticias$(elementoNoticia).find('a').attr('href');
                if (typeof enlaces === 'undefined') {
                    enlaces = '';
                }
                if (typeof enlaces === 'string') {
                    enlaces = enlaces.replace(this.noUtmRegexPattern, '');
                }
                if (typeof enlaces === 'object') {
                    enlaces = enlaces.map((link) => {
                        const enlaceLimpio = link.replace(this.noUtmRegexPattern, '');
                        return enlaceLimpio;
                    });
                }
                ;
                // Estructura de datos para la noticia
                let noticia = {
                    Titulo: tituloNoticia,
                    Subtitulo: subtituloNoticia,
                    Descripcion: descripcionNoticias.join(' '),
                    Enlaces: enlaces
                };
                noticiasJson.push(noticia);
            });
            let openai = new openai_api_1.OpenAI();
            let responseOA = yield openai.extractNews(noticiasJson);
            const extractedPicks = responseOA.data.choices[0].message.content;
            return extractedPicks;
        });
    }
}
exports.NewsProcessor = NewsProcessor;
__decorate([
    decorators_1.TryCatch,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", Promise)
], NewsProcessor.prototype, "procesarNoticia", null);
