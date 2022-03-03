import AzubiDeController from "./controller/azubi-de.controller";

// const url = "https://www.stepstone.de/5/ergebnisliste.html?what=Ausbildung%20Büro&where=Duisburg&radius=30&searchOrigin=Homepage_top-search";
// const url = "https://www.jobbörse-stellenangebote.de/jobsuche/ausbildung/?q=büro&l=duisburg&d=25&qs=1&ds=0&fs=0";

console.log("*****************************************")
console.log("Unsere Gänse suchen für dich nach Jobs...")
console.log("*****************************************")

console.log("Suche auf: Azubi.de")
const azubiDeController = new AzubiDeController();
azubiDeController.getJobs();



