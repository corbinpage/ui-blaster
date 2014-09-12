function getSelectionText() {
    var range = $.Range.current();
    var text = "";
    var complete = "";

    if (!!(range.toString())) {
        text = range.toString();
        complete = range.start('-20').end('+20').toString();
    }  
    return [text, complete];
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("Typo Blaster message received...");
    var textArray = getSelectionText();
    sendResponse({text:           textArray[0],
                  complete_text:  textArray[1],
                  url:            document.URL,
                  domain:         window.location.host});
  }
);