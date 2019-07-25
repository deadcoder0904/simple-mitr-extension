// NOTE: FOR CROSS PLATFORM (CHROME & FIREFOX) COMPATIBILITY 👇
import browser from 'webextension-polyfill';
import sequence from './customScript';
import { checkmarkSVG, closeSVG, copySVG, downSVG, finalizeSVG, initSVG, resetSVG, upSVG } from './svg';

const html = document.getElementsByTagName('html')[0]
const head = document.getElementsByTagName('head')[0]
const body = document.getElementsByTagName('body')[0]
const ROOT_ID = 'simple-extension-12345'

const addElement = (parent, elementTag, elementId, elementClass, html) => {
  const newElement = document.createElement(elementTag)
  newElement.setAttribute('id', elementId)
  newElement.setAttribute('class', elementClass)
  newElement.innerHTML = html
  parent.appendChild(newElement)
}

const insertUI = () => {
  const div = document.createElement('div')
  div.setAttribute('id', ROOT_ID)
  body.appendChild(div)

  addElement(
    div,
    'button',
    'move',
    'box',
    `<span class="show-down">${downSVG}${upSVG}</span><span>Move</span>`,
  )
  addElement(
    div,
    'button',
    'sequence-init',
    'box',
    `${initSVG}<span>sequence.init()</span>`,
  )
  addElement(
    div,
    'button',
    'sequence-finalize',
    'box',
    `${finalizeSVG}<span>sequence.finalize()</span>`,
  )
  addElement(
    div,
    'button',
    'copy-html',
    'box',
    `${copySVG}<span>Copy HTML</span>`,
  )
  addElement(div, 'button', 'reset', 'box', `${resetSVG}<span>Reset</span>`)
  addElement(div, 'button', 'close', 'box', `${closeSVG}<span>Close</span>`)
}

const removeUI = () => {
  document.getElementById(ROOT_ID).remove()
}

const addClickHandlers = () => {
  const rootDiv = document.querySelector(`#${ROOT_ID}`)
  const move = document.querySelector(`#${ROOT_ID}>#move`)
  const sequenceInit = document.querySelector(`#${ROOT_ID}>#sequence-init`)
  const sequenceFinalize = document.querySelector(
    `#${ROOT_ID}>#sequence-finalize`,
  )
  const copyHTML = document.querySelector(`#${ROOT_ID}>#copy-html`)
  const reset = document.querySelector(`#${ROOT_ID}>#reset`)
  const close = document.querySelector(`#${ROOT_ID}>#close`)

  move.addEventListener('click', function() {
    rootDiv.classList.toggle('move-top-bottom')
    const span = move.querySelector('span')
    span.classList.toggle('show-down')
  })

  sequenceInit.addEventListener('click', function() {
    sequence.init()
  })

  sequenceFinalize.addEventListener('click', function() {
    sequence.finalize()
  })

  copyHTML.addEventListener('click', function() {
    // DONE: Copy HTML to Clipboard by creating empty textarea
    const tempInput = document.createElement('textarea')
    tempInput.style = 'position: absolute; left: -1000px; top: -1000px'
    const html = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n${
      document.querySelector('html').outerHTML
    }`
    tempInput.value = html
    document.body.appendChild(tempInput)
    tempInput.select()
    document.execCommand('copy')
    document.body.removeChild(tempInput)

    // TODO: Show ToolTip
    copyHTML.innerHTML = `${checkmarkSVG}<span>Copied</span>`
    setTimeout(() => {
      copyHTML.innerHTML = `${copySVG}<span>Copy HTML</span>`
    }, 1000)
  })

  reset.addEventListener('click', function() {
    window.location.reload()
  })

  close.addEventListener('click', function() {
    removeUI()
  })
}

const main = () => {
  browser.runtime.onMessage.addListener(function(
    request,
    sender,
    sendResponse,
  ) {
    if (request.subject === 'isUIAdded?') {
      const id = document.getElementById(ROOT_ID)
      if (id === null) {
        insertUI()
        addClickHandlers()
      } else removeUI()
    }
  })
  /*
  // DONE: Insert script into page so it has access in console
  const script = document.createElement('script')
  script.src = browser.runtime.getURL('customScript.js')
  script.onload = function() {
    this.remove()
  }
  ;(document.head || document.documentElement).appendChild(script)
  */
}

main()
