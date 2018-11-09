
function clipboardPasteProxy(cb){
    return (e)=>{
        var clipboardData, pasteData;
        clipboardData = e.clipboardData || window.clipboardData;
        pasteData = clipboardData.getData('Text').split('\t');
        if (pasteData.length > 1) {
            e.stopPropagation();
            e.preventDefault();
            cb({vendor: pasteData[0], 
                url: pasteData[1], 
                vendorCode: pasteData[2], 
                manufacturerCode: pasteData[3],
                manufacturer: pasteData[4],
                description: pasteData[5],
                unitPrice: pasteData[6],
                minUnit: pasteData[7],
                vendorUrl: pasteData[8],
                datasheet: (pasteData[9].length) ? pasteData[9] : null,
                image: (pasteData[10].length) ? pasteData[10] : null,
             });
        }
        
    }

}

//0 Mouser	
//1 https://www.mouser.es/ProductDetail/?qs=HXFqYaX1Q2wg2xost4dN2w==	
//2 863-NCV5700DR2G	
//3 NCV5700DR2G	
//4 ON Semiconductor	
//5 Gate Drivers HIGH CURRENT IGBT GATE DR	
//6 2.30	
//7 1	
//8 www.mouser.es 	
//9 https://www.mouser.es/datasheet/2/308/NCV5700-D-1139479.pdf	 	OPTIONAL
//10 https://www.mouser.es/images/mouserelectronics/images/SO_16_t.jpg OPTIONAL

export default clipboardPasteProxy;