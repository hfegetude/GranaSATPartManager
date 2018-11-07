
function clipboardPasteProxy(cb){
    return (e)=>{
        var clipboardData, pasteData;
        e.stopPropagation();
        e.preventDefault();
        clipboardData = e.clipboardData || window.clipboardData;
        pasteData = clipboardData.getData('Text').split('\t');
        cb({distributor: pasteData[0], 
            url: pasteData[1], 
            vendorCode: pasteData[2], 
            manufacturerCode: pasteData[3],
            manufacturer: pasteData[4],
            description: pasteData[5],
            unitPrice: pasteData[6],
            minUnit: pasteData[7]
         });
    }

}
export default clipboardPasteProxy;