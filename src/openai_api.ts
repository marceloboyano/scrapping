import axios from "axios";

export class OpenAI {
  private completionsUri = "https://api.openai.com/v1/chat/completions";
  private config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
  };
  constructor() {}
  async extractNews(noticiasJson: any): Promise<any> {
    let data = {
      temperature: 0.2,
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Analyze the following json news object and give an output json with only the news that makes sense and are human readable",
        },
        { role: "user", content: JSON.stringify(noticiasJson) },
      ],
    };

    return await axios.post(this.completionsUri, data, this.config);
  }
}
