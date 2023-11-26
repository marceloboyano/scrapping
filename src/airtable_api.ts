import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

async function main() {
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

        let response = await axios.post('https://api.airtable.com/v0/app9dJOHfY6Sf36YV/news', body, headers);

        console.log(response);
    } catch (error) {
        console.error('Error al realizar la solicitud:', console.log(JSON.stringify(error)));
    }
}

main();
