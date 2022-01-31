console.log('BBB - Extension active')
let interval = undefined;

function setNames() {
  let names = [];
  // Loop over every user element in the conference sidebar
  $("[id*='user-w']").each(function() {
    // Check if the camera icon is there, if yes, add the name of the participant to the list
    if ($(this).find("[class='icon-bbb-video']").length !== 0) {
      names.push($.trim($(this).find("[class*='userNameMain-'] > span").text()))
    }
  });
  // Write the names to local storage and set the time of the last write
  chrome.storage.local.set({'names': names}, function() {});
  chrome.storage.local.set({'updated': new Date().getTime()})
}
// Run function after every second
function startInterval() {
  interval = setInterval(function() {
    setNames();
  }, 1000);
}
// Receive messages from the little on and off switch of the extension menu
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // check if it is the right message
  if (message.action === "setActive") {
    // if extension is supposed to work, start interval
    if (message.data) {
      if (!interval) startInterval()
    }
      else {
        clearInterval(interval)
        interval = false
      }
    }
  // this is just to not throw a runtime error "no response was received"
  sendResponse(true)
});