import React, {useEffect, useState} from "react";
import {getUrl, setStateToUrl, useQueryParams} from "../../hook/useQueryParams";
import {useLocation} from "../../hook/useLocation";
import { Table, Tag, Space, Pagination} from 'antd';
import axios from "axios";
import Contacto from "../../modelos/FuenteUnicaContactos/Contacto";
import openNotification from "../../components/UI/Antd/Notification";

function useListarParametros(history){
    const query = useQueryParams()
    const {page,perPage} = query
    const [data,setData] = useState([]);
    const [total,setTotal] = useState(1);
    const [loading,setLoading] = useState(true);
    useEffect(()=>{
        let cancelar = false;
        setLoading(true);
        axios({
            url: Contacto.URL_DESCARGA,
            params:{
                with:['tipoDocumento'],
                page,
                perPage,
            }
        }).then(({data})=>{
            if(!cancelar){
                setData(data.data.map(d=>new Contacto(d)))
                setTotal(data.total)
            }
        }).catch(error=>{
            if(!cancelar){
                openNotification(error);
            }
        }).finally(()=>setLoading(false))
        return ()=>{
            cancelar = true;
        }
    },[page,perPage])
    const handleChangeGroup = (obj) =>{
        const nuevoPush = { ...query, ...obj}
        history.push({search:setStateToUrl(nuevoPush)})
    }
    return {
        data,
        total,
        perPage,
        page,
        loading,
        handleChangeGroup,
    }
}

export default function Listar({history}) {
    const {data,page,loading,handleChangeGroup, total, perPage} = useListarParametros(history);
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
    ];
    return <>
        <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            loading={loading}
            pagination={{
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
        {/*<Pagination*/}
        {/*    showSizeChanger={true}*/}
        {/*    pageSize={perPage}*/}
        {/*    current={page}*/}
        {/*    onChange={(page,perPage)=>{*/}
        {/*        handleChange(page,'page')*/}
        {/*        handleChange(perPage,'perPage')*/}
        {/*    }}*/}
        {/*    total={total} />*/}
    </>
}