require('dotenv').config();

const { inquirerMenu,
    pausa,
    leerInput, 
    listarLugares} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async() => {
    
    const busquedas = new Busquedas();
    let opt = '';


    do {
        // Imprimir el menú
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                //Mostrar mensaje
                const termino = await leerInput('Ciudad: ');

                //Busqueda de las ciudades
                const lugares = await busquedas.ciudad(termino);
                
                //Seleccionar lugar
                const idSelect = await listarLugares(lugares);
                
                //Si es 0, regresa al menú principal
                if( idSelect === '0') continue;
                
                const lugarSelect = lugares.find(l => l.id === idSelect);

                //Guardar en DB
                busquedas.agregarHistorial(lugarSelect.nombre);
                

                //Clima
                const clima = await busquedas.climaLugar(lugarSelect.lat, lugarSelect.lng);

                //Mostrar resultado
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad: ', lugarSelect.nombre);
                console.log('Lat:', lugarSelect.lat);
                console.log('Lng: ', lugarSelect.lng);
                console.log(`Temperatura:  ${clima.temperatura}°C`);
                console.log(`Temperatura Mínima:  ${clima.min}°C`);
                console.log(`Temperatura Máxima:  ${clima.max}°C`);
                console.log(`El clima es:  ${clima.desc}`);
            break;
        
            case 2: //Historial
                busquedas.historialCapitalizado.forEach( (lugar,i) =>{
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                });
            break;
        }
        if (opt !== 0) await pausa();

    } while(opt !== 0);
}

main();