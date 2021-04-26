import ClaseModelV2 from "../ClaseModelV2";

export default class TipoDocumento extends ClaseModelV2{

    static PRIMARY_KEY = 'id'
    static URL_DESCARGA = `/tipo-documento`

    constructor(e) {
        super(e, [
            'id',
            'codigo',
            'codigo_pais',
        ],TipoDocumento.PRIMARY_KEY,TipoDocumento.URL_DESCARGA,true);
    }

    static urlCargaFromId(id){
        return ClaseModelV2.urlCargaFromUrlPrimaryKey(TipoDocumento.URL_DESCARGA,id)
    }

    static fromSource(e){
        return new TipoDocumento(e)
    }
}