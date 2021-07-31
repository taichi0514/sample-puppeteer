import * as dotenv from 'dotenv';
import puppeteer from 'puppeteer';

dotenv.config();
const EMAIL = process.env.EMAIL ?? '';
const PASSWORD = process.env.PASSWORD ?? '';


(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  page.setUserAgent(
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'
  );

  await page.goto('https://moneyforward.com/', {
    waitUntil: 'load',
    timeout: 0,
  });
  await page.click('a[href="/sign_in"]');
  await page.goto(page.url(), {
    waitUntil: 'load',
    timeout: 0,
  });
  const signinUrl = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.buttonWrapper a:nth-child(1)'), a => a.getAttribute('href'))
  );

  await page.goto(`https://id.moneyforward.com${signinUrl[0]}`, {
    waitUntil: 'load',
    timeout: 0,
  });

  await page.type('input[type="email"]', EMAIL!);
  await page.click('input[type="submit"]');

  await page.waitForNavigation({
    timeout: 60000,
    waitUntil: 'domcontentloaded',
  }).catch((e) => {
      throw new Error('timeout');
   });

  await page.type('input[type="password"]', PASSWORD!);
  await page.click('input[type="submit"]');
  await page
    .waitForNavigation({
      timeout: 60000,
      waitUntil: 'domcontentloaded',
    })
    .catch(e => {
      throw new Error('timeout');
    });;
  await page.click('a[href="/aggregation_queue/bq3Jl7efNG-zqQHrZXWAQQ"]');

  await browser.close();
})();
