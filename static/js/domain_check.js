let CONFIG={MAIN_DOMAIN:"blog.itrf.cn",ALLOW_DOMAINS:["blog.itrf.cn","blog-eo.itrf.cn","blog-cf.itrf.cn","blog-esa.itrf.cn","blog-gh.itrf.cn","localhost"],BANNER:{LOCAL_MSG:["本地测试环境，正式站点：",""],MIRROR_MSG:["您正在访问官方镜像站，推荐访问","获取最新内容"],ILLEGAL_MSG:["当前域名未授权，可能是恶意镜像，请访问",""],LINK_TEXT:"主站",BG_COLOR:"#dc3545",TEXT_COLOR:"#ffffff"}};(()=>{try{if(void 0===window.document)throw new Error}catch(e){return document.body.innerHTML="<h1>请通过浏览器访问本页面</h1>",window.stop()}document.addEventListener("DOMContentLoaded",function(){let t=window.location.hostname;function e(t){if(!localStorage.getItem("domain_warning_closed")){let e=document.createElement("div");e.style.cssText=`
        background: ${CONFIG.BANNER.BG_COLOR};
        color: ${CONFIG.BANNER.TEXT_COLOR};
        padding: 12px;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 9999;
        text-align: center;
        font-family: sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
      `;var n=document.createElement("a"),o=(n.href="https://"+CONFIG.MAIN_DOMAIN,n.target="_blank",n.style.cssText=`
        color: ${CONFIG.BANNER.TEXT_COLOR};
        text-decoration: underline;
        font-weight: bold;
      `,n.textContent=CONFIG.BANNER.LINK_TEXT,document.createElement("button"));o.innerHTML="×",o.style.cssText=`
        background: transparent;
        border: none;
        color: ${CONFIG.BANNER.TEXT_COLOR};
        font-size: 24px;
        cursor: pointer;
        margin-left: 15px;
      `,o.onclick=()=>{e.remove(),localStorage.setItem("domain_warning_closed","1")},e.append(document.createTextNode(t[0]),n),t[1]&&e.append(document.createTextNode(t[1])),e.appendChild(o),document.body.appendChild(e)}}var n;n=t,CONFIG.ALLOW_DOMAINS.some(e=>new RegExp(`^${e.replace(/\./g,"\\.").replace(/\*/g,".*")}$`).test(n))?"localhost"===t||"127.0.0.1"===t?e(CONFIG.BANNER.LOCAL_MSG):t!==CONFIG.MAIN_DOMAIN&&e(CONFIG.BANNER.MIRROR_MSG):(e(CONFIG.BANNER.ILLEGAL_MSG),(()=>{var e;return"localhost"!==t&&((e=(new Error).stack).includes("toString@")||1024<e.length)})()&&window.location.replace("https://"+CONFIG.MAIN_DOMAIN))})})();