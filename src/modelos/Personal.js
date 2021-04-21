import ClaseModel from "./ClaseModel";
import RolAdmin from "./Acceso/RolAdmin";

export default class Personal extends ClaseModel{
    IdPersona
    nombre
    apellidos
    movil
    email
    idDelivery
    IdCargo
    fecha_nacimiento
    ID_CLIENTE
    ID_CTE_DELIV
    fecha_alta
    ID_DIR_CTE_DELIV
    imagen
    roles_admin
    roles_admin_count

    static URL_DESCARGA = `/personal`

    constructor(
        IdPersona = null,
        nombre = '',
        apellidos = '',
        movil = '',
        email = '',
        idDelivery = null,
        IdCargo = null,
        fecha_nacimiento = null,
        ID_CLIENTE = null,
        ID_CTE_DELIV = null,
        fecha_alta = null,
        ID_DIR_CTE_DELIV = null,
        imagen = null,
        roles_admin = [],
        roles_admin_count = 0,
    ) {
        super()
        this.IdPersona = IdPersona
        this.nombre = nombre
        this.apellidos = apellidos
        this.movil = movil
        this.email = email
        this.idDelivery = idDelivery
        this.IdCargo = IdCargo
        this.fecha_nacimiento = fecha_nacimiento
        this.ID_CLIENTE = ID_CLIENTE
        this.ID_CTE_DELIV = ID_CTE_DELIV
        this.fecha_alta = fecha_alta
        this.ID_DIR_CTE_DELIV = ID_DIR_CTE_DELIV
        this.imagen = imagen
        this.roles_admin = roles_admin
        this.roles_admin_count = roles_admin_count?roles_admin_count:0
        this.construirArrays()
    }

    exists(){
        return !!this.IdPersona
    }


    getUrlCarga(){
        return Personal.urlCargaFromId(this.exists()?this.IdProducto:null)
    }

    static urlCargaFromId(id){
        let url = Personal.URL_DESCARGA
        if(id){
            url += `/${id}`
        }
        return url
    }

    static fromSource(e){
        return new Personal(
            e.IdPersona,
            e.nombre,
            e.apellidos,
            e.movil,
            e.email,
            e.idDelivery,
            e.IdCargo,
            e.fecha_nacimiento,
            e.ID_CLIENTE,
            e.ID_CTE_DELIV,
            e.fecha_alta,
            e.ID_DIR_CTE_DELIV,
            e.imagen,
            e.roles_admin,
            e.roles_admin_count,
        )
    }

    construirArrays() {
        this.roles_admin = this.roles_admin?this.roles_admin.map(r=>RolAdmin.fromSource(r)):[]
    }
}