import got from "got";
import {JSDOM} from "jsdom";
import Job from "../models/job";
import CsvController from "./csv.controller";
import {Util} from "../util/util";

const config = require("../config.json");

export default class AzubiDeController {
    page = 1;
    jobs = []

    radiusKm = 30;
    text = "Büro";

    getJobs() {
        console.log(`Suche auf azubi.de nach jobs ${this.radiusKm} Km um Duisburg im ${this.text}-Bereich - Seite ${this.page}...`)
        const azubiDeUrl = `https://www.azubi.de/suche?page=${this.page}&query%5Blocation%5D=${config.azubiDe.location}&query%5Bradius%5D=${config.azubiDe.location}&query%5Btext%5D=${config.azubiDe.job}`;

        (async () => {
            const response = await got(azubiDeUrl);
            const dom = new JSDOM(response.body);

            const names = [...dom.window.document.querySelectorAll('.fluid-job-offer-teaser__title')];
            const company = [...dom.window.document.querySelectorAll('.fluid-job-offer-teaser__company-title>span')];
            const location = [...dom.window.document.querySelectorAll('.job-offer-address')];
            const urls = [...dom.window.document.querySelectorAll('.fluid-job-offer-teaser-wrapper a')];
            let createdAt = await this.getCreatedAt(urls);

            const length = names.length;

            for (let i = 0; i < length; i++) {
                this.jobs = [...this.jobs,
                    new Job(
                        company[i].innerHTML,
                        Util.removeWhitespaces(names[i].innerHTML),
                        Util.generateUrl("https://www.azubi.de",
                            urls[i].href), location[i].innerHTML,
                        Util.removeWhitespaces(createdAt[i])
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

    async getCreatedAt(urls) {
        let createdAt = [];


        await Promise.all(urls.map((url) => got(Util.generateUrl("https://www.azubi.de", url)))).then((result) => {
            result.forEach((result) => {
                const detailDom = new JSDOM(result.body);

                const createdAtDom = [...detailDom.window.document.querySelectorAll(".job-offer-header__listing")];
                const createdString = createdAtDom[0].children[0].innerHTML;
                createdAt = [...createdAt, createdString];
            })
        });

        return createdAt;
    }
}