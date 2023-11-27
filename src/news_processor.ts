import axios from "axios";
import cheerio from 'cheerio';
import { OpenAI } from "./openai_api";
import { TryCatch } from "./utils/decorators";

export class NewsProcessor {
    newsSelector = 'div[style*="border-radius:10px;border-style:solid;border-width:1px;"]';
    titleSelector = 'div h2 span b';
    subtituloSelector = 'div h3 span b';
    noUtmRegexPattern = /[?&](utm_source|utm_campaign|utm_medium)=[^&]+/g;


    constructor(private uri: string) {}

    async procesarUrl(): Promise<string> {
        let response = await axios.get(this.uri);
        let $ = cheerio.load(response.data);
        let noticiaPromises: Promise<any>[] = [];

        $('h2').each(async (index, element) => {
            if(index > 0) return;

            let enlace = this.uri + $(element).closest('a').attr('href');

            noticiaPromises.push(this.procesarNoticia(enlace, $));
        });

        return await noticiaPromises[0];
    }

    @TryCatch
    private async procesarNoticia(enlace: string, $: cheerio.Root): Promise<any> {   
        let noticiasResponse = await axios.get(enlace);
        let noticiasHtml = noticiasResponse.data;
        let noticias$ = cheerio.load(noticiasHtml);

        // Encuentra todos los elementos que representan noticias
        let noticias = noticias$(this.newsSelector);

        let noticiasJson : any[] = [];

        noticias.each((_, elementoNoticia) => {
            let tituloNoticia = noticias$(elementoNoticia).find(this.titleSelector).text().trim();

            let subtituloNoticia = noticias$(elementoNoticia).find(this.subtituloSelector).text().trim();

            let descripcionNoticias : any[] = [];
            noticias$(elementoNoticia).find('div p span').each((_, p) => {
                descripcionNoticias.push(noticias$(p).text().trim());
            });

            let enlaces: any = noticias$(elementoNoticia).find('a').attr('href');

            if(typeof enlaces === 'undefined') {
                enlaces = '';
            }

            if(typeof enlaces === 'string') {
                enlaces = enlaces.replace(this.noUtmRegexPattern, '');
            }
            
            if(typeof enlaces === 'object') {
                enlaces = enlaces.map((link: any) => {
                    const enlaceLimpio = link.replace(this.noUtmRegexPattern, '');
                    return enlaceLimpio;
                })
            };

            // Estructura de datos para la noticia
            let noticia = {
                Titulo: tituloNoticia,
                Subtitulo: subtituloNoticia,
                Descripcion: descripcionNoticias.join(' '),
                Enlaces: enlaces
            };
            
            noticiasJson.push(noticia);
        });
        
        let openai = new OpenAI();

        let responseOA = await openai.extractNews(noticiasJson);
        const extractedPicks = responseOA.data.choices[0].message.content;
        return extractedPicks;
    }
}