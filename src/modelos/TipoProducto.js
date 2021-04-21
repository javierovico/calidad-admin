import ClaseModelV2 from "./ClaseModelV2";

export default class TipoProducto extends ClaseModelV2 {
    static PRIMARY_KEY = 'IdtipoProducto'
    static URL_DESCARGA = `/tipo-producto`
    static TIPO_SIMPLE = 1;
    static TIPO_COMPUESTO = 3;
    static TIPO_SABOR = 4;
    static TIPO_PROMOCION = 6
    static TIPO_DELIVERY = 7
    static TIPO_PROMOCION_CONDICIONAL = 9


    static OBJETOS = [
        'IdtipoProducto',
        'tipoProducto',
        'descripcion',
    ]
    static EQUIVALENCIA = {
        'Simple' : 1,
        'Options' : 2,
        'Compuesto' : 3,
        'Simple Sabor' : 4,
        'Acuerdo de Descuento' : 5,
        'Promociones' : 6,
        'Costo de Delivery' : 7,
        'Acuerdo de Descuento Valor' : 8,
        'Promo Condicionales' : 9,
    };

    constructor(e) {
        super(e,TipoProducto.OBJETOS,TipoProducto.PRIMARY_KEY,TipoProducto.URL_DESCARGA,true);
    }

    /**
     * comprueba si ese id producto debe ser mostrado como un producto vendible
     * @param id
     * @returns {boolean}
     */
    static isProductoPlataforma(id){
        return !([this.TIPO_SABOR, this.TIPO_DELIVERY,this.TIPO_PROMOCION_CONDICIONAL].find(t=>t===id))
    }


    static urlCargaFromId(id){
        return ClaseModelV2.urlCargaFromUrlPrimaryKey(TipoProducto.URL_DESCARGA,id)
    }

    static fromSource(e){
        return new TipoProducto(e)
    }


}