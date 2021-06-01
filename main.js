(async ()=>{
    /* IFrame crap */
    class IFrame {
        iframe = null

        constructor(src=undefined, visible=false) {
            this.iframe = document.createElement("iframe");
            this.iframe.className = "iframe-container";
            if (src)
                this.setSource(src);
            if (visible)
                this.setVisible(visible)
        }

        setSource(src) {
            this.iframe.src = src;
        }

        setVisible(visible) {
            if (visible)
                document.body.appendChild(this.iframe);
            else
                this.iframe.parentNode.removeChild(this.iframe);
        }
    }

    /* itexamanswers.net crap */
    const ITEAgetResultsRegEX = /(?:title front-view-title)(?:.*?)(?:href=")(.*?)(?:")/gm

    function ITEAparseFirstResult(html) {
        let matches = [...html.matchAll(ITEAgetResultsRegEX)]
        if (matches.length < 1)
            return undefined;
        return matches[0][1];
    }

    /* cisco test crap */
    function CISCOgetQuestion() {
        return document.getElementById("question").innerText.trimStart().trimEnd();
    }

    /* other*/
    function URLObjectFromHTML(html) {
        return URL.createObjectURL(new Blob([html], {type: 'text/html'}))
    }

    function httpRequest(url, method) {
        let req = new XMLHttpRequest();
        return new Promise((res, rej)=>{
            req.addEventListener("load", function() {res(this)});
            req.addEventListener("error", function() {rej(this)});

            req.open(method, url);
            req.send(null);
        });
    }

    function insertStringAtIdx(idx, oStr, insStr) {
        return oStr.slice(0, idx) + insStr + oStr.slice(idx);
    }

    /* code that glues above together */
    let iframe = new IFrame(undefined, true)
    let res = await httpRequest(`https://itexamanswers.net/?s=${CISCOgetQuestion()}`, "GET")
    let url = ITEAparseFirstResult(res.responseText);
    res = await httpRequest(url, "GET");
    let idx = res.response.search(CISCOgetQuestion());
    let str = insertStringAtIdx(idx, res.response, `<a id="jumphere"></a><script>window.location.hash="jumphere"</script>"`)
    console.log(idx)
    iframe.setSource(URLObjectFromHTML(str))

    /*new IFrame(URLObjectFromHTML(res.response), true)*/
    /*let iframe = new IFrame(`https://itexamanswers.net/?s=${getQuestion()}`, true);
    setTimeout(()=>iframe.setVisible(false), 2000);
    setTimeout(()=>iframe.setVisible(true), 4000);*/
})();