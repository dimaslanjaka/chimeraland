// ==UserScript==
// @name     	Crawler React
// @version  	1
// @grant    	none
// @include		http://adsense.webmanajemen.com:4000/chimeraland/*
// @match 		http://adsense.webmanajemen.com/*
// ==/UserScript==

;(function () {
  const done = []
  document.addEventListener('DOMContentLoaded', function (event) {
    const links = Array.from(document.querySelectorAll('a'))
    let running = false

    const crawl = () =>
      links.forEach((el) => {
        if (!done.includes(el.href) && !running) {
          running = true
          fetch(el.href)
            .then((res) => {
              if (res.status === 200) done.push(el.href)
            })
            .catch(noop)
            .finally(() => {
              running = false
            })
        }
      })

    setInterval(crawl, 1000)
  })
})()

function noop() {
  //
}
