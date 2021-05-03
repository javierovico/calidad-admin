import React from 'react';
import {getDatetime} from "./Utils";
import { saveAs } from 'file-saver';
const Excel = require('exceljs')

export default function exportExcel(titulo, datos, conversion){
    return new Promise((resolve,reject)=>{
        const fecha = getDatetime()
        const workbook = new Excel.Workbook();
        workbook.creator = 'Fuente Unica Contactos';
        workbook.lastModifiedBy = 'FuUnCo';
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.lastPrinted = new Date();
        const worksheet = workbook.addWorksheet(titulo);
        worksheet.columns = conversion.map(c=>({
            header:resolverContenidoJSX(c.title),
            key: c.key
        }))
        worksheet.columns.forEach(column => {
            column.width = column.header.length < 12 ? 12 : column.header.length
        })
        datos.forEach((e,index)=>{
            const row = worksheet.getRow(index+2)
            conversion.forEach(f=>{
                let value
                if(f.render){
                    value = resolverContenidoJSX(f.render(getDescendantPropArray(e,f.dataIndex),e))
                }else if(f.dataIndex){
                    value = getDescendantPropArray(e,f.dataIndex)
                }
                row.getCell(f.key).value = value
            })
        })
        workbook.xlsx.writeBuffer()
            .then(buffer => {
                saveAs(new Blob([buffer]), `${titulo} - ${fecha}.xlsx`)
                resolve()
            })
            .catch(err => {
                console.log('Error writing excel export', err)
                reject(err)
            })
    })
}

function resolverContenidoJSX(obj){
    if(React.isValidElement(obj)){
        return resolverContenidoJSX(obj.props.children)
    }else{
        return obj
    }
}

function getDescendantPropArray(obj, arrIntacto) {
    let arr = [...arrIntacto]
    if(!Array.isArray(arr)){
        arr = [arr]
    }
    while(arr.length && (obj = obj[arr.shift()]));
    return obj;
}
