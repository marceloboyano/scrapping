const cheerio = require('cheerio');
const  axios = require ('axios'); 

async function main() {
    try {
        let response = await axios.get('https://www.joinsuperhuman.ai/');
        
        let $ = cheerio.load(response.data);
       
        // Encuentra todos los elementos h2 dentro del documento HTML
        $('h2').each((index, element) => {

            // Imprime el texto de cada elemento h2
           console.log('titulo:', $(element).text());

              // Encuentra el primer párrafo (p) dentro del elemento h2 y obtiene su texto
              let descripcion = $(element).next('p').text();
              console.log('Descripcion:', descripcion);

            // Encuentra el enlace (href) asociado a cada elemento h2
            let enlace = $(element).closest('a').attr('href');
            console.log('Enlace:', enlace);
        });
    } catch (error) {
        console.error('Error al realizar la solicitud:', error.message);
    }
}



main()



