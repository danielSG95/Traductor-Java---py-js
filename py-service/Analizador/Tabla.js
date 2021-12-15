const fs = require('fs');
const parse = require('csv-parse/lib/sync')
const path = require('path');


class Tabla{
    constructor(){
        this.data = {};
        this.constuir_tabla();
    }


    constuir_tabla() {
        try {
            var ruta = path.resolve('Analizador/.tabla_analisis.csv');
            var data = fs.readFileSync(ruta);

            const records = parse(data, {
                columns: true,
                skip_empty_lines: true
            })
            this.crear_tabla(records);
        } catch (e) {
            console.log('Leyendo tabla: ' + e);
        }

    }

    crear_tabla(result) {
        var yname;
        var temp_interno = {};

        for(var iterable in result){
            let obj = result[iterable];
            yname = obj["NT"].replace(' ', '');
            delete obj.NT;
            temp_interno = {};
            for(var key in obj){
                if(obj[key] !== ''){
                    if(obj[key] == 'ε') {
                        temp_interno[key] = [];
                    } else {
                        temp_interno[key] = obj[key].split(' ');
                        let t_index = temp_interno[key].indexOf('');
                        if(t_index > -1 ){
                            temp_interno[key].splice(t_index, 1);
                        }
                    }
                }
            }
            this.data[yname] = temp_interno
        }
    }

    buscar_produccion(nt, t) {
        if(nt in this.data){
            let interno = this.data[nt];
            if(t in interno) {
                return interno[t];
            }
        }

        console.log('No se encontro el Nt:' + nt + ' con el terminal: ' + t);
        return undefined;
    }

    obtener_produccion_de(nt){
        if(nt in this.data) {
            let interno = this.data[nt];
            return interno;
        }
        return undefined;
    }
}

module.exports.Tabla = Tabla;
