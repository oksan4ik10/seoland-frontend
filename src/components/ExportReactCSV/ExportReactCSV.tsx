

import * as XLSX from 'xlsx';
import { IDataAnalyticsAPI } from '../../models/type'
import { saveAs } from 'file-saver';
import urlIcon from "../../assets/images/excel.png"
import style from "./ExportReactCSV.module.css"


interface IProps {
    csvData: IDataAnalyticsAPI[];
    fileName: string

}


export const ExportReactCSV = (props: IProps) => {
    const { csvData, fileName } = props;
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToCSV = (csvData: IDataAnalyticsAPI[], fileName: string) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        saveAs(data, fileName + fileExtension);
    }

    return (
        <button className={style.btn} onClick={() => exportToCSV(csvData, fileName)}>
            <img src={urlIcon} alt="export Excel" />
        </button>
    )
}