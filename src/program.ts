import { NewsProcessor } from "./news_processor";
import { TryCatchDecorator } from "./utils/decorators";

export class Program {
    constructor(private baseUri: string) {}

    @TryCatchDecorator
    async main() {
        let newsProcessor = new NewsProcessor(this.baseUri);
        await newsProcessor.procesarUrl(this.baseUri);
    }
}
