let CountdownTimer=(()=>{let t=null,c=null,d={},n=!1,s={units:{day:{text:"今日",unit:"小时"},week:{text:"本周",unit:"天"},month:{text:"本月",unit:"天"},year:{text:"本年",unit:"天"}}};async function l(e){var t,n=await(await fetch(`https://timor.tech/api/holiday/year/${e}/`)).json(),a=[];for(t in n.holiday){var i=n.holiday[t];i.holiday&&a.push({name:i.name,date:new Date(i.date)})}return a.sort((e,t)=>e.date-t.date),a}async function a(){var n;if(d.eventName)try{var e=new Date,t=await(async()=>{if(!c){var e,t=new Date,n=(t.setHours(0,0,0,0),t.getFullYear());for(e of await l(n)){var a=new Date(e.date);if(a.setHours(0,0,0,0),t<=a)return c=e}n=await l(n+1);c=n[0]}return c})(),a=new Date,r=(a.setHours(0,0,0,0),new Date(t.date)),o=(r.setHours(0,0,0,0),Math.round((r-a)/864e5));d.eventName.textContent=t.name,d.eventDate.textContent=r.toLocaleDateString("zh-CN"),d.daysUntil.textContent=o;n=e;let i={day:()=>{var e=n.getHours();return{remaining:24-e,percentage:e/24*100}},week:()=>{var e=n.getDay(),e=0===e?6:e-1;return{remaining:6-e,percentage:(1+e)/7*100}},month:()=>{var e=new Date(n.getFullYear(),n.getMonth()+1,0).getDate(),t=n.getDate()-1;return{remaining:e-t,percentage:t/e*100}},year:()=>{var e=n.getFullYear(),t=new Date(e,0,1),e=(e=e)%4==0&&e%100!=0||e%400==0?366:365,t=Math.floor((n-t)/864e5);return{remaining:e-t,percentage:t/e*100}}};d.countRight.innerHTML=Object.entries(s.units).map(([e,{text:t,unit:n}])=>{var{remaining:e,percentage:a}=i[e]();return`
                    <div class="cd-count-item">
                        <div class="cd-item-name">${t}</div>
                        <div class="cd-item-progress">
                            <div class="cd-progress-bar" style="width:${a}%;opacity:${a/100}"></div>
                            <span class="cd-percentage ${46<=a?"cd-many":""}">${a.toFixed(2)}%</span>
                            <span class="cd-remaining ${60<=a?"cd-many":""}">
                            <span class="cd-tip">还剩</span>${e}<span class="cd-tip">${n}</span>
                            </span>
                        </div>
                    </div>
                    `}).join("")}catch(e){d.eventName.textContent="节日",d.eventDate.textContent="--",d.daysUntil.textContent="--"}}function e(){var e;t&&clearInterval(t),d={eventName:document.getElementById("eventName"),eventDate:document.getElementById("eventDate"),daysUntil:document.getElementById("daysUntil"),countRight:document.getElementById("countRight")},n||((e=document.createElement("style")).id="countdown-style",e.textContent=`
            .card-countdown .item-content { display:flex; }
            .cd-count-left { position:relative; display:flex; flex-direction:column; margin-right:.8rem; line-height:1.5; align-items:center; justify-content:center; }
            .cd-count-left .cd-text { font-size:14px; }
            .cd-count-left .cd-name { font-weight:bold; font-size:18px; }
            .cd-count-left .cd-time { font-size:30px; font-weight:bold; color:var(--anzhiyu-main); }
            .cd-count-left .cd-date { font-size:12px; opacity:.6; }
            .cd-count-left::after { content:""; position:absolute; right:-.8rem; width:2px; height:80%; background-color:var(--anzhiyu-main); opacity:.5; }

            .cd-count-right { flex:1; margin-left:.8rem; display:flex; flex-direction:column; justify-content:space-between; }
            .cd-count-item { display:flex; flex-direction:row; align-items:center; height:24px; }
            .cd-item-name { font-size:14px; margin-right:.8rem; white-space:nowrap; }

            .cd-item-progress { position:relative; display:flex; flex-direction:row; align-items:center; justify-content:space-between; height:100%; width:100%; border-radius:8px; background-color:var(--anzhiyu-background); overflow:hidden; }

            .cd-progress-bar { height:100%; border-radius:8px; background-color:var(--anzhiyu-main); }

            .cd-percentage, .cd-remaining { position:absolute; font-size:12px; margin:0 6px; transition:opacity .3s ease-in-out, transform .3s ease-in-out; }

            .cd-many { color:#fff; }

            .cd-remaining { opacity:0; transform:translateX(10px); }

            .card-countdown .item-content:hover .cd-remaining { transform:translateX(0); opacity:1; }

            .card-countdown .item-content:hover .cd-percentage { transform:translateX(-10px); opacity:0; }
        `,document.head.appendChild(e),n=!0),a(),t=setInterval(a,6e5)}return document.addEventListener("DOMContentLoaded",e),document.addEventListener("pjax:complete",e),document.addEventListener("pjax:send",()=>t&&clearInterval(t)),{start:e}})();