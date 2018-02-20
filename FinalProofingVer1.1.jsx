#target indesign
//color swatches
app.menuActions.item("$ID/Add All Unnamed Colors").invoke();
var myIndesignDoc = app.activeDocument;
var myUnusedSwatches = myIndesignDoc.unusedSwatches;
var mySwatches = myIndesignDoc.swatches;
for (var s = myUnusedSwatches.length-1; s >= 0; s--) {
    var mySwatch = myIndesignDoc.unusedSwatches[s];
    var name = mySwatch.name;
    if (name != ""){
        mySwatch.remove();
    }
}

app.activeDocument.colors.everyItem().properties = {model:ColorModel.PROCESS};
app.activeDocument.colors.everyItem().properties = {space:ColorSpace.CMYK};
// if color swatch is still RGB alert



var mySwatch = myIndesignDoc.swatches;  
    var spaceCounter = 0;
    var spaceCounterRGB = 0;
    var spaceCounterLAB = 0;
    var spaceCounterMIXEDINK = 0;
    var spaceCounterGradient = 0;

    for (var j=4; j<mySwatch.length; j++){
        
        if(mySwatch[j].space != ColorSpace.CMYK){
            if(mySwatch[j] instanceof Gradient){
                spaceCounter++;
                spaceCounterGradient++;
            } else if (mySwatch[j].space == ColorSpace.RGB){
                spaceCounter++;
                spaceCounterRGB++;
        } else if(mySwatch[j].space == ColorSpace.LAB){
                spaceCounter++;
                spaceCounterLAB++;
        } else if (mySwatch[j].space == ColorSpace.MIXEDINKMODEL){
                spaceCounter++;
                 spaceCounterMIXEDINK++;
        }
    } 
    }
function countUnchanged() {
    if (spaceCounter === 1){
        alert('Was unable to convert (' + spaceCounter + ') swatch to CMYK. \r' + 'Check your links for any imported spot colors. \r' + 'RGB Swatches: ' + spaceCounterRGB + '\r' + 'LAB Swatches: ' + spaceCounterRGB + '\r' + 'Gradient Swatches: ' + spaceCounterGradient + '\r' + 'Mixed-Ink Swatches: ' + spaceCounterMIXEDINK);
    } else if (spaceCounter > 1) {
        alert('Was unable to convert (' + spaceCounter + ') swatches to CMYK. \r' + 'Check your links for any imported spot colors. \r' + 'RGB Swatches: ' + spaceCounterRGB + '\r' + 'LAB Swatches: ' + spaceCounterRGB + '\r' + 'Gradient Swatches: ' + spaceCounterGradient + '\r' + 'Mixed-Ink Swatches: ' + spaceCounterMIXEDINK);
    } else if (spaceCounter === 0){
        alert('All swatches successfully changed to CMYK.');
    }
}
countUnchanged();

//rgb images
if (app.documents.length == 0) {
	alert("Please open a document and try again.", "Convert RGB images to CMYK", true);
	exit();
}

var doc = app.activeDocument,
links = doc.links,
i, link, image;

UpdateAllOutdatedLinks();


// Non-PNG Friendly Version
for (i = links.length-1; i >= 0; i--) {
	link = links[i];
	if ((link.status == LinkStatus.NORMAL) && (link.linkType == "JPEG" || link.linkType == "Portable Network Graphics (PNG)" || link.linkType == "TIFF")) {
        image = link.parent;            
        if (image.space == "RGB") {
			CreateBridgeTalkMessage(link.filePath);
		} 
	} else { 
        continue;
    }
} 

UpdateAllOutdatedLinks();

//===================== FUNCTIONS ===============================
function CreateBridgeTalkMessage(imagePath) {
	var bt = new BridgeTalk();
	bt.target = "photoshop";
	bt.body = ResaveInPS.toSource()+"("+imagePath.toSource()+");";
	bt.onError = function(errObj) {
          $.writeln("Error: " + errObj.body);
     }
	bt.onResult = function(resObj) {}
	bt.send(30);
}
//--------------------------------------------------------------------------------------------------------------
function ResaveInPS(imagePath) {
	var psDoc;
	app.displayDialogs = DialogModes.NO;
	psDoc = app.open(new File(imagePath));
 	psDoc.changeMode(ChangeMode.CMYK);
 	psDoc.close(SaveOptions.SAVECHANGES);
	app.displayDialogs = DialogModes.ALL;
}
//--------------------------------------------------------------------------------------------------------------
function UpdateAllOutdatedLinks() {
	var link, c;
	for (c = doc.links.length-1; c >= 0; c--) {
		link = doc.links[c];
		if (link.status == LinkStatus.LINK_OUT_OF_DATE) link.update();
	}
}