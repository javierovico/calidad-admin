import ClaseModelV2 from "./ClaseModelV2";

/**
 * Es un conjunto de EncuestaRespuesta
 */
export default class Categoria extends ClaseModelV2 {
    static PRIMARY_KEY = 'IdCategoriaProd'
    static URL_DESCARGA = `/categoria`


    static OBJETOS = [
        {key:'IdCategoriaProd', porDefecto: null},
        {key:'IdCategoriaDeliv', porDefecto: null},
        {key:'categoria', porDefecto: ''},
        {key:'subcategoria', porDefecto: null},
        {key:'estado', porDefecto: 1},
        {key:'IdSucursal', porDefecto: null},
        {key:'orden', porDefecto: '0'},
        {key:'GrupoArticulo', porDefecto: ''},
        {key:'linea', porDefecto: ''},
        {key:'productos_count', porDefecto: 0},
        {key:'subcategorias_count', porDefecto: 0},
        {key:'familia', porDefecto: null},
        {key:'codeCategoriaPadre', porDefecto: null},
    ]

    constructor(e) {
        super(e,Categoria.OBJETOS,Categoria.PRIMARY_KEY,Categoria.URL_DESCARGA,true);
    }

    static urlCargaFromId(id){
        return ClaseModelV2.urlCargaFromUrlPrimaryKey(Categoria.URL_DESCARGA,id)
    }

    static fromSource(e){
        return new Categoria(e)
    }

    static fromJedi(jedi,sucursal_id,categoria_id) {
        return new Categoria({
            IdCategoriaProd: null,
            IdCategoriaDeliv: jedi.familia,       //en Jedi, tomamos como codeCategoria el mismo nombre, ya que no tenemos un id,TODO: o si?
            categoria: jedi.familia,
            subcategoria: 0,
            estado: 1,
            IdSucursal: sucursal_id,
            orden: 0,
            GrupoArticulo: jedi.familia,
            linea: jedi.linea,
            productos_count: 0,
            subcategorias_count: 0,
            familia: jedi.familia,
        })
    }

    resolveCodigoCat(){
        return (this.IdCategoriaDeliv && this.IdCategoriaDeliv!=="0")?this.IdCategoriaDeliv:('id_'+this.IdCategoriaProd)
    }
}