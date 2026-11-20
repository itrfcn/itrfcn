window.IP_CONFIG={BLOG_LOCATION:{lng:119.76,lat:36.35},CACHE_DURATION:36e5,HOME_PAGE_ONLY:!1,TENCENT_MAP_KEY:"W4QBZ-KEPLL-WCPPR-ENDVU-I4NNO-KKB4G"};let insertAnnouncementComponent=()=>{document.querySelectorAll(".card-widget.card-announcement").length&&document.querySelector("#welcome-info")&&fetchIpInfo()},getWelcomeInfoElement=()=>document.querySelector("#welcome-info"),fetchIpData=()=>new Promise((t,n)=>{let o="tencentMapCallback_"+Math.random().toString(36).substr(2,9),a=(window[o]=function(e){delete window[o],document.body.removeChild(a),0!==e.status?n(new Error(e.message||"IP定位失败")):t({ip:(e=e.result).ip||"",data:{lng:Number(e.location.lng),lat:Number(e.location.lat),country:e.ad_info.nation,prov:e.ad_info.province,city:e.ad_info.city}})},document.createElement("script"));a.src=`https://apis.map.qq.com/ws/location/v1/ip?key=${IP_CONFIG.TENCENT_MAP_KEY}&output=jsonp&callback=`+o,a.onerror=()=>{delete window[o],document.body.removeChild(a),n(new Error("网络请求失败或被拦截"))},document.body.appendChild(a)}),showWelcome=({data:e,ip:t})=>{if(!e)return showErrorMessage();var{lng:e,lat:n,country:o,prov:a,city:r}=e,i=getWelcomeInfoElement();i&&(e=calculateDistance(e,n),n=formatIpDisplay(t),t=formatLocation(o,a,r),i.style.display="block",i.style.height="auto",i.innerHTML=generateWelcomeMessage(t,e,n,o,a,r))},calculateDistance=(e,t)=>{var n=Math.PI/180,o=(t-IP_CONFIG.BLOG_LOCATION.lat)*n,e=(e-IP_CONFIG.BLOG_LOCATION.lng)*n,o=Math.sin(o/2)*Math.sin(o/2)+Math.cos(IP_CONFIG.BLOG_LOCATION.lat*n)*Math.cos(t*n)*Math.sin(e/2)*Math.sin(e/2);return Math.round(12742*Math.atan2(Math.sqrt(o),Math.sqrt(1-o)))},formatIpDisplay=e=>e.includes(":")?`<span class="ipv6-text">${e}</span>`:e,formatLocation=(e,t,n)=>e?"中国"===e?t+" "+n:e:"神秘地区",generateWelcomeMessage=(e,t,n,o,a,r)=>`
    欢迎来自 <b>${e}</b> 的小友💖<br>
    你当前距博主约 <b>${t}</b> 公里！<br>
    你的IP地址：<b class="ip-address">${n}</b><br>
    ${getTimeGreeting()}<br>
    Tip：<b>${getGreeting(o,a,r)}🍂</b>
`,addStyles=()=>{var e=document.createElement("style");e.textContent=`
        #welcome-info {
            user-select: none;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 212px;
            padding: 10px;
            margin-top: 5px;
            border-radius: 12px;
            background-color: var(--anzhiyu-background);
            outline: 1px solid var(--anzhiyu-card-border);
        }
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top: 3px solid var(--anzhiyu-main);
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .ip-address {
            filter: blur(5px);
            transition: filter 0.3s ease;
            display: inline-block; /* 保证滤镜和换行生效 */
        }
        .ip-address:hover {
            filter: blur(0);
        }
        /* 新增专门针对 IPv6 的样式 */
        .ipv6-text {
            font-size: 0.85em; /* 稍微缩小一点字体 */
            word-break: break-all; /* 允许在任意字符间换行 */
            white-space: normal;
        }
        .error-message {
            color: #ff6565;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .error-message p,
        .permission-dialog p {
            margin: 0;
        }
        .error-icon {
            font-size: 3rem;
        }
        #retry-button {
            margin: 0 5px;
            color: var(--anzhiyu-main);
            transition: transform 0.3s ease;
        }
        #retry-button:hover {
            transform: rotate(180deg);
        }
        .permission-dialog {
            text-align: center;
        }
        .permission-dialog button {
            margin: 10px 5px;
            padding: 5px 10px;
            border: none;
            border-radius: 5px;
            background-color: var(--anzhiyu-main);
            color: white;
            transition: opacity 0.3s ease;
        }
        .permission-dialog button:hover {
            opacity: 0.8;
        }
    `,document.head.appendChild(e)},checkLocationPermission=()=>"granted"===localStorage.getItem("locationPermission"),saveLocationPermission=e=>{localStorage.setItem("locationPermission",e)},showLocationPermissionDialog=()=>{var e=document.getElementById("welcome-info");e&&(e.innerHTML=`
        <div class="permission-dialog">
            <div class="error-icon">❓</div>
            <p>是否允许访问您的位置信息？</p>
            <button data-action="allow">允许</button>
            <button data-action="deny">拒绝</button>
        </div>
    `,e.addEventListener("click",e=>{e&&e.target&&"BUTTON"===e.target.tagName&&(e="allow"===e.target.dataset.action?"granted":"denied",handleLocationPermission(e))}))},handleLocationPermission=e=>{saveLocationPermission(e),"granted"===e?(showLoadingSpinner(),fetchIpInfo()):showErrorMessage("您已拒绝访问位置信息")},showLoadingSpinner=()=>{var e=document.querySelector("#welcome-info");e&&(e.innerHTML='<div class="loading-spinner"></div>')},IP_CACHE_KEY="ip_info_cache",getIpInfoFromCache=()=>{var e,t=localStorage.getItem(IP_CACHE_KEY);return t?({data:t,timestamp:e}=JSON.parse(t),Date.now()-e>IP_CONFIG.CACHE_DURATION?(localStorage.removeItem(IP_CACHE_KEY),null):t):null},setIpInfoCache=e=>{localStorage.setItem(IP_CACHE_KEY,JSON.stringify({data:e,timestamp:Date.now()}))},fetchIpInfo=async()=>{if(checkLocationPermission()){showLoadingSpinner();var e=getIpInfoFromCache();if(e)showWelcome(e);else try{var t=await fetchIpData();setIpInfoCache(t),showWelcome(t)}catch(e){console.error("获取IP信息失败:",e),showErrorMessage()}}else showLocationPermissionDialog()},greetings={"中国":{"北京市":"北——京——欢迎你~~~","天津市":"讲段相声吧","河北省":"山势巍巍成壁垒，天下雄关铁马金戈由此向，无限江山","山西省":"展开坐具长三尺，已占山河五百余","内蒙古自治区":"天苍苍，野茫茫，风吹草低见牛羊","辽宁省":"我想吃烤鸡架！","吉林省":"状元阁就是东北烧烤之王","黑龙江省":"很喜欢哈尔滨大剧院","上海市":"众所周知，中国只有两个城市","江苏省":{"南京市":"这是我挺想去的城市啦","苏州市":"上有天堂，下有苏杭","其他":"散装是必须要散装的"},"浙江省":{"杭州市":"东风渐绿西湖柳，雁已还人未南归","其他":"望海楼明照曙霞,护江堤白蹋晴沙"},"河南省":{"郑州市":"豫州之域，天地之中","信阳市":"品信阳毛尖，悟人间芳华","南阳市":"臣本布衣，躬耕于南阳此南阳非彼南阳！","驻马店市":"峰峰有奇石，石石挟仙气嵖岈山的花很美哦！","开封市":"刚正不阿包青天","洛阳市":"洛阳牡丹甲天下","其他":"可否带我品尝河南烩面啦？"},"安徽省":"蚌埠住了，芜湖起飞","福建省":"井邑白云间，岩城远带山","江西省":"落霞与孤鹜齐飞，秋水共长天一色","山东省":"遥望齐州九点烟，一泓海水杯中泻","湖北省":{"黄冈市":"红安将军县！辈出将才！","其他":"来碗热干面~"},"湖南省":"74751，长沙斯塔克","广东省":{"广州市":"看小蛮腰，喝早茶了嘛~","深圳市":"今天你逛商场了嘛~","阳江市":"阳春合水！博主家乡~ 欢迎来玩~","其他":"来两斤福建人~"},"广西壮族自治区":"桂林山水甲天下","海南省":"朝观日出逐白浪，夕看云起收霞光","四川省":"康康川妹子","贵州省":"茅台，学生，再塞200","云南省":"玉龙飞舞云缠绕，万仞冰川直耸天","西藏自治区":"躺在茫茫草原上，仰望蓝天","陕西省":"来份臊子面加馍","甘肃省":"羌笛何须怨杨柳，春风不度玉门关","青海省":"牛肉干和老酸奶都好好吃","宁夏回族自治区":"大漠孤烟直，长河落日圆","新疆维吾尔自治区":"驼铃古道丝绸路，胡马犹闻唐汉风","台湾省":"我在这头，大陆在那头","香港特别行政区":"永定贼有残留地鬼嚎，迎击光非岁玉","澳门特别行政区":"性感荷官，在线发牌","其他":"带我去你的城市逛逛吧！"},"美国":"Let us live in peace!","日本":"よろしく、一緒に桜を見ませんか","俄罗斯":"干了这瓶伏特加！","法国":"C'est La Vie","德国":"Die Zeit verging im Fluge.","澳大利亚":"一起去大堡礁吧！","加拿大":"拾起一片枫叶赠予你","其他":"带我去你的国家逛逛吧"},getGreeting=(e,t,n)=>{e=greetings[e]||greetings["其他"];return"string"==typeof e?e:"string"==typeof(t=e[t]||e["其他"])?t:t[n]||t["其他"]||e["其他"]},getTimeGreeting=()=>{var e=(new Date).getHours();return e<11?"早上好🌤️ ，一日之计在于晨":e<13?"中午好☀️ ，记得午休喔~":e<17?"下午好🕞 ，饮茶先啦！":e<19?"即将下班🚶‍♂️，记得按时吃饭~":"晚上好🌙 ，夜生活嗨起来！"},showErrorMessage=(e="抱歉，无法获取信息")=>{var t=document.getElementById("welcome-info");t&&(t.innerHTML=`
        <div class="error-message">
            <div class="error-icon">😕</div>
            <p>${e}</p>
            <p>请<i id="retry-button" class="fa-solid fa-arrows-rotate" style="cursor:pointer;"></i>重试或检查网络连接</p>
        </div>
    `,t=document.getElementById("retry-button"))&&t.addEventListener("click",fetchIpInfo)},isHomePage=()=>"/"===window.location.pathname||"/index.html"===window.location.pathname;document.addEventListener("DOMContentLoaded",()=>{addStyles(),insertAnnouncementComponent(),document.addEventListener("pjax:complete",insertAnnouncementComponent)});