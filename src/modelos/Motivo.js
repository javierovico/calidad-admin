import ClaseModel from "./ClaseModel";
import Permiso from "./Acceso/Permiso";
import SubMotivo from "./SubMotivo";

export default class Motivo extends ClaseModel{
    estado
    id
    id_cliente_delivery
    id_sucursal
    motivo
    //relaciones
    subMotivos
    //constantes
    static MOTIVO_CONSULTA = 2

    constructor(
        estado = Motivo.MOTIVO_CONSULTA,
        id = null,
        id_cliente_delivery = null,
        id_sucursal = 0,
        motivo = '',
        subMotivos = [],
    ) {
        super();
        this.estado = estado
        this.id = id
        this.id_cliente_delivery = id_cliente_delivery
        this.id_sucursal = id_sucursal
        this.motivo = motivo
        this.subMotivos = subMotivos
        this.construirArrays()
    }


    construirArrays() {
        this.subMotivos = this.subMotivos?this.subMotivos.map(r=>SubMotivo.fromSource(r)):[]
    }

    dataToggleEstado(){
        return {
            estado: this.estado?0:Motivo.MOTIVO_CONSULTA
        }
    }

    toggleEstado(){
        this.estado = this.dataToggleEstado().estado
    }

    exists() {
        return this.id && this.id>0
    }

    getUrlCarga(){
        let url = `delivery/${this.id_cliente_delivery}/motivo`
        if(this.exists()){
            url += `/${this.id}`
        }
        return url
    }



    static fromSource(e){
        return new Motivo(
            e.estado,
            e.id,
            e.id_cliente_delivery,
            e.id_sucursal,
            e.motivo,
            e.submotivos?(e.submotivos):(e.subMotivos?e.subMotivos:[])
        )
    }
}