import ClaseModelV2 from "./ClaseModelV2";
import Horario from "./Horario";
import {horaFormateado} from "../utils/Utils";

/**
 * Es un conjunto de EncuestaRespuesta
 */
export default class Sucursal extends ClaseModelV2 {
    static PRIMARY_KEY = 'IdSucursal'
    static URL_DESCARGA = `/sucursal`


    static OBJETOS = [
        'IdSucursal',
        'idDelivery',
        'sucursal',
        'idTipoSucursal',
        'id_suc_cte_deliv',
        'noti',
        'noti1',
        'noti_nosync_sms',
        'calle',
        'numero',
        'entre_calle1',
        'entre_calle2',
        'barrio',
        'localidad',
        'ciudad',
        'latitud',
        'longitud',
        'telefono1',
        'telefono2',
        'costo_delivery',
        'prom_delivery',
        'monto_minimo',
        'responsable',
        'estado',
        'subzona_critica',
        'cad_sync',
        'observaciones',
        'horario_ini',
        'horario_fin',
        'horario_ini_fs',
        'horario_fin_fs',
        'suc_not_out_horario',
        'suc_deriva',
        'IP_suc',
        'dir_default',
        'ticket_copia',
        'prom_carryout',
        'id_pais',
        'tiempo_tolerancia',
        'lst_precio',
        'cantidad_items',
        'estado_alerta',
        'created_at',
        'updated_at',
        'id',
        'label',
        {key:'horarios', array:true, type: Horario}
    ]

    constructor(e) {
        super(e,Sucursal.OBJETOS,Sucursal.PRIMARY_KEY,Sucursal.URL_DESCARGA,true);
    }

    static urlCargaFromId(id){
        return ClaseModelV2.urlCargaFromUrlPrimaryKey(Sucursal.URL_DESCARGA,id)
    }

    static fromSource(e){
        return new Sucursal(e)
    }

    calcularEstadoHorario(){
        const fecha = new Date()
        const diaSemana = fecha.getDay()
        const horario = this.horarios.find(h=> h.dia_sem === diaSemana)
        const horaActual = horaFormateado(fecha)
        if(horario){
            if(horario.horaArray.some(a=> a.ini <= horaActual && horaActual <= a.fin )){
                return 'Abierto Ahora'
            }else{
                let proximaHora = null
                horario.horaArray.forEach(a=> {
                    if( horaActual < a.ini && ( !proximaHora || a.ini < proximaHora)){
                        proximaHora = a.ini
                    }
                })
                if(proximaHora){
                    return 'Abre a las ' + proximaHora
                }else{
                    return 'Cerrado por hoy'
                }
            }
        }else{
            return '[No Definido]'
        }
    }

}