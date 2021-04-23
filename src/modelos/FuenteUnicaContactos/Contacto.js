import ClaseModelV2 from "../ClaseModelV2";

export default class Contacto extends ClaseModelV2{

    static PRIMARY_KEY = 'id'
    static URL_DESCARGA = `/contacto`

    constructor(e) {
        super(e, [
            'id',
            'tipo_doc_id',
            'doc',
            'nombre',
            'apellido',
        ],Contacto.PRIMARY_KEY,Contacto.URL_DESCARGA,true);
    }

    static urlCargaFromId(id){
        return ClaseModelV2.urlCargaFromUrlPrimaryKey(Contacto.URL_DESCARGA,id)
    }

    static fromSource(e){
        return new Contacto(e)
    }
}