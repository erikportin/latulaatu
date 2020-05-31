export function getSearchFromUrl(search = ''): Record<string, string>{
    let pairs = search.substring(1).split("&")
    let obj:Record<string, string> = {};
    let pair: string[];
    let i: string;

    for (i in pairs) {
        if (pairs[i] === "") continue;
        pair = pairs[i].split("=");
        const key = decodeURIComponent(pair[0]);
        obj[key] = decodeURIComponent(pair[1]);
    }

    return obj;
}
