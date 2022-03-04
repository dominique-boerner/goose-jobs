export default class Job {
    company;
    name;
    link;
    location;
    createdAt;

    constructor(company, name, link, location, createdAt) {
        this.company = company;
        this.name = name;
        this.link = link;
        this.location = location;
        this.createdAt = createdAt;
    }
}