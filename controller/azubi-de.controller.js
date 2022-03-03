import got from "got";
import {JSDOM} from "jsdom";
import Job from "../models/job";
import CsvController from "./csv.controller";
import {Util} from "../util/util";

export default class AzubiDeController {
    page = 1;
    jobs = []

    radiusKm = 30;
    text = "Büro";

    getJobs() {
        console.log(`Suche auf azubi.de nach jobs ${this.radiusKm} Km um Duisburg im ${this.text}-Bereich - Seite ${this.page}...`)
        const azubiDeUrl = `https://www.azubi.de/suche?page=${this.page}&query%5Blocation%5D=duisburg&query%5Bradius%5D=30&query%5Btext%5D=Büro`;

        (async () => {
            const response = await got(azubiDeUrl);
            const dom = new JSDOM(response.body);

            const names = [...dom.window.document.querySelectorAll('.fluid-job-offer-teaser__title')];
            const company = [...dom.window.document.querySelectorAll('.fluid-job-offer-teaser__company-title>span')];
            const location = [...dom.window.document.querySelectorAll('.job-offer-address')];
            const urls = [...dom.window.document.querySelectorAll('.fluid-job-offer-teaser-wrapper a')];

            const length = names.length;

            for (let i = 0; i < length; i++) {
                this.jobs = [...this.jobs,
                    new Job(
                        company[i].innerHTML,
                        Util.removeWhitespaces(names[i].innerHTML),
                        Util.generateUrl("https://www.azubi.de",
                            urls[i].href), location[i].innerHTML
                    )
                ]
            }

            if (length > 0) {
                this.page++;
                this.getJobs()
            } else {
                this.page = 1;
                CsvController.generateCSV(this.jobs, "azubi-de");
            }
        })();
    }
}