// 判断是否为手机端
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// 手机端直接跳过
if (!isMobile && (window.localStorage.getItem("fpson") == undefined || window.localStorage.getItem("fpson") == "1")) {
    var rAF = function () {
        return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            }
        );
    }();
    var frame = 0;
    var allFrameCount = 0;
    var lastTime = Date.now();
    var lastFameTime = Date.now();
    var loop = function () {
        var now = Date.now();
        var fs = (now - lastFameTime);
        var fps = Math.round(1000 / fs);
        lastFameTime = now;
        // 不置 0，在动画的开头及结尾记录此值的差值算出 FPS
        allFrameCount++;
        frame++;
        if (now > 1000 + lastTime) {
            var fps = Math.round((frame * 1000) / (now - lastTime));
            let kd;
            if (fps <= 5) {
                kd = `<span style="color:#bd0000">卡成ppt🤢</span>`
            } else if (fps <= 15) {
                kd = `<span style="color:red">电竞级帧率😖</span>`
            } else if (fps <= 25) {
                kd = `<span style="color:orange">有点难受😨</span>`
            } else if (fps < 35) {
                kd = `<span style="color:#9338e6">不太流畅🙄</span>`
            } else if (fps <= 45) {
                kd = `<span style="color:#08b7e4">还不错哦😁</span>`
            } else {
                kd = `<span style="color:#39c5bb">十分流畅🤣</span>`
            }
            document.getElementById("fps").innerHTML = `FPS:${fps} ${kd}`;
            frame = 0;
            lastTime = now;
        };
        rAF(loop);
    }
    loop();
} else {
    // 手机端 / fpson关闭：隐藏fps元素
    const fpsDom = document.getElementById("fps");
    if(fpsDom){
        fpsDom.style.display = "none";
    }
}
