export class Util {
    static removeWhitespaces(text) {
        return text
            .replace(/^\s+|\s+$|\s+(?=\s)/, "")
            .replace("/r", "")
            .replace("\n", "");
    }

    static generateUrl(rootUrl, url) {
        return `${rootUrl}${url}`;
    }
}