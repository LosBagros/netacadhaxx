(async ()=>{
    /* IFrame crap */
    class IFrame {
        iframe = null;
        visible = false;

        constructor(src=undefined, visible=false) {
            this.iframe = document.createElement("iframe");
            this.iframe.style = "position: fixed; top: 10vw; right: 1vw; width: 45vw; height: 45vh;";
            if (src)
                this.setSource(src);
            this.visible = visible;
            if (visible)
                this.setVisible(visible)
        }

        setSource(src) {
            this.iframe.src = src;
        }

        setVisible(visible) {
            this.visible = visible;
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
        if (fyzsdebugpage == 121)
            return document.getElementById("question").innerText.trimStart().trimEnd();
        for (const e of document.getElementsByClassName("question")) {
            if (!e.className.includes("hidden")) {
                return e.getElementsByClassName("mattext")[0].innerText.trimStart().trimEnd();
            }
        }
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

    let iframe = new IFrame();

    async function handleActivation(k) {
        if (iframe.visible) {
            iframe.setVisible(false);
        } else {
            iframe.setVisible(true);
            let str;
            try {
                iframe.setSource(URLObjectFromHTML(CISCOgetQuestion()))
                let res = await httpRequest(`https://itexamanswers.net/?s=${encodeURIComponent(CISCOgetQuestion())}`, "GET")
                let url = ITEAparseFirstResult(res.responseText);
                if (url) {
                    res = await httpRequest(url, "GET");
                    let idx = res.response.indexOf(CISCOgetQuestion());
                    str = insertStringAtIdx(idx, res.response, `<a id="jumphere"></a>`);
                    str += `<script>window.location.hash="jumphere"</script>`;
                } else {
                    return iframe.setSource(`https://google.com/search?q=${CISCOgetQuestion()}`)
                }
            } catch (error) {
                str = `${error.name}<br>${error.message}`;
            }
            iframe.setSource(URLObjectFromHTML(str));
        }
    }

    document.addEventListener("keypress", (k)=>{
        if (k.key == ".")
            handleActivation();
    });

    let t = null;
    let didActivate = false;

    document.addEventListener("mousedown", (ev) =>{
        if (ev.button == 2) {
            t = setTimeout(()=>{
                didActivate = true;
                handleActivation();
            }, 1000);
        }
    })

    document.oncontextmenu = (ev) => {
        clearTimeout(t);
        let o = didActivate;
        didActivate = false;
        if (o)
            return false;
    }
})();