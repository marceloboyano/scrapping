const cheerio = require('cheerio');
const axios = require('axios');

async function main() {
    try {
        let response = await axios.get('https://www.joinsuperhuman.ai/');
        let $ = cheerio.load(response.data);

        $('h2').each(async (index, element) => {
            console.log('Título:', $(element).text());

            let descripcion = $(element).next('p').text();
            console.log('Subtitulo:', descripcion);

            let enlace = 'https://www.joinsuperhuman.ai' + $(element).closest('a').attr('href');
            console.log('Enlace:', enlace);

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
        let noticias = noticias$('div[style="background-color:transparent;border-color:#222222;border-radius:10px;border-style:solid;border-width:1px;margin:4px 4px 4px 4px;padding:4px 4px 4px 4px;"]');

        noticias.each((indiceNoticia, elementoNoticia) => {
            let tituloNoticia = noticias$(elementoNoticia).find('div h2 span b').text().trim();
           

            let subtituloNoticia = noticias$(elementoNoticia).find('div h3 span b').text().trim();

            let descripcionNoticias = [];
            noticias$(elementoNoticia).find('div p span').each((indiceDescripcion, p) => {
                descripcionNoticias.push(noticias$(p).text().trim());
            });

            // Estructura de datos para la noticia
            let noticia = {
                Titulo: tituloNoticia,
                Subtitulo: subtituloNoticia,
                Descripcion: descripcionNoticias,
                Enlace: enlace
            };

            // Imprimir la estructura de datos o realizar otras operaciones según sea necesario
            console.log('Noticia:', noticia);
        });
    } catch (error) {
        console.error('Error al procesar las noticias:', error.message);
    }
}


main();
