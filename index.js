/**
 * @file job-scraper
 * @author Kevin Tran <kevin.tran.kt@gmail.com>
 * @version 1.0.0
 */

const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

const options = {
  uri: `https://www.indeed.com/jobs?q=engineer&l=95112&jt=internship&sort=date`,
  transform: function(body) {
    return cheerio.load(body);
  }
};

let jobs = [];
let companies;

rp(options)
  .then($ => {
    companies = $('span[class=company]')
      .text()
      .split('\n')
      .filter(x => x.trim().length != 0)
      .map(x => x.trim());

    let count = 0;
    $('a[data-tn-element=jobTitle]').each(function(i, elem) {
      let job = {};

      job['title'] = $(this)['0'].attribs.title;
      job['company'] = companies[count++];
      job['url'] = 'https://www.indeed.com' + $(this)['0'].attribs.href;

      jobs.push(job);
    });
    writeToHtml();
    console.log(jobs);
  })
  .catch(err => {
    console.log(err);
  });

const writeToHtml = () => {
  fs.writeFileSync('output.html', JSON.stringify(jobs, null, 2));
};
