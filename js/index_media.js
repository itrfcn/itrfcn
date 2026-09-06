let lastOrientation = null;
let mediaElement = null;
let mediaContainer = null;
let scrollFadeHandler = null;
let scrollMaskHandler = null;

function isMediaHomePage() {
  return window.location.pathname === '/' || window.location.pathname === '/index.html';
}

function initScrollFadeEffect() {
  const container = document.getElementById('home-media-container');
  if (!container) return;
  const media = container.querySelector('.home-media');
  if (!media || scrollFadeHandler) return;

  function throttle(func, limit) {
    let timeout;
    let lastRun;
    return function () {
      const context = this;
      const args = arguments;
      if (!lastRun) {
        func.apply(context, args);
        lastRun = Date.now();
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          if (Date.now() - lastRun >= limit) {
            func.apply(context, args);
            lastRun = Date.now();
          }
        }, limit - (Date.now() - lastRun));
      }
    };
  }

  function handleScrollFade() {
    const opacity = Math.max(0, Math.min(1, 1 - window.scrollY / window.innerHeight));
    media.style.opacity = opacity;
  }

  scrollFadeHandler = throttle(handleScrollFade, 50);
  window.addEventListener('scroll', scrollFadeHandler);
  handleScrollFade();
}

function initScrollMaskEffect() {
  const container = document.getElementById('home-media-container');
  if (!container || scrollMaskHandler) return;

  function throttle(func, limit) {
    let timeout;
    let lastRun;
    return function () {
      const context = this;
      const args = arguments;
      if (!lastRun) {
        func.apply(context, args);
        lastRun = Date.now();
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          if (Date.now() - lastRun >= limit) {
            func.apply(context, args);
            lastRun = Date.now();
          }
        }, limit - (Date.now() - lastRun));
      }
    };
  }

  function handleScrollMask() {
    const maskHeight = Math.min(100, Math.max(0, window.scrollY / window.innerHeight * 100));
    container.style.setProperty('--mask-height', `${maskHeight}%`);
  }

  scrollMaskHandler = throttle(handleScrollMask, 50);
  window.addEventListener('scroll', scrollMaskHandler);
  handleScrollMask();
}

function initResponsiveBackground() {
  if (!isMediaHomePage()) return;

  mediaContainer = document.getElementById('home-media-container');
  if (!mediaContainer) {
    console.error('[背景加载器] 未找到媒体容器元素');
    mediaElement = null;
    return;
  }

  const isPortrait = window.innerHeight > window.innerWidth;
  const orientation = isPortrait ? 'portrait' : 'landscape';
  const mediaSrc = isPortrait
    ? mediaContainer.dataset.portraitVideo || mediaContainer.dataset.portraitImg
    : mediaContainer.dataset.landscapeVideo || mediaContainer.dataset.landscapeImg;
  const posterSrc = isPortrait
    ? mediaContainer.dataset.portraitPoster
    : mediaContainer.dataset.landscapePoster;
  const mediaType = (isPortrait ? mediaContainer.dataset.portraitVideo : mediaContainer.dataset.landscapeVideo)
    ? 'video'
    : 'img';

  if (!mediaSrc) return;

  const existingMedia = mediaContainer.querySelector('.home-media');
  if (lastOrientation === orientation && existingMedia && existingMedia.dataset.mediaSrc === mediaSrc) return;

  lastOrientation = orientation;
  if (scrollFadeHandler) {
    window.removeEventListener('scroll', scrollFadeHandler);
    scrollFadeHandler = null;
  }
  if (scrollMaskHandler) {
    window.removeEventListener('scroll', scrollMaskHandler);
    scrollMaskHandler = null;
  }

  const existingLoader = mediaContainer.querySelector('.custom-loader');
  if (existingMedia) existingMedia.remove();
  if (existingLoader) existingLoader.remove();

  mediaElement = document.createElement(mediaType);
  mediaElement.className = 'home-media';
  mediaElement.dataset.mediaSrc = mediaSrc;
  mediaElement.style.cssText = 'width:100%;height:100%;object-fit:cover;opacity:1;transition:opacity 0.5s ease';

  const loaderContainer = document.createElement('div');
  loaderContainer.className = 'custom-loader';
  mediaContainer.prepend(loaderContainer);

  const loaderElement = document.createElement('div');
  loaderElement.className = 'loader-animation';
  loaderElement.style.backgroundImage = `url(${posterSrc})`;
  loaderContainer.appendChild(loaderElement);

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
      setTimeout(() => loaderContainer.parentNode && loaderContainer.remove(), 500);
    });
  } else {
    mediaElement.src = mediaSrc;
    mediaElement.loading = 'eager';
    mediaElement.addEventListener('load', () => {
      loaderContainer.style.opacity = '0';
      setTimeout(() => loaderContainer.parentNode && loaderContainer.remove(), 500);
    });
  }

  mediaElement.onerror = function () {
    console.error(`[背景加载器] 资源加载失败: ${mediaSrc}`);
    this.onerror = null;
    this.pause?.();
    this.style.display = 'none';
  };

  mediaContainer.appendChild(mediaElement);
  addMediaEffects(mediaElement, mediaType);
  initScrollFadeEffect();
  initScrollMaskEffect();
}

function addMediaEffects(mediaElement, mediaType) {
  if (mediaType === 'video') {
    const isPortrait = window.innerHeight > window.innerWidth;
    const baseScale = isPortrait ? 1.05 : 1.2;
    mediaElement.style.transform = `scale(${baseScale})`;

    function isIOS() {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    if (isIOS()) return;

    mediaElement.style.transform = 'scale(1.2)';
    mediaElement.style.transition = 'transform 0.5s ease-out';

    mediaElement.addEventListener('loadeddata', () => {
      if (isPortrait) {
        mediaElement.style.transform = 'scale(1.05)';
      } else {
        setTimeout(() => mediaElement.style.transform = 'scale(1)', 100);
      }
    });

    const pageHeader = document.getElementById('page-header');
    if (!pageHeader) return;
    pageHeader.style.overflow = 'hidden';
    mediaElement.style.transformOrigin = 'center center';

    const parallaxIntensity = 0.05;
    const scaleIntensity = 0.05;
    let gyroActive = false;

    function setupGyroListeners() {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    function handleOrientation(event) {
      const baseScaleValue = isPortrait ? 1.05 : 1;
      if (!gyroActive) return;
      const moveX = ((event.gamma || 0) / 90) * parallaxIntensity * 100;
      const moveY = ((event.beta || 0) / 180) * parallaxIntensity * 100;
      mediaElement.style.transform = `translate(${moveX}%, ${moveY}%) scale(${baseScaleValue + scaleIntensity})`;
    }

    function initGyroParallax() {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              setupGyroListeners();
              gyroActive = true;
            }
          })
          .catch(console.error);
      } else if ('DeviceOrientationEvent' in window) {
        setupGyroListeners();
        gyroActive = true;
      }
      return gyroActive;
    }

    function initMouseParallax() {
      pageHeader.addEventListener('mousemove', event => {
        const rect = pageHeader.getBoundingClientRect();
        const moveX = ((event.clientX - rect.left) / rect.width - 0.5) * parallaxIntensity * 100;
        const moveY = ((event.clientY - rect.top) / rect.height - 0.5) * parallaxIntensity * 100;
        mediaElement.style.transform = `translate(${moveX}%, ${moveY}%) scale(${1 + scaleIntensity})`;
      });
      pageHeader.addEventListener('mouseleave', () => mediaElement.style.transform = 'scale(1)');
    }

    function initTouchParallax() {
      pageHeader.addEventListener('touchmove', event => {
        event.preventDefault();
        const touch = event.touches[0];
        const rect = pageHeader.getBoundingClientRect();
        const moveX = ((touch.clientX - rect.left) / rect.width - 0.5) * parallaxIntensity * 50;
        const moveY = ((touch.clientY - rect.top) / rect.height - 0.5) * parallaxIntensity * 50;
        mediaElement.style.transform = `translate(${moveX}%, ${moveY}%) scale(${1 + scaleIntensity * 0.5})`;
      });
      pageHeader.addEventListener('touchend', () => mediaElement.style.transform = 'scale(1)');
    }

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (isMobile) {
      if (!initGyroParallax()) initTouchParallax();
    } else {
      initMouseParallax();
    }

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        gyroActive = false;
      } else if (isMobile) {
        gyroActive = initGyroParallax();
      }
    });
  }
}

function initMedia() {
  if (!isMediaHomePage()) {
    lastOrientation = null;
    return;
  }
  initResponsiveBackground();
  initScrollFadeEffect();
}

function runMain() {
  initMedia();
}

document.addEventListener('DOMContentLoaded', runMain);
document.addEventListener('pjax:complete', runMain);

let resizeTimer;
window.addEventListener('resize', () => {
  if (!isMediaHomePage()) {
    lastOrientation = null;
    return;
  }

  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    if (lastOrientation !== orientation) {
      initResponsiveBackground();
    } else {
      initScrollFadeEffect();
    }
  }, 500);
});

document.addEventListener('visibilitychange', () => {
  if (!isMediaHomePage()) return;

  if (document.visibilityState === 'visible') {
    const video = document.querySelector('#home-media-container video');
    if (video && video.paused) video.play().catch(error => console.warn('视频恢复播放失败:', error));
    initScrollFadeEffect();
  }
});

window.addEventListener('pageshow', event => {
  if (event.persisted && location.pathname === '/') {
    lastOrientation = null;
    initResponsiveBackground();
    setTimeout(initScrollFadeEffect, 300);
  }
});

window.addEventListener('popstate', () => {
  if (location.pathname === '/') {
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

function checkMediaStatus() {
  if (location.pathname !== '/') return;
  const container = document.getElementById('home-media-container');
  if (!container) return;
  if (!container.querySelector('.home-media')) {
    lastOrientation = null;
    initResponsiveBackground();
  }
  initScrollFadeEffect();
}

setInterval(checkMediaStatus, 500);
