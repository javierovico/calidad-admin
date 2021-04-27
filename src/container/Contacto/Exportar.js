import React, {useContext, useEffect, useMemo, useState} from "react";
import { setStateToUrl, useQueryParams} from "../../hook/useQueryParams";
import {Select,Upload, message, Button,Col, Divider, Modal, Row, Table, TreeSelect} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from "axios";
import Contacto from "../../modelos/FuenteUnicaContactos/Contacto";
import openNotification from "../../components/UI/Antd/Notification";
import {AuthContext} from "../../context/AuthProvider";
import TipoDocumento from "../../modelos/FuenteUnicaContactos/TipoDocumento";
import {dateFormateado} from "../../utils/Utils";
const Excel = require('exceljs')


function useListarParametros(history){
    const {analizarError} = useContext(AuthContext)
    const query = useQueryParams()
    const {page,perPage,telefonosPersonaId,listaTipoDoc,documento} = query
    const [data,setData] = useState([]);
    const [total,setTotal] = useState(1);
    const [loading,setLoading] = useState(true);
    const [personaModal,setPersonaModal] = useState(null)
    const [personalLoading,setPersonalLoading] = useState(false);
    useEffect(()=>{
        let cancelar = false;
        if(!telefonosPersonaId){
            setPersonalLoading(false);
            return () => cancelar = true;
        }
        setPersonalLoading(true);
        axios({
            url: Contacto.urlCargaFromId(telefonosPersonaId)
        }).then(({data}) => {
            if(!cancelar){
                setPersonaModal(new Contacto(data.contacto))
            }
        }).catch(e=> {
            if(!cancelar){
                analizarError(e)
                openNotification(e)
            }
        }).finally(()=>setPersonalLoading(false))
        return () => cancelar = true;
    },[telefonosPersonaId])
    /** Zona para hacer un getter de los tipos de cedulas por pais **/
    const [tipoDocs,setTipoDocs] = useState([])
    useState(()=>{
        axios({
            url:TipoDocumento.URL_DESCARGA
        }).then(({data})=>{
            setTipoDocs(data.data.map(d=>new TipoDocumento(d)))
        }).catch(e=>{
            setTipoDocs([])
            analizarError(e)
            openNotification(e)
        })
    },[])

    const tipoDocsArbol = useMemo(()=> tipoDocs
            .filter((td,index,array)=> index === array.findIndex(td2=>td2.codigo_pais === td.codigo_pais) )
            .map(td=>({
                title: td.codigo_pais,
                value: 'PA_'+td.codigo_pais,
                key: 'PA_'+td.codigo_pais,
                children: tipoDocs
                    .filter(td2 => td2.codigo_pais === td.codigo_pais)
                    .map(td2=>({title: td2.codigo,value:'CO_'+td2.codigo,key:'CO_'+td2.codigo}))
            }))
        ,[tipoDocs]
    )
    const handleChangeGroup = (obj) =>{
        const nuevoPush = { ...query, ...obj}
        history.push({search:setStateToUrl(nuevoPush)})
    }
    return {
        tipoDocs,
        tipoDocsArbol,
        data,
        total,
        perPage,
        page,
        loading,
        telefonosPersonaId,
        personalLoading,
        handleChangeGroup,
        personaModal,
        documento,
    }
}

function useExcel(){
    const {analizarError} = useContext(AuthContext)
    const [archivos,setArchivos] = useState([]);
    const [columnaDocumento,setColumnaDocumento] = useState(null);
    const [columnasExcel,setColumnasExcel] = useState([]);
    const [columnasExcelAdicional,setColumnasExcelAdicional] = useState([]);
    const [contenidoExcel,setContenidoExcel] = useState([]);
    const [loading,setLoading] = useState(true);
    const [tipoDoc,setTipoDoc] = useState(null);
    useEffect(()=>{
        setLoading(true);
        setColumnaDocumento(null);
        setColumnasExcel([])
        setContenidoExcel([])
        setColumnasExcelAdicional([])
        if(archivos.length){
            const file = archivos[0]
            /** Este es el encargado de leer a nivel de archivo*/
            const reader = new FileReader()
            /** Se encarga de leer el Excel */
            const wb = new Excel.Workbook();
            reader.readAsArrayBuffer(file)
            reader.onload = () => {
                /** obtiene el buffer del archivo*/
                const buffer = reader.result;
                wb.xlsx.load(buffer).then(workbook => {
                    /** Leemos la primera pagina*/
                    const sheet = workbook.getWorksheet(1)
                    /** Guardamos la fila de la cabecera (la primera fila)*/
                    const cabezera = sheet.getRow(1).values.map((r,pos)=>({key:pos,value:(r.result) ?
                        (r.result) :
                        (
                            (r instanceof Date) ?
                                dateFormateado(r) :
                                r
                        )})).filter(r=>r)
                    console.log(cabezera)
                    /** Iteramos las filas restantes */
                    let contenido = []
                    sheet.eachRow((row,rowIndex) =>{
                        if(rowIndex !== 1){
                            contenido.push(row.values.reduce((acum,r,pos)=>
                                Object.assign(acum, {[pos]:(r.result) ?
                                    (r.result) :
                                    (
                                        (r instanceof Date) ?
                                            dateFormateado(r) :
                                            r
                                    )})
                            ,{_position:rowIndex}))
                            // const nuevo = row.values.filter(r=>r).map((r,pos)=>({
                            //     key:pos,
                            //     value: (r.result) ?
                            //         (r.result) :
                            //         (
                            //             (r instanceof Date) ?
                            //                 dateFormateado(r) :
                            //                 r
                            //         )
                            // }))
                            // nuevo.push({key:'_position', value: rowIndex})
                            // contenido.push(nuevo)
                        }
                    })
                    console.log(contenido);
                    setColumnasExcel(cabezera)
                    setContenidoExcel(contenido)
                    setLoading(false);
                })
            }
        }else{
            setColumnasExcel([])
            setContenidoExcel([])
            setLoading(false);
        }
    },[archivos])

    const [enviandoDoc,setEnviandoDoc] = useState(false);
    const handleSendDoc = () =>{
        setEnviandoDoc(true);
        axios({
            url:Contacto.URL_COGER_MASIVO,
            params:{
                documentos:contenidoExcel.map(ce=>ce[columnaDocumento]),
                tipo_doc_id:tipoDoc
            }
        }).then(({data})=>{
            console.log(data)
            let cantidadTelefono = 0;       //para saber cuantas columnas ir agregandole (maximo 10)
            const nuevoValores = contenidoExcel.map(ce=>{
                const valorBase = data.personas.find(p=>p.doc === (''+ce[columnaDocumento]))
                let n_cliente = ''
                const telefonos = []
                if(valorBase){
                    //Nombre y apellido
                    n_cliente = valorBase.nombre;
                    n_cliente += (n_cliente)?' ':'';
                    n_cliente += valorBase.apellido;
                    cantidadTelefono = Math.min(valorBase.telefonos.length,10)
                    for(let i = 0; i < Math.min(valorBase.telefonos.length,10); i++){
                        telefonos['n_tel_'+i] = valorBase.telefonos[i].telefono
                    }
                }
                return {
                    n_cliente,
                    ...telefonos,
                    ...ce,
                }
            })
            const nuevasColumnas = [{key:'n_cliente',value:'Cliente Encontrado'}]
            for(let i = 0;i<cantidadTelefono;i++){
                nuevasColumnas.push({key:`n_tel_${i}`,value:`Telefono ${i+1}`})
            }
            setContenidoExcel(nuevoValores)
            setColumnasExcelAdicional(nuevasColumnas)
        }).catch(e=>{
            analizarError(e)
            openNotification(e)
        }).finally(()=>setEnviandoDoc(false))
    }

    return {
        archivos,
        setArchivos,
        columnaDocumento,
        setColumnaDocumento,
        columnasExcel,
        columnasExcelAdicional,
        contenidoExcel,
        loading,
        handleSendDoc,
        enviandoDoc,
        tipoDoc,
        setTipoDoc,
    }
}

const columnasTelefono = [
    {
        title: 'Telefono',
        dataIndex: 'telefono',
        key: 'telefono',
    },
    {
        title: 'Origen',
        dataIndex: ['origen','origen'],
        key: 'origen.codigo',
    },
]

export default function Exportar({history}) {
    const {
        handleChangeGroup,
        telefonosPersonaId,
        personaModal,
        personalLoading,
        tipoDocs,
    } = useListarParametros(history);
    const {
        archivos,
        setArchivos,
        columnaDocumento,
        setColumnaDocumento,
        columnasExcel,
        columnasExcelAdicional,
        contenidoExcel,
        loading,
        handleSendDoc,
        enviandoDoc,
        setTipoDoc,
        tipoDoc,
    } = useExcel();

    const columns = columnasExcel.concat(columnasExcelAdicional).map(c=>({
            title: c.value,
            dataIndex: c.key,
            key: c.key,
            // render: item => <p>{item.id}</p>
    }));
    return <>
        <Divider>Entrada</Divider>
        <Row justify="space-around">
            <Col span={5}>
                <Upload
                    onRemove={file=>{
                        setArchivos([])
                    }}
                    beforeUpload={file=>{
                        setArchivos([file])
                        return false;
                    }}
                    fileList={archivos}
                >
                    {archivos.length === 0 && <Button icon={<UploadOutlined/>}>Click to Upload</Button>}
                </Upload>
            </Col>
            <Col span={5}>
                <Select
                    showSearch
                    value={columnaDocumento}
                    onChange={setColumnaDocumento}
                    style={{ width: 200 }}
                    placeholder="Seleccione Columna Doc"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >{
                    columnasExcel.map(c=>
                        <Select.Option key={c.key} value={c.key}>{c.value}</Select.Option>
                    )
                }
                </Select>
            </Col>
            <Col span={5}>
                <Select
                    showSearch
                    value={tipoDoc}
                    onChange={setTipoDoc}
                    style={{ width: 200 }}
                    placeholder="Seleccione Tipo Doc"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >{
                    tipoDocs.map((c,i)=>
                        <Select.Option key={c.id} value={c.id}>{`${c.codigo} (${c.codigo_pais})`}</Select.Option>
                    )
                }
                </Select>
            </Col>
            <Col span={5}>
                <Button disabled={!columnaDocumento || !tipoDoc} onClick={handleSendDoc}>Procesar</Button>
            </Col>
        </Row>
        <Divider>Resultados</Divider>
        <Table
            columns={columns}
            dataSource={contenidoExcel}
            rowKey="_position"
            loading={loading || enviandoDoc}
            pagination={{
                showSizeChanger:true,
            }}
        />

        <Modal
            title={`Telefonos de ${personaModal?.nombre}`}
            centered
            visible={!!telefonosPersonaId}
            onOk={() => handleChangeGroup({telefonosPersonaId:0})}
            onCancel={() => handleChangeGroup({telefonosPersonaId:0})}
        >
            <Table
                columns={columnasTelefono}
                dataSource={personaModal?.telefonos || []}
                rowKey="id"
                loading={personalLoading}
                pagination={{
                    showSizeChanger:true,
                    // total:total
                }}
            />
        </Modal>
    </>
}