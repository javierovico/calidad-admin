import ClaseModel from "./ClaseModel";

export default class ProductoTipoCupon extends ClaseModel{
    IdTipoCupon
    des_cupon
    activo

    static URL_DESCARGA = `/producto-tipo-cupon`
    static TIPO_LISTA_INPUT = 2;
    static TIPO_LISTA_CHECK = 1;


    constructor(
        IdTipoCupon = null,
        des_cupon = null,
        activo = null,
    ) {
        super()
        this.IdTipoCupon = IdTipoCupon
        this.des_cupon = des_cupon
        this.activo = activo
    }

    exists(){
        return this.IdTipoCupon
    }

    getUrlCarga(){
        return ProductoTipoCupon.urlCargaFromId(this.exists()?this.IdTipoCupon:null)
    }

    static urlCargaFromId(id){
        let url = ProductoTipoCupon.URL_DESCARGA
        if(id){
            url += `/${id}`
        }
        return url
    }

    static fromSource(e){
        return new ProductoTipoCupon(
            e.IdTipoCupon,
            e.des_cupon,
            e.activo,
        )
    }

}