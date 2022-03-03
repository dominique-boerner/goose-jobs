import fs from "fs";
import {createObjectCsvWriter as createCsvWriter} from "csv-writer";

export default class CsvController {
    static path = "./output";

    static generateCSV(jobs, filename) {
        console.log(`Es wurden ${jobs.length} aktuelle Ausbildungen bei Azubi.de gefunden.`);
        console.log(`Lade Jobs herunter, bitte warten...`);

        // create a new file
        fs.openSync(`${this.path}/${filename}.csv`, 'w')

        const csvWriter = createCsvWriter({
            path: `${this.path}/${filename}.csv`,
            fieldDelimiter: ";",
            header: [
                {id: 'company', title: 'Unternehmen'},
                {id: 'name', title: 'Stellenbezeichnung'},
                {id: 'link', title: 'Link zur Stelle'},
                {id: 'location', title: 'Ort'}
            ],
        });

        csvWriter.writeRecords(jobs).then(() => {
            console.log(`${filename}.csv wurde im /output Ordner generiert!`);
        });
    }
}