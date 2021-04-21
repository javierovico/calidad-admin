import ClaseModelV2 from './ClaseModelV2';
import Empresa from "./Empresa";
import Formula from "./Formula";
import PermisoApi from "./Acceso/Permiso";
import ProductoTipoCupon from "./ProductoTipoCupon";
import RolApi from "./Acceso/RolApi";
import Rol from "./Acceso/Rol";
import Sucursal from "./Sucursal";
import TipoProducto from "./TipoProducto";

export default class DatosUser extends ClaseModelV2 {
    static URL_DESCARGA = `/rol/user-roles`;

    constructor(e, aceptaExtra = false) {
        super(e, [
            {key:'empresas', array: true, type: Empresa},
            {key:'formulas', array: true, type: Formula},
            {key:'permisos_generales', array: true, type: PermisoApi},
            {key:'producto_tipo_cupon', array: true, type: ProductoTipoCupon},
            {key:'roles', array: true, type: RolApi},
            {key:'roles_delivery', array: true, type: Rol},
            {key:'roles_generales', array: true, type: RolApi},
            {key:'sucursales', array: true, type: Sucursal},
            {key:'tipo_productos', array: true, type: TipoProducto},
        ], 'IdPersona', DatosUser.URL_DESCARGA, aceptaExtra);
    }

    static fromSource(e) {
        return new DatosUser(e);
    }
}
