// 窗口宽度跨越992断点时自动刷新页面，确保PC/移动端的结构（Swiper）与CSS同步切换
var xf_is_wide=window.innerWidth>=992
window.addEventListener('resize',function(){
    var xf_wide_now=window.innerWidth>=992
    if(xf_wide_now!==xf_is_wide){
        xf_is_wide=xf_wide_now
        location.reload()
    }
})
$(window).on('load',function handlePreloader(){
    if($('.xf_load').length){
    $('.xf_load').delay(2000).fadeOut(1800)
    }
    })
    var swiper=new Swiper(".xf_ico_banner",{
    navigation:{
    nextEl:".swiper-button-next-ico",
    prevEl:".swiper-button-prev-ico",
    },
    })
    var modal=document.getElementById('myModal')
    var img=document.getElementById('xf_wxImg')
    var modalImg=document.getElementById("img01")
    var captionText=document.getElementById("caption")
    img.onclick=function(){
    modal.style.display="block"
    modalImg.src=this.src
    captionText.innerHTML=this.alt
    }
    var span=document.getElementsByClassName("close")[0]
    span.onclick=function(){
    modal.style.display='none'
    }
    const hours=document.querySelector(".hours")
    const minutes=document.querySelector(".minutes")
    const seconds=document.querySelector(".seconds")
    clock=()=>{
    let today=new Date()
    let h=(today.getHours()%12)+today.getMinutes()/59;
    let m=today.getMinutes()
    let s=today.getSeconds()
    h*=30
    m*=6
    s*=6
    rotation(hours,h)
    rotation(minutes,m)
    rotation(seconds,s)
    setTimeout(clock,500)
    }
    rotation=(target,val)=>{
    target.style.transform=`rotate(${val}deg)`
    }
    window.onload=clock()
    function xfppp(s){
    return s<10?'0'+s:s;
    }
    $(function(){
    var xf_time=new Date
    var xf_hour=xf_time.getHours()+':'
    var xf_branch=xf_time.getMinutes()
    var myDate=new Date
    var xf_year=myDate.getFullYear()
    var xf_mon=myDate.getMonth()+1;
    var xf_date=myDate.getDate()
    var xf_week=new Date
    var week=xf_week.getDay()
    var weeks=['星期天','星期一','星期二','星期三','星期四','星期五','星期六']
    $(".xf_time_1").html(xf_hour+xfppp(xf_branch))
    $(".xf_time_2").html(xf_year+"年"+xfppp(xf_mon)+"月"+xfppp(xf_date)+"日 ")
    $(".xf_time_3").html(weeks[week])
    })
    function getClick(event){
    if(event.button==2){
    swal('为了不影响页面美观, 这边禁用您了您的右键！')
    document.oncontextmenu=new Function('event.returnValue=false;')
    }
    }
    $('.xf_zhuanfa').click(function(){
    window.open('https://blog.itrf.cn/about/', '_blank')
    })
    // 底部面板切换：按钮 class -> 面板 class（新增面板时在这里加一行映射即可）
    let xf_tab_map={but_site:'xf_site',but_works:'xf_works',but_fortune:'xf_fortune'}
    let xf_bottom_panels=document.querySelectorAll('.center_bottom > div')
    Object.keys(xf_tab_map).forEach(function(xf_key){
    let xf_btn=document.querySelector('.'+xf_key)
    if(!xf_btn)return
    xf_btn.addEventListener('click',function(){
    xf_bottom_panels.forEach(function(xf_panel){xf_panel.style.display='none'})
    document.querySelector('.'+xf_tab_map[xf_key]).style.display='block'
    })
    })
    // 今日运势随机：按日期生成，同一天内刷新数值不变（想每次刷新都变，把 xf_seed 改成 Date.now() 即可）
    // 注意：本文件代码习惯省略分号，这里行首必须加分号，否则会被解析为对上一条语句返回值的调用
    ;(function(){
    var xf_day=new Date()
    var xf_seed=xf_day.getFullYear()*10000+(xf_day.getMonth()+1)*100+xf_day.getDate()
    var xf_rand=function(xf_i){
    var xf_x=Math.sin(xf_seed*12.9898+xf_i*78.233)*43758.5453
    return xf_x-Math.floor(xf_x)
    }
    var xf_ems=document.querySelectorAll('.Today_Fortune li em')
    var xf_scores=[]
    xf_ems.forEach(function(xf_em,xf_i){
    var xf_score=Math.round((xf_rand(xf_i)*81+19)/5)*5
    xf_em.style.width=xf_score+'%'
    xf_scores.push(xf_score)
    })
    var xf_star_el=document.querySelector('.xf_fortune h4 span')
    if(xf_star_el&&xf_scores.length){
    var xf_star_num=Math.max(1,Math.round(xf_scores[0]/20))
    xf_star_el.innerHTML='★'.repeat(xf_star_num)+'☆'.repeat(5-xf_star_num)
    }
    })()
    var url="https://api.injahow.cn/meting/?server=netease&type=playlist&id=17514566321";
    var musicInfo=[]
    var nowmusic=''
    var audio=$("<audio />")
    var musicimg=$("<img>")
    var song=$("<div></div>")
    var auther=$("<div></div>")
    var isPaused=false
    var isMuted=false
    var len=0
    var nowloca=0
    var volume=1
    function init(){
    $.ajax({
    url:url,
    type:"get",
    dataType:'json',
    success:function(res){
    audio.attr("autoplay","autoplay")
    audio.attr("src",res[0].url)
    $(".musicbox").append(audio)
    musicimg.attr("src",res[0].pic)
    musicimg.addClass("musicimg")
    $(".music-img").append(musicimg)
    auther.text(res[0].author)
    auther.addClass("auther")
    song.text(res[0].title)
    song.addClass("name")
    $(".music-info").append(song)
    $(".music-info").append(auther)
    len=res.length
    nowloca=1
    musicInfo=res
    nowmusic=res[0]
    }
    })
    }
    $('#icon-rotate').click(()=>{
    $('.xf_right_box ').css('transform','rotateY(180deg)')
    $('.xf_music_box').css('display','none')
    $('.xf_friends').css('display','block')
    })
    $('#xf-friend-rotate').click(()=>{
    $('.xf_right_box ').css('transform','rotateY(0deg)')
    $('.xf_music_box').css('display','block')
    $('.xf_friends').css('display','none')
    })
    $(function(){
    init()
    setTimer()
    // 确保进度条和音量条事件已经绑定
    })
    // 旗下站点/作品展示：按每4个一组分包成轮播页（PC一行4个，手机2×2一页4个）
    function xfBuildGroupSwiper(xfUlSel, xfSwiperClass){
    $(xfUlSel).each(function(){
    var xfUl=$(this)
    var xfItems=xfUl.children('li').toArray()
    if(!xfItems.length)return
    var xfWrap=$('<div class="swiper-wrapper"></div>')
    for(var xfI=0;xfI<xfItems.length;xfI+=4){
    var xfPage=$('<div class="swiper-slide"></div>')
    var xfGroupUl=$('<ul class="'+xfUl.attr('class')+' xf_group_list"></ul>')
    xfGroupUl.append(xfItems.slice(xfI,xfI+4))
    xfPage.append(xfGroupUl)
    xfWrap.append(xfPage)
    }
    var xfBox=$('<div class="swiper '+xfSwiperClass+'"></div>')
    xfBox.append(xfWrap)
    xfBox.append('<div class="swiper-button-prev"></div><div class="swiper-button-next"></div>')
    xfUl.replaceWith(xfBox)
    new Swiper(xfBox[0],{
    nested:true,
    navigation:{nextEl:xfBox.find('.swiper-button-next')[0],prevEl:xfBox.find('.swiper-button-prev')[0]}
    })
    })
    }
    $(function(){
    xfBuildGroupSwiper('.web_site','xf_site_swiper')
    xfBuildGroupSwiper('.web_works','xf_works_swiper')
    })
    function ProgressBar(){
    var duration=audio.prop("duration")
    var currentTime=audio.prop("currentTime")
    let m=parseInt(duration/60)
    let s=parseInt(duration%60)
    let sm=parseInt(currentTime/60)
    let ss=parseInt(currentTime%60)
    if(s>9){
    let end='0'+m+':'+s
    $(".end").text(end)
    }else{
    let end='0'+m+':0'+s
    $(".end").text(end)
    }
    if(sm>0){
    if(ss>9){
    let runtime='0'+sm+':'+ss
    $(".start").text(runtime)
    }else{
    let runtime='0'+sm+':0'+ss
    $(".start").text(runtime)
    }
    }else{
    if(ss>9){
    let runtime='0'+sm+':'+ss
    $(".start").text(runtime)
    }else{
    let runtime='0'+sm+':0'+ss
    $(".start").text(runtime)
    }
    }
    let width=$(".running").css("width")
    let rate=currentTime/duration
    width=parseFloat(width)*parseFloat(rate)
    $(".running1").css("width",parseInt(width))
    if(duration && currentTime && duration === currentTime){
        // 歌曲播放结束，自动播放下一首
        nextMusic();
    }
    }
    function replayMusic(){
    audio.prop("src",nowmusic.url)
    musicimg.prop("src",nowmusic.pic)
    auther.text(nowmusic.author)
    song.text(nowmusic.title)
    }
    var bool
    function pauseMusic(){
    if(isPaused){
    audio[0].play()
    musicimg.css("animation-play-state","running")
    $("#pause").html("&#xe638;")
    bool=true
    }else{
    audio[0].pause()
    musicimg.css("animation-play-state","paused")
    $("#pause").html("&#xea82;")
    bool=false
    }
    isPaused=!isPaused
    }
    if(bool===false){
    console.log(111);
    $('#music-img').css('animationPlayState','paused')
    }
    function muteMusic(){
    var player=document.getElementsByTagName("audio")
    if(isMuted){
    player[0].muted=false
    $("#mute").html("&#xe64c;")
    }else{
    player[0].muted=true
    $("#mute").html("&#xe65e;")
    }
    isMuted=!isMuted
    }
    function preMusic(){
    if(nowloca==1){
    swal("这是第一首歌曲了！")
    }else{
    nowloca=nowloca-1
    nowmusic=musicInfo[nowloca-1]
    audio.prop("src",nowmusic.url)
    musicimg.prop("src",nowmusic.pic)
    auther.text(nowmusic.author)
    song.text(nowmusic.title)
    }
    }
    function nextMusic(){
    if(nowloca==len){
    swal("这是最后一首歌曲了！")
    }else{
    nowmusic=musicInfo[nowloca]
    audio.prop("src",nowmusic.url)
    musicimg.prop("src",nowmusic.pic)
    auther.text(nowmusic.author)
    song.text(nowmusic.title)
    nowloca=nowloca+1
    }
    }
    // 修复音量条点击事件
    $("body").on("click", ".vulmeBar", function(e){
        let x = e.offsetX;
        let y = e.offsetY;
        if(x >= 0 && x <= 100 || y <= 0){
            volume = x / 100;
            audio.prop("volume", volume);
            $(".vulmeBar1").css("width", volume * 100);
        }
    });
    
    // 修复进度条点击事件
    $("body").on("click", ".running", function(e){
        let x = e.offsetX;
        let y = e.offsetY;
        var duration = audio.prop("duration");
        // 获取进度条的实际宽度
        let barWidth = $(this).width();
        if(x >= 0 && x <= barWidth || y <= 0){
            let l = x / barWidth;
            let time = l * duration;
            audio.prop("currentTime", time);
            $(".running1").css("width", x);
        }
    });
    
    // 兼容原有的函数调用
    function changeVulme(e){
        // 函数保留以确保兼容性
    }
    
    function changeProgress(){
        // 函数保留以确保兼容性
    }
    function setTimer(){
    setInterval(()=>{
    ProgressBar()
    if($(".vulme").css("width")==='60px'){
    $(".vulmeBar").css("width",100)
    $(".vulmeBar1").css("width",volume*100)
    }else{
    $(".vulmeBar").css("width",0)
    $(".vulmeBar1").css("width",0)
    }
    },1000)
    }
    // 获取天气信息
    function getWeather() {
        $.ajax({
            url: "https://api.bugpk.com/api/weather",
            type: "get",
            dataType: "json",
            crossDomain: true,
            success: function(res) {
                if (res.code === 200) {
                    // 根据API返回的实际数据结构更新字段映射
                    const city = res.cityInfo?.city || '未知城市';
                    const temp = res.data?.wendu || '--';
                    const quality = res.data?.quality || '--';
                    const ganmao = res.data?.ganmao || '--';

                    // 更新天气信息
                    $('.location').text('你好，来自' + city + '的朋友');
                    $('.temp').text('今天气温' + temp + '°C'+ '，' +'空气质量' + quality );
                    $('.desc').text(ganmao);
                } else {
                    // 该免费接口偶发返回"获取失败"，10秒后重试，最多5次
                    xfWeatherRetry()
                }
            },
            error: function() {
                xfWeatherRetry()
            }
        });
    }
    var xf_weather_retry=0
    function xfWeatherRetry(){
    if(xf_weather_retry<5){
    xf_weather_retry++
    setTimeout(getWeather,10000)
    }
    }
    // 页面加载完成后获取天气
    $(document).ready(function() {
        getWeather();
        // 每小时更新一次天气
        setInterval(getWeather, 3600000);
    });
    let xf_now_width1=document.body.clientWidth
    let xf_now_width2=window.screen.width
    if(xf_now_width1<992||xf_now_width2<992){
    $('.big_box').addClass('swiper mySwiper')
    $('.main_content').addClass('swiper-wrapper')
    $('.slidebox').addClass('swiper-slide')
    $('#icon-rotate').click(()=>{
    $('.xf_right_box ').css('transform','rotateY(360deg)')
    $('.xf_music_box').css('display','none')
    $('.xf_friends').css('display','block')
    })
    $('#xf-friend-rotate').click(()=>{
    $('.xf_right_box ').css('transform','rotateY(0deg)')
    $('.xf_music_box').css('display','block')
    $('.xf_friends').css('display','none')
    })
    }
    var swiper=new Swiper(".mySwiper",{
    pagination:'.home-slide .swiper-pagination',
    initialSlide:1,
    observer:true,
    observeParents:true,
    paginationClickable:true,
    pagination:{
    el:".xf-swiper-pagination",
    clickable:true,
    },
    watchSlidesProgress:true,
    slidesPerView:1,
    });
    function orient(){
    if(window.orientation==0||window.orientation==180){
    $("body").attr("class","portrait");
    orientation='portrait';
    return false;
    }
    else if(window.orientation==90||window.orientation==-90){
    $("body").attr("class","landscape");
    orientation='landscape';
    return false;
    }
    }
    $(function(){
    orient();
    });
    $(window).bind('orientationchange',function(e){
    orient();
    })
