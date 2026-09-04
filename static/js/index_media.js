// ======================= 横竖屏自适应背景媒体加载器 =======================
let lastOrientation = null; // 记录上一次的方向状态
let mediaElement = null;
let mediaContainer = null;
let scrollFadeHandler = null;
let scrollMaskHandler = null;

// ================= 新增滚动渐变效果函数 =================
function initScrollFadeEffect() {
  const mc = document.getElementById('home-media-container');
  if (!mc) return;
  const me = mc.querySelector('.home-media');
  if (!me) return;

  if (scrollFadeHandler) return;

  // 节流函数优化性能
  function throttle(func, limit) {
    let lastFunc, lastRan;
    return function () {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function () {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    }
  }

  // 处理滚动时的透明度变化
  function handleScrollFade() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    let opacity = 1 - (scrollY / windowHeight);
    opacity = Math.max(0, Math.min(1, opacity));
    me.style.opacity = opacity;
  }

  scrollFadeHandler = throttle(handleScrollFade, 50);
  window.addEventListener('scroll', scrollFadeHandler);
  handleScrollFade();
}

// ================= 滚动渐变效果函数结束 =================

// ================= 新增底部遮罩层控制函数 =================
function initScrollMaskEffect() {
  const mc = document.getElementById('home-media-container');
  if (!mc) return;

  if (scrollMaskHandler) return;

  function throttle(func, limit) {
    let lastFunc, lastRan;
    return function () {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function () {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    }
  }

  function handleScrollMask() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    let maskHeight = (scrollY / windowHeight) * 100;
    maskHeight = Math.min(100, Math.max(0, maskHeight));
    mc.style.setProperty('--mask-height', `${maskHeight}%`);
  }

  scrollMaskHandler = throttle(handleScrollMask, 50);
  window.addEventListener('scroll', scrollMaskHandler);
  handleScrollMask();
}
// ================= 底部遮罩层控制函数结束 =================

function initResponsiveBackground() {
  // 赋值全局，禁止const重新声明
  mediaContainer = document.getElementById('home-media-container');
  if (!mediaContainer) {
    console.error('[背景加载器] 未找到媒体容器元素');
    mediaElement = null;
    return;
  }

  // 检测当前屏幕方向
  const currentIsPortrait = window.innerHeight > window.innerWidth;
  const currentOrientation = currentIsPortrait ? 'portrait' : 'landscape';

  // 如果方向未改变，则直接返回
  if (lastOrientation === currentOrientation) {
    console.log('[背景加载器] 方向未改变，无需重新加载');
    return;
  }

  // 更新方向记录
  lastOrientation = currentOrientation;
  console.log(`[背景加载器] 方向变化: ${currentOrientation}`);

  // 清除旧滚动监听
  if (scrollFadeHandler) {
    window.removeEventListener('scroll', scrollFadeHandler);
    scrollFadeHandler = null;
  }
  if (scrollMaskHandler) {
    window.removeEventListener('scroll', scrollMaskHandler);
    scrollMaskHandler = null;
  }

  // 清除现有媒体元素和加载动画
  const existingMedia = mediaContainer.querySelector('.home-media');
  const existingLoader = mediaContainer.querySelector('.custom-loader');
  if (existingMedia) existingMedia.remove();
  if (existingLoader) existingLoader.remove();

  // 根据方向选择资源
  let mediaSrc, posterSrc, mediaType;
  if (currentIsPortrait) {
    mediaSrc = mediaContainer.dataset.portraitVideo || mediaContainer.dataset.portraitImg;
    posterSrc = mediaContainer.dataset.portraitPoster;
    mediaType = mediaContainer.dataset.portraitVideo ? 'video' : 'img';
  } else {
    mediaSrc = mediaContainer.dataset.landscapeVideo || mediaContainer.dataset.landscapeImg;
    posterSrc = mediaContainer.dataset.landscapePoster;
    mediaType = mediaContainer.dataset.landscapeVideo ? 'video' : 'img';
  }

  if (!mediaSrc) {
    console.error('[背景加载器] 未找到有效媒体资源');
    return;
  }
  console.log(`[背景加载器] 使用资源: ${mediaSrc} (类型: ${mediaType})`);

  // 赋值全局变量，禁止const！
  mediaElement = document.createElement(mediaType);
  mediaElement.className = 'home-media';
  mediaElement.style.cssText = 'width:100%;height:100%;object-fit:cover';

  // 设置初始透明度
  mediaElement.style.opacity = '1';
  mediaElement.style.transition = 'opacity 0.5s ease';

  mediaContainer.appendChild(mediaElement);
  addMediaEffects(mediaElement, mediaType);

  console.log('[背景加载器] 媒体元素已创建');

  // 创建自定义加载动画容器
  const loaderContainer = document.createElement('div');
  loaderContainer.className = 'custom-loader';
  mediaContainer.prepend(loaderContainer);

  const loaderElement = document.createElement('div');
  loaderElement.className = 'loader-animation';
  loaderElement.style.backgroundImage = `url(${posterSrc})`;
  loaderContainer.appendChild(loaderElement);

  // 视频特殊处理
  if (mediaType === 'video') {
    mediaElement.autoplay = true;
    mediaElement.muted = true;
    mediaElement.loop = true;
    mediaElement.playsInline = true;
    mediaElement.setAttribute('playsinline', '');
    mediaElement.setAttribute('webkit-playsinline', '');

    const source = document.createElement('source');
    source.src = mediaSrc;
    source.type = 'video/mp4';
    mediaElement.appendChild(source);

    const playPromise = mediaElement.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn('[背景加载器] 自动播放被阻止:', error);
        mediaElement.muted = true;
        mediaElement.play();
      });
    }

    mediaElement.addEventListener('loadeddata', () => {
      loaderContainer.style.opacity = '0';
      setTimeout(() => {
        if (loaderContainer.parentNode) {
          loaderContainer.parentNode.removeChild(loaderContainer);
        }
      }, 500);
    });
  } else {
    mediaElement.src = mediaSrc;
    mediaElement.loading = 'eager';

    mediaElement.addEventListener('load', () => {
      loaderContainer.style.opacity = '0';
      setTimeout(() => {
        if (loaderContainer.parentNode) {
          loaderContainer.parentNode.removeChild(loaderContainer);
        }
      }, 500);
    });
  }

  // 错误处理
  mediaElement.onerror = function () {
    console.error(`[背景加载器] 资源加载失败: ${mediaSrc}`);
    this.style.display = 'none';

    console.warn('[背景加载器] 尝试回退到备用媒体');
    const fallbackType = mediaType === 'video' ? 'img' : 'video';
    const fallbackSrc = currentIsPortrait ?
      (mediaContainer.dataset.portraitImg || mediaContainer.dataset.portraitVideo) :
      (mediaContainer.dataset.landscapeImg || mediaContainer.dataset.landscapeVideo);

    if (fallbackSrc && fallbackSrc !== mediaSrc) {
      console.log(`[背景加载器] 使用备用资源: ${fallbackSrc}`);
      mediaElement.src = fallbackSrc;
      mediaElement.style.display = 'block';
    }

    setTimeout(() => {
      if (!mediaElement || !mediaElement.parentNode) {
        console.warn('[修复] 尝试完全重建');
        lastOrientation = null;
        initResponsiveBackground();
        setTimeout(initScrollFadeEffect, 500);
      }
    }, 1000);
  };

  mediaContainer.appendChild(mediaElement);
  console.log('[背景加载器] 媒体元素已创建');

  initScrollFadeEffect();
}

function addMediaEffects(mediaElement, mediaType) {
  if (mediaType === 'video') {
    const currentIsPortrait = window.innerHeight > window.innerWidth;
    const baseScale = currentIsPortrait ? 1.05 : 1.2;
    mediaElement.style.transform = `scale(${baseScale})`;

    function isIOS() {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }
    if (isIOS()) {
      console.log('[视差效果] 在iOS设备上，禁用所有视差效果');
      return;
    }

    mediaElement.style.transform = 'scale(1.2)';
    mediaElement.style.transition = 'transform 0.5s ease-out';

    mediaElement.addEventListener('loadeddata', () => {
      if (currentIsPortrait) {
        mediaElement.style.transform = 'scale(1.05)';
      } else {
        setTimeout(() => {
          mediaElement.style.transform = 'scale(1)';
        }, 100);
      }
    });

    const mediaContainerParallax = document.getElementById('page-header');
    if (!mediaContainerParallax) return;
    mediaContainerParallax.style.overflow = 'hidden';
    mediaElement.style.transformOrigin = 'center center';

    const parallaxIntensity = 0.05;
    const scaleIntensity = 0.05;
    let isGyroActive = false;

    function initGyroParallax() {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              setupGyroListeners();
              isGyroActive = true;
            }
          })
          .catch(console.error);
      } else if ('DeviceOrientationEvent' in window) {
        setupGyroListeners();
        isGyroActive = true;
      }
      return isGyroActive;
    }

    function setupGyroListeners() {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    function handleOrientation(event) {
      const baseScaleValue = currentIsPortrait ? 1.05 : 1;
      if (!isGyroActive) return;
      const beta = event.beta || 0;
      const gamma = event.gamma || 0;
      const moveX = (gamma / 90) * parallaxIntensity * 100;
      const moveY = (beta / 180) * parallaxIntensity * 100;
      mediaElement.style.transform = `
        translate(${moveX}%, ${moveY}%)
        scale(${baseScaleValue + scaleIntensity})
      `;
    }

    function initMouseParallax() {
      mediaContainerParallax.addEventListener('mousemove', (e) => {
        const rect = mediaContainerParallax.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const moveX = (x - 0.5) * parallaxIntensity * 100;
        const moveY = (y - 0.5) * parallaxIntensity * 100;
        mediaElement.style.transform = `
          translate(${moveX}%, ${moveY}%)
          scale(${1 + scaleIntensity})
        `;
      });
      mediaContainerParallax.addEventListener('mouseleave', () => {
        mediaElement.style.transform = 'scale(1)';
      });
    }

    function initTouchParallax() {
      mediaContainerParallax.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = mediaContainerParallax.getBoundingClientRect();
        const x = (touch.clientX - rect.left) / rect.width;
        const y = (touch.clientY - rect.top) / rect.height;
        const moveX = (x - 0.5) * parallaxIntensity * 50;
        const moveY = (y - 0.5) * parallaxIntensity * 50;
        mediaElement.style.transform = `
          translate(${moveX}%, ${moveY}%)
          scale(${1 + scaleIntensity * 0.5})
        `;
      });
      mediaContainerParallax.addEventListener('touchend', () => {
        mediaElement.style.transform = 'scale(1)';
      });
    }

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (isMobile) {
      if (!initGyroParallax()) {
        initTouchParallax();
      }
    } else {
      initMouseParallax();
    }

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        isGyroActive = false;
      } else if (isMobile) {
        isGyroActive = initGyroParallax();
      }
    });
  }
}

function initMedia() {
  initResponsiveBackground();
  initScrollFadeEffect();
}

function runMain() {
  initMedia();
}

// 兼容普通加载与PJAX
document.addEventListener('DOMContentLoaded', runMain);
document.addEventListener('pjax:complete', runMain);

// 防抖处理窗口变化
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const currentIsPortrait = window.innerHeight > window.innerWidth;
    const currentOrientation = currentIsPortrait ? 'portrait' : 'landscape';
    if (lastOrientation !== currentOrientation) {
      console.log('[背景加载器] 窗口大小变化，重新加载媒体');
      initResponsiveBackground();
    } else {
      console.log('[背景加载器] 窗口大小变化但方向未改变');
      initScrollFadeEffect();
    }
  }, 500);
});

// 页面可见性变化处理
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    const video = document.querySelector('#home-media-container video');
    if (video && video.paused) {
      console.log('[背景加载器] 页面恢复可见，重新播放视频');
      video.play().catch(e => console.warn('视频恢复播放失败:', e));
    }
    initScrollFadeEffect();
  }
});

// 缓存恢复检测
window.addEventListener('pageshow', event => {
  if (event.persisted && location.pathname === '/') {
    console.log('[修复] 检测到缓存恢复主页，强制重置');
    lastOrientation = null;
    initResponsiveBackground();
    setTimeout(initScrollFadeEffect, 300);
  }
});

// 路由变化监听
window.addEventListener('popstate', () => {
  if (location.pathname === '/') {
    console.log('[修复] 检测到返回主页');
    setTimeout(() => {
      const container = document.getElementById('home-media-container');
      if (container && !container.querySelector('.home-media')) {
        lastOrientation = null;
        initResponsiveBackground();
      }
      initScrollFadeEffect();
    }, 300);
  }
});

// 媒体状态自检
function checkMediaStatus() {
  if (location.pathname !== '/') return;
  const container = document.getElementById('home-media-container');
  if (!container) return;
  const hasMedia = container.querySelector('.home-media');
  if (!hasMedia) {
    console.log('[修复] 自检发现媒体丢失');
    lastOrientation = null;
    initResponsiveBackground();
  }
  initScrollFadeEffect();
}
setInterval(checkMediaStatus, 500);
