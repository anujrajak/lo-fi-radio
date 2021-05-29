/**
 * I have used Yates-shuffle algo for suffling the list.
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 * @param {Array} list
 * @returns {Array} Suffled-array
 */
export function suffleList(list) {
    let i = list.length;

    while (i !== 0) {
        let rand = Math.floor(Math.random() * (i - 1)) + 1;
        let swap = list[i - 1];
        list[i - 1] = list[rand];
        list[rand] = swap;
        --i;
    };

    return list;
}

/**
 * It fetches the quotes from an public api and returns
 * one random quote from the fetched list of quote.
 * @returns {Object}
 */
export async function fetchQuote() {
    const request = await fetch("https://type.fit/api/quotes");
    const quotes = await request.json();
    return quotes[Math.floor(Math.random() * quotes.length - 1) + 1];
}