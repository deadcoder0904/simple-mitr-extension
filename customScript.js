function sequenceClass() {
  this.init = function() {
    const tClass = document.getElementsByClassName('t')
    for (var i = 0; i < tClass.length; i++) {
      tClass[i].style.boxShadow = '0px 0px 10px 2px #000000'
      tClass[i].setAttribute('aria-hidden', 'true')
      tClass[i].onclick = mouseEvent
    }
  }

  this.finalize = function() {
    let arr = []
    const tClass = document.getElementsByClassName('t')
    for (let i = 0; i < tClass.length; i++) {
      tClass[i].removeAttribute('super-script')
      tClass[i].style.boxShadow = ''
      const seq = tClass[i].getAttribute('data-seq')
      if (seq) {
        arr[seq] = tClass[i]
      }
    }
    let _htmlText = ''
    const pg1 = document.body.childNodes[0]
    for (var i = arr.length - 1; i >= 0; i--) {
      _htmlText = arr[i].innerText + '\n' + _htmlText
      pg1.parentNode.insertBefore(arr[i], pg1.nextSibling)
    }
    _htmlText = _htmlText.replace(/</g, '&lt;')
    _htmlText = _htmlText.replace(/>/g, '&gt;')
    const toFixText = [['ﬁ', 'fi'], ['ﬀ', 'ff'], ['ﬂ', 'fl']]
    for (let i = 0; i < toFixText.length; i++) {
      const _re = new RegExp(toFixText[i][0], 'g')
      _htmlText = _htmlText.replace(_re, toFixText[i][1])
    }
    let _jawread = document.getElementById('jawread')
    if (_jawread) {
      _jawread.parentNode.removeChild(_jawread)
    }
    _jawread = document.createElement('div')
    _jawread.id = 'jawread'
    _jawread.innerHTML = _htmlText
    _jawread.style.position = 'absolute'
    _jawread.style.left = '0px'
    _jawread.style.top = '0px'
    _jawread.style.opacity = '0'

    document.body.insertBefore(_jawread, document.body.firstChild)

    const _pgNum = parseInt(
      location.href
        .split('/')
        .reverse()[0]
        .split('.')[0],
    )
    const _pg1Overlay = document.getElementById('pg' + _pgNum + 'Overlay')
    if (_pg1Overlay) {
      _pg1Overlay.parentNode.removeChild(_pg1Overlay)
    }
    const _pg1Holder = document.getElementById('p' + _pgNum)
    if (_pg1Holder) {
      _pg1Holder.setAttribute('aria-hidden', 'true')
    }
  }

  function mouseEvent(e) {
    switch (e.type) {
      case 'click':
        const seq = this.getAttribute('data-seq')
        if (!seq) {
          doSequence(this)
        } else {
          resequence(this)
        }
        break
      default:
        break
    }
  }

  function resequence(_ref) {
    const seq = _ref.getAttribute('data-seq')
    console.log(seq + ' modify')
    const newId = prompt('Enter new id.')
    if (newId) {
      let arr = []
      const tClass = document.getElementsByClassName('t')
      for (let i = 0; i < tClass.length; i++) {
        let index = tClass[i].getAttribute('data-seq')
        if (index) {
          index = Number(index)
          arr[index] = tClass[i]
        }
      }
      arr.splice(newId, 0, arr.splice(Number(seq), 1)[0])
      for (let j = 0; j < arr.length; j++) {
        arr[j].setAttribute('data-seq', j)
        arr[j].setAttribute('super-script', j)
      }
    }
  }

  function doSequence(_ref) {
    let arr = []
    const tClass = document.getElementsByClassName('t')
    for (let i = 0; i < tClass.length; i++) {
      let index = tClass[i].getAttribute('data-seq')
      if (index) {
        index = Number(index)
        arr[index] = tClass[i]
      }
    }
    _ref.style.boxShadow = '0px 0px 10px 2px #FF0000'
    _ref.setAttribute('data-seq', arr.length)
    _ref.setAttribute('super-script', arr.length)
    console.log(arr.length + ': ' + _ref.innerText)
  }
}

const sequence = new sequenceClass()
window.sequence = sequence
module.exports = sequence
