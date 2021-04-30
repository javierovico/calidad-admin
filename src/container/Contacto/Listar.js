import React, {useContext, useEffect, useMemo, useState} from "react";
import { setStateToUrl, useQueryParams} from "../../hook/useQueryParams";
import {Input,Col, Divider, Modal, Row, Table, TreeSelect,DatePicker, Space } from 'antd';
import axios from "axios";
import Contacto from "../../modelos/FuenteUnicaContactos/Contacto";
import openNotification from "../../components/UI/Antd/Notification";
import {AuthContext} from "../../context/AuthProvider";
import TipoDocumento from "../../modelos/FuenteUnicaContactos/TipoDocumento";
import locale from 'antd/es/date-picker/locale/es_ES';
import QueueStat from "../../modelos/Calidad/QueueStat";
import Setup from "../../modelos/Calidad/Setup";

const {Search} = Input;

function useListarParametros(history){
    const {analizarError} = useContext(AuthContext)
    const query = useQueryParams()
    const {page,perPage,telefonosPersonaId,listaQname,documento,rangoFecha} = query
    const [data,setData] = useState([]);
    const [total,setTotal] = useState(1);
    const [loading,setLoading] = useState(true);
    useEffect(()=>{
        let cancelar = false;
        setLoading(true);
        axios({
            url: QueueStat.URL_DESCARGA + '?XDEBUG_SESSION_START=PHPSTORM',
            params:{
                with:['recordings'],
                page,
                perPage,
                listaQname,
                documento,
            }
        }).then(({data})=>{
            if(!cancelar){
                setData(data.data.map(d=>new Contacto(d)))
                setTotal(data.total)
            }
        }).catch(error=>{
            if(!cancelar){
                analizarError(error)
                openNotification(error);
            }
        }).finally(()=>setLoading(false))
        return ()=>{
            cancelar = true;
        }
    },[page,perPage,listaQname,documento,analizarError])
    /** Zona para hacer un getter de los tipos de cedulas por pais **/
    const [tipoDocs,setTipoDocs] = useState([])
    useState(()=>{
        axios({
            url:Setup.URL_DESCARGA
        }).then(({data})=>{
            setTipoDocs(data.data.map(d=>new Setup(d)))
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
        listaQname,
        tipoDocsArbol,
        data,
        total,
        perPage,
        page,
        loading,
        telefonosPersonaId,
        handleChangeGroup,
        documento,
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

export default function Listar({history}) {
    const {
        // tipoDocs,
        tipoDocsArbol,
        data,
        page,
        loading,
        handleChangeGroup,
        total,
        perPage,
        telefonosPersonaId,
        personaModal,
        personalLoading,
        listaQname,
        documento,
    } = useListarParametros(history);

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
        },
        {
            title: 'Apellido',
            dataIndex: 'apellido',
            key: 'apellido',
        },
        {
            title: 'Documento',
            dataIndex: 'doc',
            key: 'doc',
        },
        {
            title: 'Tipo Documento',
            dataIndex: ['tipo_documento','codigo'],
            key: 'tipo_documento.codigo',
        },
        {
            title: 'Pais Origen',
            dataIndex: ['tipo_documento','codigo_pais'],
            key: 'tipo_documento.codigo_pais',
        },
        {
            title: 'Cantidad Telefonos',
            dataIndex: 'telefonos_count',
            key: 'telefonos_count',
        },
        {
            title: 'Accion',
            dataIndex: '',
            key: 'accion',
            render: (persona) => <a href={'?#'} onClick={(e)=>{
                e.preventDefault()
                handleChangeGroup({telefonosPersonaId:persona.id})
            }}>
                Telefonos
            </a>
        },
    ];
    return <>
        <Divider>Filtrado</Divider>
        <Row justify="space-around">
            <Col span={10}>
                <Space direction="vertical" size={12}>
                    <DatePicker.RangePicker locale={locale}/>
                </Space>
            </Col>
            <Col span={10}>
                <Search allowClear defaultValue={documento} placeholder="Documento"  enterButton onSearch={(value)=>{
                    handleChangeGroup({documento:value,page:1})
                }} />
            </Col>
        </Row>
        <Divider>Resultados</Divider>
        <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            loading={loading}
            pagination={{
                showQuickJumper:true,
                showSizeChanger:true,
                pageSize:perPage,
                current:page,
                onChange:(page,perPage)=>{
                    console.log({page,perPage})
                    handleChangeGroup({page,perPage})
                    // handleChange(page,'page')
                    // handleChange(perPage,'perPage')
                },
                total:total}}
        />
    </>
}