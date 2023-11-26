const cheerio = require('cheerio');
const axios = require('axios');
const OpenAIAPI = require('openai');
require('dotenv').config();
const openai = new OpenAIAPI({
  api_key: process.env.OPENAI_API_KEY
});

async function main() {
    try {
        let response = await axios.get('https://www.joinsuperhuman.ai/');
        let $ = cheerio.load(response.data);

        $('h2').each(async (index, element) => {
            if(index > 0) return;

            let enlace = 'https://www.joinsuperhuman.ai' + $(element).closest('a').attr('href');

            await procesarNoticia(enlace, $);
        });
    } catch (error) {
        console.error('Error al realizar la solicitud:', error.message);
    }
}

async function procesarNoticia(enlace, $) {
    try {
        let noticiasResponse = await axios.get(enlace);
        let noticiasHtml = noticiasResponse.data;
        let noticias$ = cheerio.load(noticiasHtml);

        // Encuentra todos los elementos que representan noticias
        let noticias = noticias$('div[style*="border-radius:10px;border-style:solid;border-width:1px;"]');

        noticiasJson = [];

        noticias.each((indiceNoticia, elementoNoticia) => {
            let tituloNoticia = noticias$(elementoNoticia).find('div h2 span b').text().trim();

            let subtituloNoticia = noticias$(elementoNoticia).find('div h3 span b').text().trim();

            let descripcionNoticias = [];
            noticias$(elementoNoticia).find('div p span').each((indiceDescripcion, p) => {
                descripcionNoticias.push(noticias$(p).text().trim());
            });

            let enlaces = noticias$(elementoNoticia).find('a').attr('href');

            if(typeof enlaces === 'undefined') {
                enlaces = [];
            }

            if(typeof enlaces === 'string') {
                enlaces = enlaces.replace(/[?&](utm_source|utm_campaign|utm_medium)=[^&]+/g, '');
            }
            
            if(typeof enlaces === 'object') {
                enlaces = enlaces.map(link => {
                    const enlaceLimpio = link.replace(/[?&](utm_source|utm_campaign|utm_medium)=[^&]+/g, '');
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
            
            // Imprimir la estructura de datos o realizar otras operaciones según sea necesario
            // console.log('Noticia:', noticia);
            noticiasJson.push(noticia);
        });

        const config = {
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            }
          };

        let data = {
            temperature: 0.2,
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: 'Analyze the following json news object and give an output json with only the news that makes sense and are human readable'
              },
              { role: 'user', content: JSON.stringify(noticiasJson) }
            ]
        };

        let responseOA = await axios.post('https://api.openai.com/v1/chat/completions', data, config);
        const extractedPicks = responseOA.data.choices[0].message.content;
        console.log(extractedPicks);
    } catch (error) {
        console.error('Error al procesar las noticias:', JSON.stringify(error));
    }
}

main();


