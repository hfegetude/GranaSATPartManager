
var url = window.location.href
var host = window.location.host
console.log("RSIMPORTER:  " + url)

if(url.includes("rs-online")){
    var code = document.querySelector( "#pagecell > div > div.col-xs-12.prodDescDivLL > div.col-xs-10 > div.col-xs-12.keyDetailsDivLL > ul > li:nth-child(1) > span.keyValue.bold").textContent.trim()
    console.log(code)
    if(code){
        document.querySelector("#pagecell > div > div.col-xs-12.prodDescDivLL > div.col-xs-10 > div.col-xs-12.keyDetailsDivLL").insertAdjacentHTML('beforeend', '<button id="copyExcel">COPY EXCEL</button>');
        new Clipboard('#copyExcel', {
            text: function(trigger) {
                var codefab = document.querySelector("#pagecell > div > div.col-xs-12.prodDescDivLL > div.col-xs-10 > div.col-xs-12.keyDetailsDivLL > ul > li:nth-child(2) > span.keyValue.bold > span").textContent.trim()
                var fabLoc = document.querySelector("#pagecell > div > div.col-xs-12.prodDescDivLL > div.col-xs-10 > div.col-xs-12.keyDetailsDivLL > ul > li:nth-child(4) > span.keyValue > a > span")
                if(fabLoc === null) {
                    fabLoc = document.querySelector("#pagecell > div > div.col-xs-12.prodDescDivLL > div.col-xs-10 > div.col-xs-12.keyDetailsDivLL > ul > li:nth-child(3) > span.keyValue > a > span")
                }
                var fab = fabLoc.textContent.trim()
                var description = document.querySelector("#pagecell > div > div.col-xs-12.prodDescDivLL > div.col-xs-10 > h1").textContent.trim()
                var price = document.querySelector("#price-break-container > div > div:nth-child(1) > div.topPriceArea > div.current-price > div.product-price > span.price").textContent.trim()
                var minquantity =document.querySelector("#break-prices-list").children[1].textContent.split(" ")[0]

                return ["RS",url,code,codefab,fab,description,price,minquantity, host].join("\t");
              }
            });
    }
}

if(url.includes("mouser")){
    var code = document.querySelector("#spnMouserPartNumFormattedForProdInfo").textContent.trim()
    console.log(code)
    if(code){
        document.querySelector("#pdpProdInfo > div.panel-heading.pdp-product-card-header > h4").insertAdjacentHTML('beforeend', '<button id="copyExcel">COPY EXCEL</button>');
        new Clipboard('#copyExcel', {
            text: function(trigger) {
                var codefab = document.querySelector("#spnManufacturerPartNumber").textContent.trim()
                var fab = document.querySelector("#lnkManufacturerName").textContent.trim()
                var description = document.querySelector("#spnDescription").textContent.trim()
                var price = document.querySelector("#pdpPricingAvailability > div.panel-body > div.div-table.pdp-pricing-table > div:nth-child(2) > div > div:nth-child(2) > span").textContent.trim()
                var minquantity =document.querySelector("#pdpPricingAvailability > div.panel-body > div.div-table.pdp-pricing-table > div:nth-child(2) > div > div.col-xs-4.text-right.div-table-col-highlight > div > label").children[0].textContent.trim()
  
                return ["Mouser",url,code,codefab,fab,description,price,minquantity, host].join("\t");
              }
            });
    }
}

if(url.includes("farnell")){
    var code = document.querySelector("#product > div.mainPdpWrapper > section:nth-child(4) > div > div.proDescAndReview > div.productDescription.packaging > dl > div:nth-child(3) > dd").textContent.trim()
    console.log(code)
    if(code){
        document.querySelector("#product > div.mainPdpWrapper > section:nth-child(4) > h2")
        .insertAdjacentHTML('beforeend', '<button id="copyExcel">COPY EXCEL</button>');
        new Clipboard('#copyExcel', {
            text: function(trigger) {
                var codefab = document.querySelector("#product > div.mainPdpWrapper > section:nth-child(4) > div > div.proDescAndReview > div.productDescription.packaging > dl > div:nth-child(2) > dd").textContent.trim()
                var fab = document.querySelector("#product > div.mainPdpWrapper > section:nth-child(4) > div > div.proDescAndReview > div.productDescription.packaging > dl > div:nth-child(1) > dd > a > span:nth-child(1)").textContent.trim()
                var description = document.querySelector("#product > div.mainPdpWrapper > section:nth-child(4) > h2 > span").textContent.trim()
                var price = document.querySelector("#product > div.secondaryPdpWrapper > section > div.availabilityPriceContainer > div.inventoryStatus > div.productPrice > span.price").textContent.trim().slice(0, -1);
                var minquantity =document.querySelector("#product > div.secondaryPdpWrapper > section > div.availabilityPriceContainer > div.inventoryStatus > div.multqty > span:nth-child(2) > strong").textContent.trim()
                return ["Farnell",url,code,codefab,fab,description,price,minquantity, host].join("\t");
              }
            });
    }
}

if(url.includes("arrow")){
    var code = document.querySelector("#main-content > section > div > div.Pdp-layout-top.Content > div > div.col-md-7 > div.Product-Summary.row > div.col-xs-6.col-md-8 > h1 > span.Product-Summary-SubHeading-ProductTitle > strong").textContent.trim()
    console.log(code)
    if(code){
        document.querySelector("#main-content > section > div > div.Pdp-layout-top.Content > div > div.col-md-7 > div.Product-Summary.row > div.col-xs-6.col-md-8 > h1")
        .insertAdjacentHTML('beforeend', '<button id="copyExcel">COPY EXCEL</button>');
        new Clipboard('#copyExcel', {
            text: function(trigger) {
                var codefab = code;
                var fab = document.querySelector("#main-content > section > div > div.Pdp-layout-top.Content > div > div.col-md-7 > div.Product-Summary.row > div.col-xs-6.col-md-8 > h1 > span.Product-Summary-SubHeading-Manufacturer").textContent.trim()
                var description = document.querySelector("#main-content > section > div > div.Pdp-layout-top.Content > div > div.col-md-7 > div.Product-Summary.row > div.col-xs-6.col-md-8 > div > div:nth-child(2) > p:nth-child(6)").textContent.trim()
                var price = document.querySelector("#main-content > section > div > div.Pdp-layout-top.Content > div > div.PdpMobileTabs-panel.col-md-5 > div.BuyingOptions > div > div.BuyingOptions-content.BuyingOptions-region.is-open > ul > li > div:nth-child(2) > ol > li:nth-child(1) > span.BuyingOptions-priceTiers-price").textContent.trim().slice(1);
                var minquantity =document.querySelector("#main-content > section > div > div.Pdp-layout-top.Content > div > div.PdpMobileTabs-panel.col-md-5 > div.BuyingOptions > div > div.BuyingOptions-content.BuyingOptions-region.is-open > ul > li > div:nth-child(2) > ol > li:nth-child(1) > span.BuyingOptions-priceTiers-quantity").textContent.trim().slice(0,-1)
                return ["Arrow",url,code,codefab,fab,description,price,minquantity, host].join("\t");
              }
            });
    }
}
if(url.includes("digikey")){
    var code = document.querySelector("#reportPartNumber").textContent.trim()
    console.log(code)
    if(code){
        document.querySelector("#pdp_content > div.product-details-overview > div.product-overview-photo-spacer > div > div")
        .insertAdjacentHTML('beforeend', '<button id="copyExcel">COPY EXCEL</button>');
        new Clipboard('#copyExcel', {
            text: function(trigger) {
                var codefab = document.querySelector("#product-overview > tbody > tr:nth-child(4) > td:nth-child(2) > h1").textContent.trim();
                var fab = document.querySelector("#product-overview > tbody > tr:nth-child(3) > td:nth-child(2) > h2 > span > a > span").textContent.trim()
                var description = document.querySelector("#product-overview > tbody > tr:nth-child(5) > td:nth-child(2)").textContent.trim()
                var price = document.querySelector("#schema-offer").textContent.trim().slice(1);
                var minquantity =document.querySelector("#priceProcurement > div.catalog-pricing > table > tbody > tr:nth-child(2) > td:nth-child(1)").textContent.trim().slice(0,-1)
                return ["Digikey",url,code,codefab,fab,description,price,minquantity, host].join("\t");
              }
            });
    }
}
if(url.includes("avnet")){
    var code = document.querySelector("body > div.container-fluid.pdp > div.col-xs-s12.col-sm-12.col-md-8.pull-left.product-info > h1").textContent.trim()
    console.log(code)
    if(code){
        document.querySelector("body > div.container-fluid.pdp > div.col-xs-s12.col-sm-12.col-md-8.pull-left.product-info > h1")
        .insertAdjacentHTML('beforeend', '<button id="copyExcel">COPY EXCEL</button>');
        new Clipboard('#copyExcel', {
            text: function(trigger) {
                var codefab = code;
                var fab = document.querySelector("#primary-info > div.manufacturer").textContent.split("\n")[1].trim()
                var description = document.querySelector("body > div.container-fluid.pdp > div.col-xs-s12.col-sm-12.col-md-8.pull-left.product-info > div.ellipsis-text > h2").textContent.trim()
                var price = document.querySelector("#your_price_PDP").textContent.trim().replace("€","").replace("$","").replace(",",".");
                var minquantity =document.querySelector("#priceAvailability > div.pricetiers.space-top > div.col-xs-6.norightpadding > div > div.row.usdpart1.usdpartHighlight > div.col-xs-6.col-md-5.col-lg-6.nopadding > span").textContent.trim().slice(0,1)
                return ["Avnet",url,code,codefab,fab,description,price,minquantity, host].join("\t");
              }
            });
    }
}