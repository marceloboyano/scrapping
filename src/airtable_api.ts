import dotenv from "dotenv";
import axios from "axios";
import { TryCatch } from "./utils/decorators";

dotenv.config();

export class Airtable {
    private newsUri = "https://api.airtable.com/v0/app9dJOHfY6Sf36YV/news";
    private headers = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        },
    };

    constructor() {}

    @TryCatch
    async sendNews(news: string): Promise<any> {
        let body = this.createNewsBody(JSON.parse(news));

        let response = await axios.post(this.newsUri, body, this.headers);
        
        // console.log('body before: ', JSON.stringify(body));
        
        return null;
    }

    private createNewsBody(news: any) {
        return {
            records: news.map(this.noticiaBuild),
        };
    }
    noticiaBuild(noticiaJson: any) {
        return {
            fields: {
                Titulo: noticiaJson.Titulo,
                Contenido: noticiaJson.Descripcion,
                Link: noticiaJson.Enlaces,
            },
        };
    }
}
