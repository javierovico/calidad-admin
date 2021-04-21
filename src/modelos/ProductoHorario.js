import ClaseModel from "./ClaseModel";
import {getDate} from "../utils/Utils";

export default class ProductoHorario extends ClaseModel{
    IdHorario;
    IdProducto;
    dia;
    horaIni;
    horaFin;
    fechaIni;
    fechaFin;
    dias_mes_venta;
    activo;
    //calculados
    tipo;
    //CONSTANTES
    static POR_DIA_SEMANA = 1;
    static TODOS_LOS_DIAS = 3;
    static POR_DIA_MES = 2;
    static DIAS = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado']

    constructor(IdProducto = null, IdHorario = null, dia = 7, horaIni = '00:00:00', horaFin = '23:59:00', fechaIni = getDate(), fechaFin = '2099-12-31', dias_mes_venta = 0, activo = 1) {
        super()
        this.IdHorario = IdHorario;
        this.IdProducto = IdProducto;
        this.dia = dia;
        this.horaIni = horaIni;
        this.horaFin = horaFin;
        this.fechaIni = fechaIni;
        this.fechaFin = fechaFin;
        this.dias_mes_venta = dias_mes_venta;
        this.activo = activo;
        //calcular tipo:
        if(dia!==null && (dia === 7)){
            this.tipo = ProductoHorario.TODOS_LOS_DIAS
        }else if(dia!==null && (0<= dia && dia<7)){
            this.tipo = ProductoHorario.POR_DIA_SEMANA
        }else if(dias_mes_venta !== null && (1 <= dias_mes_venta && dias_mes_venta <=31)){
            this.tipo = ProductoHorario.POR_DIA_MES
        }else{      //default
            this.tipo = ProductoHorario.TODOS_LOS_DIAS
        }
    }

    exists(){
        return !!this.IdHorario
    }

    getUrlCarga(){
        return ProductoHorario.urlCargaFromId(this.exists()?this.IdHorario:null)
    }

    static urlCargaFromId(id){
        let url = '/producto-horario'
        if(id){
            url += `/${id}`
        }
        return url
    }

    static fromSource(e){
        return new ProductoHorario(e.IdProducto, e.IdHorario, e.dia, e.horaIni, e.horaFin, e.fechaIni, e.fechaFin, e.dias_mes_venta, e.activo);
    }

    toStringDia(){
        return ProductoHorario.DIAS[this.dia];
    }

}