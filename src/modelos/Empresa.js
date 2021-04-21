import ClaseModelV2 from "./ClaseModelV2";

export default class Empresa extends ClaseModelV2 {
    static PRIMARY_KEY = 'idDelivery'
    static URL_DESCARGA = `/delivery`

    constructor(e) {
        super(e, [
                'idDelivery',
                'telDelivery',
                'telDeliveryAlt',
                'clienteDeliv',
                'obsDeliv',
                'idCallejero',
                'calle',
                'numero',
                'entreCalle_1',
                'entreCalle_2',
                'email',
                'fechaAlta',
                'logo',
                'logoDriver',
                'estado',
                'urlClienteDel',
                'geotrack',
                'TlimiteCambios',
                'Codauto',
                'promesaT',
                'IdSync',
                'IdTipoClienteDeliv',
                'IdcategoriaDeliv',
                'codigoPais',
                'speech',
                'ticket_copia',
                'documento',
                'cod_comercio',
                'authorization',
                'callejero',
                'noti_noSync',
                'telDeliveryAlt2',
                'clienteNoFact',
                'jedy_conection_id',
                'created_at',
                'sucursales_activas',
                {key:'jedy_conection'},
            ],Empresa.PRIMARY_KEY,Empresa.URL_DESCARGA,true);
    }

    static urlCargaFromId(id){
        return ClaseModelV2.urlCargaFromUrlPrimaryKey(Empresa.URL_DESCARGA,id)
    }

    static fromSource(e){
        return new Empresa(e)
    }

}