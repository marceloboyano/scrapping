import { Airtable } from "./airtable_api";
import { NewsProcessor } from "./news_processor";
import { TryCatch } from "./utils/decorators";

export class Program {
    constructor(private baseUri: string) {}

    @TryCatch
    async main() {
        let newsProcessor = new NewsProcessor(this.baseUri);
        let noticias = await newsProcessor.procesarUrl();

        let airtable = new Airtable();
        let response = await airtable.sendNews(noticias);

        console.log(response);
    }
}
