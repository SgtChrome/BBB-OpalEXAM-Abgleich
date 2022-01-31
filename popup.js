console.log('test')
window.onload = function() {
    document.getElementById('checkbox').addEventListener('change', function(e) {
        console.log(document.getElementById('checkbox').checked);
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "setActive", data: document.getElementById('checkbox').checked}, function() {});
        })
    })
}
