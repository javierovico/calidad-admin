import ClaseModelV2 from "../ClaseModelV2";
import Origen from "./Origen";

export default class Telefono extends ClaseModelV2{

    static PRIMARY_KEY = 'id'
    static URL_DESCARGA = `/tipo-documento`

    constructor(e) {
        super(e, [
            'id',
            'origen_id',
            'persona_id',
            'telefono',
            {key:'origen', type:Origen},
        ],Telefono.PRIMARY_KEY,Telefono.URL_DESCARGA,true);
    }

    static urlCargaFromId(id){
        return ClaseModelV2.urlCargaFromUrlPrimaryKey(Telefono.URL_DESCARGA,id)
    }

    static fromSource(e){
        return new Telefono(e)
    }
}