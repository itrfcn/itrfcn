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
    window.location.href = 'https://blog.itrf.cn/about/';
    })
    let qixiazhandian=document.querySelector('.but_site')
    let jinriyunshi=document.querySelector('.but_fortune')
    let xf_fortune=document.querySelector('.xf_fortune')
    let xf_site=document.querySelector('.xf_site')
    qixiazhandian.addEventListener('click',function(){
    xf_fortune.style.display='none'
    xf_site.style.display='block'
    })
    jinriyunshi.addEventListener('click',function(){
    xf_fortune.style.display='block'
    xf_site.style.display='none'
    })
    var url="https://api.i-meto.com/meting/api?server=netease&type=playlist&id=17514566321";
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
                } 
            }
        });
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
