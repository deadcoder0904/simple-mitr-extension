import browser from 'webextension-polyfill'

let hasExecutedOnce = false

function addUI(tabId) {
  browser.tabs.sendMessage(tabId, {
    from: 'background',
    subject: 'isUIAdded?',
  })
}

browser.browserAction.onClicked.addListener(function(tab) {
  if (!hasExecutedOnce) {
    browser.tabs
      .executeScript(tab.id, {
        file: 'contentScript.js',
      })
      .then(function() {
        addUI(tab.id)
      })

    browser.tabs.insertCSS(tab.id, {
      file: 'style.css',
    })

    hasExecutedOnce = true
  }
  addUI(tab.id)
})
