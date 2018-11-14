
var url = window.location.href
var host = window.location.host
console.log("RSIMPORTER:  " + url)

if(url.includes("rs-online")){
    var code = document.querySelector( "#pagecell > div > div.col-xs-12.prodDescDivLL > div.col-xs-10 > div.col-xs-12.keyDetailsDivLL > ul > li:nth-child(1) > span.keyValue.bold").textContent.trim()
    console.log(code)
    if(code){
        document.querySelector("#pagecell > div > div.col-xs-12.prodDescDivLL > div.col-xs-10 > div.col-xs-12.keyDetailsDivLL").insertAdjacentHTML('beforeend', '<button id="copyExcel">COPY EXCEL</button>');
        new ClipboardJS('#copyExcel', {
            text: function(trigger) {
                var codefab = document.querySelector("#pagecell > div > div.col-xs-12.prodDescDivLL > div.col-xs-10 > div.col-xs-12.keyDetailsDivLL > ul > li:nth-child(2) > span.keyValue.bold > span").textContent.trim()
                var fabLoc = document.querySelector("#pagecell > div > div.col-xs-12.prodDescDivLL > div.col-xs-10 > div.col-xs-12.keyDetailsDivLL > ul > li:nth-child(4) > span.keyValue > a > span")
                if(fabLoc === null) {
                    fabLoc = document.querySelector("#pagecell > div > div.col-xs-12.prodDescDivLL > div.col-xs-10 > div.col-xs-12.keyDetailsDivLL > ul > li:nth-child(3) > span.keyValue > a > span")
                }
                var fab = fabLoc.textContent.trim()
                var description = document.querySelector("#pagecell > div > div.col-xs-12.prodDescDivLL > div.col-xs-10 > h1").textContent.trim()
                var price = document.querySelector("#price-break-container > div > div:nth-child(1) > div.topPriceArea > div.current-price > div.product-price > span.price") || -1
                price = (price === -1) ? price : price.textContent.trim()
                var minquantity =document.querySelector("#break-prices-list") || -1
                minquantity = (minquantity === -1) ? minquantity : minquantity.children[1].textContent.split(" ")[0]
                var img = document.querySelector("#mainImage")
                img = (img) ? img.src : ''
                return ["RS",url,code,codefab,fab,description,price,minquantity, host,'',img].join("\t");
              }
            });
    }
}

if(url.includes("mouser")){
    var code = document.querySelector("#spnMouserPartNumFormattedForProdInfo").textContent.trim()
    console.log(code)
    if(code){
        document.querySelector("#pdpProdInfo > div.panel-heading.pdp-product-card-header > h4").insertAdjacentHTML('beforeend', '<button id="copyExcel">COPY EXCEL</button>');
        new ClipboardJS('#copyExcel', {
            text: function(trigger) {
                var codefab = document.querySelector("#spnManufacturerPartNumber").textContent.trim()
                var fab = document.querySelector("#lnkManufacturerName") || document.querySelector("#spnManufacturerName")
                fab = fab.textContent.trim()
                var description = document.querySelector("#spnDescription").textContent.trim()
                var price = document.querySelector("#pdpPricingAvailability > div.panel-body > div.div-table.pdp-pricing-table > div.div-table-row > .row > div:nth-child(2) > span") || -1
                price = (price === -1) ? price : price.textContent.replace("€","").replace(",",".").trim()
                var minquantity = document.querySelector("#pdpPricingAvailability > div.panel-body > div.div-table.pdp-pricing-table > div.div-table-row > .row > div:nth-child(1)") || -1
                minquantity = (minquantity === -1) ? minquantity : minquantity.textContent.trim()
                var datasheet =document.querySelector("#pdp-datasheet_0")
                datasheet = (datasheet) ? datasheet.href : ''
                var img=document.querySelector("#imglink > img")
                img = (img) ? img.src : ''
                return ["Mouser",url,code,codefab,fab,description,price,minquantity, host, datasheet,img].join("\t");
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
        new ClipboardJS('#copyExcel', {
            text: function(trigger) {
                var codefab = document.querySelector("#product > div.mainPdpWrapper > section:nth-child(4) > div > div.proDescAndReview > div.productDescription.packaging > dl > div:nth-child(2) > dd").textContent.trim()
                var fab = document.querySelector("#product > div.mainPdpWrapper > section:nth-child(4) > div > div.proDescAndReview > div.productDescription.packaging > dl > div:nth-child(1) > dd > a > span:nth-child(1)").textContent.trim()
                var description = document.querySelector("#product > div.mainPdpWrapper > section:nth-child(4) > h2 > span").textContent.trim()
                var price = document.querySelector("#product > div.secondaryPdpWrapper > section > div.availabilityPriceContainer > div.inventoryStatus > div.productPrice > span.price").textContent.trim().slice(0, -1);
                var minquantity =document.querySelector("#product > div.secondaryPdpWrapper > section > div.availabilityPriceContainer > div.inventoryStatus > div.multqty > span:nth-child(2) > strong").textContent.trim()
                var datasheet = document.querySelector("#product > div.mainPdpWrapper > section:nth-child(4) > div > div.proDescAndReview > div.productDescription.packaging > dl > div:nth-child(5) > dd > a")
                datasheet = (datasheet) ? datasheet.href : ''
                var img = document.querySelector("#productMainImage")
                img = (img) ? img.src : ''
                return ["Farnell",url,code,codefab,fab,description,price,minquantity, host, datasheet, img].join("\t");
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
        new ClipboardJS('#copyExcel', {
            text: function(trigger) {
                var codefab = code;
                var fab = document.querySelector("#main-content > section > div > div.Pdp-layout-top.Content > div > div.col-md-7 > div.Product-Summary.row > div.col-xs-6.col-md-8 > h1 > span.Product-Summary-SubHeading-Manufacturer").textContent.trim()
                var description = document.querySelector("#main-content > section > div > div.Pdp-layout-top.Content > div > div.col-md-7 > div.Product-Summary.row > div.col-xs-6.col-md-8 > div > div:nth-child(2) > p:nth-child(6)").textContent.trim()
                var price = document.querySelector("#main-content > section > div > div.Pdp-layout-top.Content > div > div.PdpMobileTabs-panel.col-md-5 > div.BuyingOptions > div > div.BuyingOptions-content.BuyingOptions-region.is-open > ul > li > div:nth-child(2) > ol > li:nth-child(1) > span.BuyingOptions-priceTiers-price").textContent.trim().slice(1);
                var minquantity =document.querySelector("#main-content > section > div > div.Pdp-layout-top.Content > div > div.PdpMobileTabs-panel.col-md-5 > div.BuyingOptions > div > div.BuyingOptions-content.BuyingOptions-region.is-open > ul > li > div:nth-child(2) > ol > li:nth-child(1) > span.BuyingOptions-priceTiers-quantity").textContent.trim().slice(0,-1)
                var datasheet = document.querySelector("#main-content > section > div > div.Pdp-layout-top.Content > div > div.col-md-7 > div.Product-Summary.row > div.u-phablet-up-show.col-xs-6.col-md-4 > div > ul > li > a")
                datasheet = (datasheet) ? datasheet.href : ''
                var img = document.querySelector("#main-content > section > div > div.Pdp-layout-top.Content > div > div.col-md-7 > div.Product-Summary.row > div.col-xs-6.col-md-8 > div > div:nth-child(1) > div > div > img")
                img = (img) ? img.src : ''
                return ["Arrow",url,code,codefab,fab,description,price,minquantity, host,datasheet,img].join("\t");
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
        new ClipboardJS('#copyExcel', {
            text: function(trigger) {
                var codefab = document.querySelector("#product-overview > tbody > tr:nth-child(4) > td:nth-child(2) > h1").textContent.trim();
                var fab = document.querySelector("#product-overview > tbody > tr:nth-child(3) > td:nth-child(2) > h2 > span > a > span").textContent.trim()
                var description = document.querySelector("#product-overview > tbody > tr:nth-child(5) > td:nth-child(2)").textContent.trim()
                var price = document.querySelector("#schema-offer").textContent.trim().slice(1);
                var minquantity =document.querySelector("#priceProcurement > div.catalog-pricing > table > tbody > tr:nth-child(2) > td:nth-child(1)").textContent.trim().slice(0,-1)
                var datasheet = document.querySelector("#pdp_content > div.product-details-overview > div.product-details-documents-media.product-details-section > table > tbody > tr:nth-child(1) > td > span > a")
                datasheet = (datasheet) ? datasheet.href : ''
                var img= document.querySelector("#product-photo > div.product-photo-wrapper > a > img")
                img = (img) ? img.src : ''
                return ["Digikey",url,code,codefab,fab,description,price,minquantity, host, datasheet, img].join("\t");
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
        new ClipboardJS('#copyExcel', {
            text: function(trigger) {
                var codefab = code;
                var fab = document.querySelector("#primary-info > div.manufacturer").textContent.split("\n")[1].trim()
                var description = document.querySelector("body > div.container-fluid.pdp > div.col-xs-s12.col-sm-12.col-md-8.pull-left.product-info > div.ellipsis-text > h2").textContent.trim()
                var price = document.querySelector("#your_price_PDP").textContent.trim().replace("€","").replace("$","").replace(",",".");
                var minquantity =document.querySelector("#priceAvailability > div.pricetiers.space-top > div.col-xs-6.norightpadding > div > div.row.usdpart1.usdpartHighlight > div.col-xs-6.col-md-5.col-lg-6.nopadding > span").textContent.trim().slice(0,1)
                var datasheet= document.querySelector("#WC_TechnicalSpecification_Image_2_")
                datasheet = (datasheet) ? datasheet.href : ''
                var img = document.querySelector("#slideshow > div > img")
                img = (img) ? img.src : ''
                return ["Avnet",url,code,codefab,fab,description,price,minquantity, host, datasheet, img].join("\t");
              }
            });
    }
}

if(url.includes("lcsc")){
    var code = document.querySelector("#demo > div.notice-item > ul > li:nth-child(3) > div.item-right.reg").textContent.trim()
    console.log(code)
    if(code){
        document.querySelector("#demo > div.notice-item > h2")
        .insertAdjacentHTML('beforeend', '<button id="copyExcel">COPY EXCEL</button>');
        new ClipboardJS('#copyExcel', {
            text: function(trigger) {
                var codefab = document.querySelector("#demo > div.notice-item > ul > li:nth-child(2) > div.item-right.reg").textContent.trim();
                var fab = document.querySelector("#demo > div.notice-item > ul > li:nth-child(1) > a").textContent.trim()
                var description = document.querySelector("#demo > div.notice-item > ul > li:nth-child(7) > div.item-right.reg").textContent.trim();
                var price = document.querySelector("#product_details > div.details-content.maxw_1500 > div.content > div.content-right > div.cart-box > div:nth-child(1) > div > div:nth-child(2) > div.computed.mb-20 > span.bold").textContent.trim().replace("€","").replace("$","").replace(",",".");
                var minquantity =document.querySelector("#product_details > div.details-content.maxw_1500 > div.content > div.content-right > div.cart-box > div:nth-child(3) > table > tbody > tr:nth-child(1) > td.tdQty.semi > a").textContent.trim().slice(0,1)
                var datasheet= document.querySelector("#demo > div.notice-item > ul > li:nth-child(6) > div.item-right.reg > a")
                datasheet = (datasheet) ? datasheet.href : ''
                var img = document.querySelector("#imgBox > div.swiper-container.gallery-top.swiper-container-horizontal > div > div.swiper-no-swiping.swiper-slide.swiper-slide-active > img")
                img = (img) ? img.src : ''
                return ["LCSC",url,code,codefab,fab,description,price,minquantity, host, datasheet, img].join("\t");
              }
            });
    }
}