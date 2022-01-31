console.log('EXAM - Extension active')

// global object to store variables in
var AppObject = {
    'names': [],
    'updated': new Date().getTime()
};

function fetchStuff() {
    return new Promise((resolve) =>
    // Look up the names written to local storage by the BBB script
        chrome.storage.local.get(['names', 'updated'],
            (result) => {
                AppObject.names = result.names;
                AppObject.updated = result.updated;
                if(result.names) resolve(true);
                else resolve(false);
            }
    ));
}
const markNames = async function() {
    // Immediately quit if there is no table on this site
    if (!$('table').length) return;
    // Look up the new data
    if (!(await fetchStuff())) return
    // Loop over every row
    $('tbody > tr').each(function() {
        let currentName = '';
        // Loop over elements including the first name and last name
        $(this).find('td > span').each(function(index) {
            // Check if last update was more recent than 1 sec, if yes, simply remove mark and move on
            if (new Date().getTime() - AppObject.updated > 1500) {
                $(this).removeClass("markClass");
                return
            }
            // If first name add to current name
            if (index === 0) {
                currentName += $(this).text()
            }
            // If last name add to current name and perform check
            else if (index === 1) {
                currentName += ' ' + $(this).text();
                // Check if current name is in list of names
                // If yes, proceed marking, if no, remove mark
                if (AppObject.names.find(element => {
                        if (element.includes(currentName)) {
                            return true;
                        }
                    }))
                {
                    // If positive, mark name, if not, remove mark
                    $(this).addClass("markClass")
                }else {
                    $(this).removeClass("markClass")
                  }
            }
        })
    })
}
// Call markfunction immediately when page refreshes automatically
const callHelper = function() {
    if ($('.badge, .highlight').text().indexOf('0h 0m 0s') !== -1) markNames()
}
// Catch change on page
const observer = new MutationObserver(callHelper);
const config = { attributes: true, childList: true, subtree: true };
const targetNode = document.getElementsByTagName('body')
observer.observe(targetNode[0], config);

// Start interval, names are marked after every second
const interval = setInterval(function() {
    markNames();
}, 1000);

// Mark names after startup
markNames();