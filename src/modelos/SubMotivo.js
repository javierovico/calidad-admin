import ClaseModel from "./ClaseModel";
import Motivo from "./Motivo";

export default class SubMotivo extends ClaseModel{

    accion
    estado
    id
    id_motivo
    submotivo

    constructor(
        accion = '',
        estado = Motivo.MOTIVO_CONSULTA,
        id = null,
        id_motivo = null,
        submotivo = '',
    ) {
        super();
        this.accion = accion
        this.estado = estado
        this.id = id
        this.id_motivo = id_motivo
        this.submotivo = submotivo
    }

    exists() {
        return this.id && this.id>0
    }


    toggleEstado(){
        this.estado = this.estado?0:Motivo.MOTIVO_CONSULTA
    }

    getUrlCarga(cliente_id){
        let url = `/submotivo`
        if(this.exists()){
            url += `/${this.id}`
        }
        return url
    }


    static fromSource(e){
        return new SubMotivo(
            e.accion,
            e.estado,
            e.id,
            e.id_motivo,
            e.submotivo,
        )
    }
}