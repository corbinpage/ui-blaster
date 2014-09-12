// Typo Blaster
// Script to sent an email out for all new records

// Typo Statuses
var EMAIL_SENT = "EMAIL_SENT";
var READY_FOR_EMAIL = "READY_FOR_EMAIL";

// Check for new records
function checkTypoStatuses() {
  Logger.log("Typo check - Start" + Date());
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("typos");

  // This represents ALL the data
  var dataRange = sheet.getDataRange();
  var data = dataRange.getValues();
  for (var i = 1; i < data.length; ++i) {
    var row = data[i];
    var status =  row[1];
    
    if (status == READY_FOR_EMAIL) {
      sendEmails(row);
      
      sheet.getRange(i+1, 2).setValue(EMAIL_SENT);
      sheet.getRange(i+1, 11).setValue(Date());
      SpreadsheetApp.flush();
    }
  }
  Logger.log("Typo check - End" + Date())
}

// Send email out to the domain contact
function sendEmails(row) {
  var emailaddress =  row[9];
  var subject = "Typo Blaster Test Email";
  var message = "This is a test from the Typo Blaster";
  
  Logger.log(emailaddress)
  MailApp.sendEmail(emailaddress, subject, message); 
}