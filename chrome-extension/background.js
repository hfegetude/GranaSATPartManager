chrome.browserAction.onClicked.addListener(function(activeTab)
{
    // chrome.tabs.create({ url: "https://www.mouser.es/" });
    // chrome.tabs.create({ url: "https://es.rs-online.com/" });
    // chrome.tabs.create({ url: "http://es.farnell.com" });
    // chrome.tabs.create({ url: "https://www.arrow.com/es-mx" });
    // chrome.tabs.create({ url: "https://www.digikey.es" });
    // chrome.tabs.create({ url: "https://www.avnet.com" });

    var part = prompt("Find part:", "");

    chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; i++) {
            chrome.tabs.remove(tabs[i].id);
        }
    });

    chrome.tabs.create({ url: "https://www.mouser.es/Search/Refine.aspx?Keyword=" + part});
    chrome.tabs.create({ url: "https://es.rs-online.com/web/zr/?searchTerm=" + part +"&sra=oss&r=t"});
    chrome.tabs.create({ url: "http://es.farnell.com/search?st=" + part });
    chrome.tabs.create({ url: "https://www.arrow.com/es-mx/products/search?cat=&q=" + part });
    chrome.tabs.create({ url: "https://www.digikey.es/products/es?keywords=" + part});
    chrome.tabs.create({ url: " https://www.avnet.com/shop/SearchDisplay?searchTerm=" + part +"&countryId=emea&deflangId=-1&storeId=10151&catalogId=10001&langId=-1&sType=SimpleSearch&resultCatEntryType=2&searchSource=Q&searchType=100&avnSearchType=all"});
});
