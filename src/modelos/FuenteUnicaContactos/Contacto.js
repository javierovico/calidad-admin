import ClaseModelV2 from "../ClaseModelV2";
import TipoDocumento from "./TipoDocumento";
import Telefono from "./Telefono";

export default class Contacto extends ClaseModelV2{

    static PRIMARY_KEY = 'id'
    static URL_DESCARGA = `/contacto`
    static URL_COGER_MASIVO = Contacto.URL_DESCARGA + '/coger-masivo';

    constructor(e) {
        super(e, [
            'id',
            'tipo_doc_id',
            'doc',
            'nombre',
            'apellido',
            {key:'tipo_documento',type:TipoDocumento},
            {key:'telefonos_count', porDefecto:0},
            {key:'telefonos', array: true, type: Telefono},
        ],Contacto.PRIMARY_KEY,Contacto.URL_DESCARGA,true);
    }

    static urlCargaFromId(id){
        return ClaseModelV2.urlCargaFromUrlPrimaryKey(Contacto.URL_DESCARGA,id)
    }

    static fromSource(e){
        return new Contacto(e)
    }
}