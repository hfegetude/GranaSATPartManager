
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
                // vendorUrl: pasteData[8]
                vendorUrl: pasteData[1].split("/")[2]
             });
        }
        
    }

}
export default clipboardPasteProxy;