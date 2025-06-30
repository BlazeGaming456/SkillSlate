import axios from "axios";
import * as cheerio from 'cheerio'

export async function scrapeJobDescription(url) {
    const { data } = await axios.get(url, {
        headers: {
            //To prevent blocking due to access by bots
            'User-Agent': 'Mozilla/5.0'
        }
    })

    const $ = cheerio.load(data);

    const jobDesc = $('[data-test="job-description"').text() || $('section.description').text();

    return jobDesc.trim();
}