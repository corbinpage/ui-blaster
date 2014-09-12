// JS run in the Chrome extension
var send_response;

function cancelButtonClick() {
  // Cancel the form submit
  event.preventDefault();
  // Close popup window
  window.close();
}

function submitButtonClick() {
  // Cancel the form submit
  event.preventDefault();
  var typo_text = document.getElementById("typo-text").value;

  if(!!typo_text) {
    sendDataToServer();
    changeToSuccessUI();
  }
  else {
    document.querySelector('#typo-text').classList.toggle('warning');
  }
}

// Provide feedback to the user that the submission occurred
function changeToSuccessUI() {
  document.querySelector('#input-screen').classList.toggle('invisible');
  document.querySelector('#success-screen').classList.toggle('invisible');
}

function sendDataToServer() {
  console.log("Sending Data...")

  // send_response
  //   url
  //   domain
  //   text
  //   complete_text

    // user_email
    // comments
    // created_date

    // id
    // status
    // domain_email
    // email_date



}

function populateHighlightedText() {
 chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
   //Sends message to the page.js and gets highlights text
   console.log("Sending message to tab...");
   chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
    console.log("Received message from tab...");
    send_response = response;
    console.log(response);

    document.getElementById("typo-text").innerHTML = response.text;
    
  });
 });
}

// When the popup HTML has loaded
window.addEventListener('load', function(evt) {
  // Set click event listeners on the buttons
  document.getElementById("main-form").addEventListener('submit', function(){return false;});
  document.getElementById("cancel-button").addEventListener('click', cancelButtonClick);
  document.getElementById("submit-button").addEventListener('click', submitButtonClick);

  populateHighlightedText()

});
