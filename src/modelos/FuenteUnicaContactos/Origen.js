import ClaseModelV2 from "../ClaseModelV2";

export default class Origen extends ClaseModelV2{

    static PRIMARY_KEY = 'id'
    static URL_DESCARGA = `/origen`

    constructor(e) {
        super(e, [
            'id',
            'origen',
            'codigo',
            'origen_id',
        ],Origen.PRIMARY_KEY,Origen.URL_DESCARGA,true);
    }

    static urlCargaFromId(id){
        return ClaseModelV2.urlCargaFromUrlPrimaryKey(Origen.URL_DESCARGA,id)
    }

    static fromSource(e){
        return new Origen(e)
    }
}