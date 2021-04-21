import ClaseModel from "./ClaseModel";

export default class Formula extends ClaseModel{
    IdFormula
    calculo
    descripcion
    idDelivery

    static URL_DESCARGA = `/no`
    static SIN_FORMULA = 1;


    constructor(
        IdFormula = null,
        calculo = null,
        descripcion = null,
        idDelivery = null,
    ) {
        super()
        this.IdFormula=IdFormula
        this.calculo=calculo
        this.descripcion=descripcion
        this.idDelivery=idDelivery
    }

    exists(){
        return this.IdFormula
    }

    getUrlCarga(){
        let url = `/no`
        if(this.exists()){
            url += `/${this.IdtipoProducto}`
        }
        return url
    }

    static fromSource(e){
        return new Formula(
            e.IdFormula,
            e.calculo,
            e.descripcion,
            e.idDelivery,
        )
    }

}