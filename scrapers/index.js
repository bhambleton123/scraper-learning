const puppeteer = require("puppeteer");
const avoidDetection = require("./util");

const __launchPuppeteer = async url => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await avoidDetection(page);

  await page.goto(url);
  return page;
};

const scrapeAmazon = async url => {
  const page = await __launchPuppeteer(url);

  const item = await page.evaluate(() => {
    let title = document
      .getElementById("productTitle")
      .innerHTML.split("\n")[9];

    while (title.charAt(0) === " ") {
      title = title.split("");
      title.splice(0, 1);
      title = title.join("");
    }

    const price = document.getElementById("priceblock_ourprice").innerHTML;

    const listPrice = document.getElementsByClassName(
      "priceBlockStrikePriceString"
    )[0];

    return listPrice
      ? { title, price, listPrice: listPrice.innerHTML, sale: true }
      : { title, price, sale: false };
  });

  return item;
};

const scrapeEbay = async url => {
  const page = await __launchPuppeteer(url);

  const item = await page.evaluate(() => {
    let title = document.getElementsByClassName("product-title")[0].innerHTML;
    let price = document.getElementsByClassName("display-price")[0].innerHTML;

    return { title, price };
  });
  return item;
};

const testScraper = async () => {
  const testUrl =
    "https://intoli.com/blog/" +
    "not-possible-to-block-chrome-headless/chrome-headless-test.html";
  const page = await __launchPuppeteer(testUrl);

  page.screenshot({ path: "headless-test-result.png" });
};

module.exports = {
  scrapeAmazon,
  scrapeEbay,
  testScraper
};
