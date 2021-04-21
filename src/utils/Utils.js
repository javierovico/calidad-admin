import { saveAs } from 'file-saver';
const Excel = require('exceljs');
export function getDescendantProp(obj, desc) {
    const arr = desc.split(".");
    while(arr.length && (obj = obj[arr.shift()]));
    return obj;
}

// export function getDate(){
//     const d = new Date()
//     return d.getFullYear() + "-" + ('0'+(d.getMonth()+1)).substr(-2) + "-" + ('0'+d.getDate()).substr(-2);
// }

export function getTime(){
    const d = new Date()
    return ('0'+d.getHours()).substr(-2) + ":" + ('0'+d.getMinutes()).substr(-2)
}

export function getDatetime() {
    return getDate() + ' ' + getTime()
}

export function segundosFormat(t) {
    let seconds = Math.floor(t % 60);
    let minutes = Math.floor((t / 60) % 60);
    let hours = Math.floor((t / (60 * 60)) % 24);
    return ('0'+hours).substr(-2) + ":" + ('0'+minutes).substr(-2) + ':' + ('0'+seconds).substr(-2)
}

// export function formatPuntos(value) {
//     return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
// }

export function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function addQuery(router,query = {},path = null) {
    let nuevaRuta = {
        path: path?path:router.path.toString(),
        query: query.add?query.add:{}
    }
    for (let key in router.query) {
        let existe = false
        if(query.add){
            for (let key2 in query.add) {
                if(key == key2){
                    existe = true
                }
            }
        }
        if(!existe && (!(query.rem) || query.rem.every(ele=>ele!==key))){
            nuevaRuta.query[key] = router.query[key]
        }
    }
    return nuevaRuta
}


export function rutearV2({query = {},path, remplazar = false}){
    console.error('no se puede rutear con vue')
    // console.log('s')
    // const router = Router.currentRoute
    // /** La nueva ruta toma los parametros originales, como si se tratase de una copia para no tener una excepcion */
    // let nuevaRuta = {
    //     path: path?path:router.path.toString(),
    //     query: JSON.parse(JSON.stringify(router.query))
    // }
    // for(let key in query){
    //     nuevaRuta.query[key] = query[key]
    // }
    // if(remplazar){
    //     Router.replace(nuevaRuta).catch((e)=>{})
    // }else{
    //     Router.push(nuevaRuta).catch((e)=>{})
    // }
}

export function dateFormateado(d){
    d = new Date(d)
    return d.getUTCFullYear() + "-" + ('0'+(d.getUTCMonth()+1)).substr(-2) + "-" + ('0'+d.getUTCDate()).substr(-2) + " " + ('0'+(d.getUTCHours())).substr(-2) + ":" + ('0'+d.getUTCMinutes()).substr(-2);
}

export function horaFormateado(d){
    d = new Date(d)
    return ('0'+(d.getHours())).substr(-2) + ":" + ('0'+d.getMinutes()).substr(-2) + ":" + ('0'+d.getSeconds()).substr(-2);
}

export function horaFormateadoUTC(d){
    d = new Date(d)
    return ('0'+(d.getUTCHours())).substr(-2) + ":" + ('0'+d.getUTCMinutes()).substr(-2);
}

export function intToHour(i) {
    return i<24?(''+((i<10)?('0'+i):(''+i)) + ':00:00'):'23:59:59'
}

export function imprimirError(toastAdmin,error){
    console.error('no se puede rutear con vue')
    throw 'no'
    // toastAdmin.toast(`Error: ${error}`, {
    //     variant: 'danger',
    //     title: 'Delivery',
    //     autoHideDelay: 5000,
    //     appendToast: false
    // })
}

export function vaciar(obj){
    obj.splice(0,obj.length)
}

export const URL_DELIVERY_V2 = 'http://delivery-api.skytellocal.com.py/api/delivery/v2/'

/*
fuente:[{
    title,
    text,
    key:
    obligatorio: [true/false]
    creacion: [true/false]
}]
 */
export function crearArrayPreguntas(target,fuente,unoSolo = false){
    const ret = fuente.filter(c=> (!c.creacion || !target.exists())).map((f,index,arr)=>{
        let ret =  {
            title: f.title,
            text: f.text?f.text:'',
            input: f.input===false?'':(f.input?f.input:'text'), //si es falso: nada, sino text por default
            inputOptions: f.inputOptions?f.inputOptions:[],
            inputPlaceholder: f.inputPlaceholder?f.inputPlaceholder:'',
            inputValue: (target[f.key] || f.input !== 'select')?target[f.key]:-1,//usuarioEdit.usuario,
        }
        if(!f.onConfirm){       //solo se llama si no hay un preConfirm
            f.onConfirm = ()=>{}
        }
        ret.onConfirm = f.onConfirm
        if(f.preConfirm){
            ret.preConfirm = f.preConfirm
        }else{
            ret.preConfirm = input =>{
                target[f.key] = input === '-1' ? 0 : input
                ret.onConfirm(input)
            }
        }
        if(f.focusConfirm){
            ret.focusConfirm = f.focusConfirm
        }
        if(f.html){
            ret.html = f.html
        }
        if(f.inputValidator){
            ret.inputValidator = f.inputValidator
        }else if(f.obligatorio){
            ret.inputValidator = (input) => {
                if(input.length ===0){
                    return "Campo Obligatorio"
                }
            }
        }
        if((index+1) === arr.length && !unoSolo){
            ret.confirmButtonText = 'Guardar'
            ret.confirmButtonColor = '#36aa32'
        }
        return ret
    })
    return unoSolo?ret[0]:ret
}

export function getDate(diasDiferencia = 0){
    const d = new Date()
    d.setDate(d.getDate() + diasDiferencia)
    return d.getFullYear() + "-" + ('0'+(d.getMonth()+1)).substr(-2) + "-" + ('0'+d.getDate()).substr(-2);
}


export function primeraLetraMayuscula(key){
    return key.charAt(0).toUpperCase() + key.slice(1)
}

export function camelCaseToSpace(c) {
    c = c.replace(/_/g,' ')
    c = c.replace(/([A-Z])/g, " $1")
    c = c.replace(/\s+/g,' ')       //deja solo un espacio en blanco
    c = c.split(' ').map(r=> r.charAt(0).toUpperCase() + r.slice(1)).join(' ').trim();
    return c
    // c = c.charAt(0).toUpperCase() + c.slice(1);     //convierte el primero en mayus
}

/**
 *
 * @param titulo el titulo del texto y del nombre
 * @param datos el array de datos a cargar
 * @param conversionCrudo de aca toma la conversion de datos
 * @returns {Promise<unknown>}
 */
export function descargarExcel(titulo, datos, conversionCrudo) {
    return new Promise((resolve,reject)=>{
        const conversion = conversionCrudo.map(c=>{
            if(typeof c === 'string'){
                return {
                    key: c,
                    label: camelCaseToSpace(c),
                }
            }else{
                return {
                    key: c.key,
                    label: c.label?c.label:camelCaseToSpace(c.key),
                    formatter: c.formatter
                }
            }
        })
        const fecha = getDatetime()
        const workbook = new Excel.Workbook();
        workbook.creator = 'Delivery Admin Vue';
        workbook.lastModifiedBy = 'Delivery';
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.lastPrinted = new Date();
        const worksheet = workbook.addWorksheet(titulo);
        worksheet.columns = conversion.map(c=>({
            header:c.label,
            key: c.key
        }))
        worksheet.columns.forEach(column => {
            column.width = column.header.length < 12 ? 12 : column.header.length
        })
        datos.forEach((e,index)=>{
            const row = worksheet.getRow(index+2)
            conversion.forEach(f=>{
                let value = getDescendantProp(e,f.key)
                if(f.formatter){
                    value = f.formatter(value,f.key,e)
                }
                row.getCell(f.key).value = value
            })
        })
        workbook.xlsx.writeBuffer()
            .then(buffer => {
                saveAs(new Blob([buffer]), `${titulo} - ${fecha}.xlsx`)
                resolve()
            })
            .catch(err => {
                console.error('Error writing excel export', err)
                reject(err)
            })
    })
}
function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
//COMPUTED
export function llenarQuery(params){
    let salida = {}
    for(let [key,value] of Object.entries(params)){
        switch(value.type){
            default:
                Object.assign(salida,{['prop'+key.charAt(0).toUpperCase() + key.slice(1)]: function(){
                    const prefijo = this.propPrefijoQuery?(this.propPrefijoQuery+ '_'):''
                    if(!key){
                        key = camelToSnake(key)
                    }
                    const result = this.$route.query[prefijo + key]
                    if(!result){
                        return value.default
                    }else{
                        switch(value.type){
                            case 'number':
                                return parseInt(result)
                            case 'boolean':
                                return (result === '1' || result === 'true')
                            default:
                                if(value.integer){
                                    return parseInt(result)
                                }
                                return result
                        }
                    }
                }})
        }
    }
    return salida
}

//METHODS
export function cambiarQuery(params){
    let salida = {['loadQuery'] : function(){
        for(let [key,value] of Object.entries(params)){
            switch(value.type){
                case 'modal':
                    if(this['prop'+key.charAt(0).toUpperCase() + key.slice(1)]){
                        this.$bvModal.show(value.id?value.id:key)
                    }
                    break;
                default:
                    this[key] = this['prop'+key.charAt(0).toUpperCase() + key.slice(1)]
                    if(value.form){
                        this['form'+key.charAt(0).toUpperCase() + key.slice(1)] = this['prop'+key.charAt(0).toUpperCase() + key.slice(1)]
                    }
                    break;
            }
        }
    }}
    Object.assign(salida,{['commitQuery'] : function(key){
        this['set'+primeraLetraMayuscula(key)](this['form'+primeraLetraMayuscula(key)])
    }})
    for(let [key,value] of Object.entries(params)){
        switch(value.type){
            case 'modal':
                Object.assign(salida,{['cerrar'+key.charAt(0).toUpperCase() + key.slice(1)]: function(){
                    const prefijo = this.propPrefijoQuery?(this.propPrefijoQuery+ '_'):''
                    const queryInsert = prefijo + key
                    this.$router.push(addQuery(this.$route,{rem:[queryInsert]})).catch(()=>{})
                }})
                Object.assign(salida,{['abrir'+key.charAt(0).toUpperCase() + key.slice(1)]: function(id){
                        const prefijo = this.propPrefijoQuery?(this.propPrefijoQuery+ '_'):''
                        const queryInsert = prefijo + key
                        this.$router.push(addQuery(this.$route,{add:{[queryInsert]:id}})).catch(()=>{})
                    }})
                break;
            default:
                Object.assign(salida,{['set'+key.charAt(0).toUpperCase() + key.slice(1)]: function(nuevo){
                    const prefijo = this.propPrefijoQuery?(this.propPrefijoQuery+ '_'):''
                    this[key] = nuevo
                    if(!key){
                        key = camelToSnake(key)
                    }
                    const queryInsert = prefijo + key
                    if(nuevo !== null){
                        this.$router.replace(addQuery(this.$route,{add:{[queryInsert]:nuevo}})).catch(()=>{})
                    }else{
                        this.$router.replace(addQuery(this.$route,{rem:[queryInsert]})).catch(()=>{})
                    }
                }})
        }
    }
    return salida
}
//WATCH
export function crearWatch(params){
    let salida = {}
    for(let [key,value] of Object.entries(params)){
        switch (value.type){
            case 'modal':
                Object.assign(salida,{['prop'+key.charAt(0).toUpperCase() + key.slice(1)]: function(e){
                    if(e){
                        this.$bvModal.show(value.id?value.id:key)
                    }else{
                        this.$bvModal.hide(value.id?value.id:key)
                    }
                }})
                break;
            default:
                Object.assign(salida,{[key]: function(p){
                    this['set'+key.charAt(0).toUpperCase() + key.slice(1)](p)
                }})
        }
    }
    return salida
}

//DATA
export function crearVariables(params){
    let salida = {}
    for(let [key,value] of Object.entries(params)){
        Object.assign(salida,{[key]: value.default})
        if(value.form){
            Object.assign(salida,{['form'+key.charAt(0).toUpperCase() + key.slice(1)]: value.default})
        }
    }
    return salida
}

export function camelToSnake(str){
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}


export function formatPuntos(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

export function parseParams (querystring)  {
    // parse query string
    const params = new URLSearchParams(querystring);
    const obj = {};
    // iterate over all keys
    for (const key of params.keys()) {
        if (params.getAll(key).length > 1) {
            obj[key] = params.getAll(key);
        } else {
            obj[key] = params.get(key);
        }
    }
    return obj;
}

export function setParams(obj){
    const nuevo = {}
    Object.entries(obj).filter(([key,value]) => value).forEach(([key,value])=>
        nuevo[key] = value
    )
    return (new URLSearchParams(nuevo).toString())
}