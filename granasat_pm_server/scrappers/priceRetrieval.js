var phantom = require("phantom");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const getPrice = async (url) =>  {

    const instance = await phantom.create();
    const page = await instance.createPage();

    await page.setting('userAgent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36');
    await page.setting('accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3');
    await page.setting('acceptEncoding', ' gzip, deflate, br');
    await page.setting('acceptLanguage', 'es-ES,es;q=0.9,en;q=0.8,fr;q=0.7,gl;q=0.6');
    await page.setting('cacheControl', 'no-cache');

    // accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3
    // accept-encoding: gzip, deflate, br
    // accept-language: es-ES,es;q=0.9,en;q=0.8,fr;q=0.7,gl;q=0.6
    // cache-control: no-cache

    await page.on("onResourceRequested", function(requestData) {
        console.info('Requesting', requestData.url)
    });

    const status = await page.open(url);
    console.log(status);

    const content = await page.property('content');
    console.log(content);


    await instance.exit();

    const dom = new JSDOM(content);
    var price = -1
    
    if(url.includes("rs-online")){
        price = dom.window.document.querySelector("#price-break-container > div > div:nth-child(1) > div.topPriceArea > div.current-price > div.product-price > span.price").textContent
    }else if(url.includes("mouser")){
        price = dom.window.document.querySelector("#pdpPricingAvailability > div.panel-body > div.div-table.pdp-pricing-table > div.div-table-row > .row > div:nth-child(2) > span")
        price = (price === -1) ? price : price.textContent.replace("€","").replace(",",".").trim()
    }else if(url.includes("farnell")){
        price = dom.window.document.querySelector("#product > div.secondaryPdpWrapper > section > div.availabilityPriceContainer > div.inventoryStatus > div.productPrice > span.price").textContent.trim().slice(0, -1);
    }else if(url.includes("arrow")){
        price = dom.window.document.querySelector("#main-content > section > div > div.Pdp-layout-top.Content > div > div.PdpMobileTabs-panel.col-md-5 > div.BuyingOptions > div > div.BuyingOptions-content.BuyingOptions-region.is-open > ul > li > div:nth-child(2) > ol > li:nth-child(1) > span.BuyingOptions-priceTiers-price").textContent.trim().slice(1);
    }else if(url.includes("digikey")){
        price = dom.window.document.querySelector("#schema-offer").textContent.trim().slice(1);
    }else if(url.includes("avnet")){
        price = dom.window.document.querySelector("#your_price_PDP").textContent.trim().replace("€","").replace("$","").replace(",",".");
    }else if(url.includes("lcsc")){
        price = dom.window.document.querySelector("#product_details > div.details-content.maxw_1500 > div.content > div.content-right > div.cart-box > div:nth-child(1) > div > div:nth-child(2) > div.computed.mb-20 > span.bold").textContent.trim().replace("€","").replace("$","").replace(",",".");
    }
    return price
}




getPrice("https://www.mouser.com/ProductDetail/Yageo/RC1206JR-1356RL?qs=%2Fha2pyFaduhEi13teCwc035ji8yVCeh6wsEJ1%2FrmPbT27it6CN1mWSUNlhvFVkh9").then(price => {
    console.log(price)
})
