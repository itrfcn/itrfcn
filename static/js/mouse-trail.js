function initMouseTrail() {
    if (window.matchMedia('(max-width: 768px)').matches) return;
    if (document.getElementById('trail-container')) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'trail-container';
    document.body.appendChild(canvas);

    const context = canvas.getContext('2d');
    const particles = [];
    const maxParticles = 30;
    let hue = 0;
    let animationFrame;

    function resizeCanvas() {
        const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * devicePixelRatio;
        canvas.height = window.innerHeight * devicePixelRatio;
        context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    function animate(timestamp) {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (let index = particles.length - 1; index >= 0; index--) {
            const particle = particles[index];
            particle.life -= 0.03 * Math.max(1, (timestamp - particle.lastFrame) / 16.67);
            particle.lastFrame = timestamp;

            if (particle.life <= 0) {
                particles.splice(index, 1);
                continue;
            }

            const size = (index / particles.length) * 6 + 2;
            const color = `hsla(${particle.hue}, 100%, 65%, ${particle.life})`;
            context.globalAlpha = particle.life;
            context.fillStyle = color;
            context.shadowBlur = 10;
            context.shadowColor = color;
            context.beginPath();
            context.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            context.fill();
        }

        context.globalAlpha = 1;
        context.shadowBlur = 0;
        animationFrame = particles.length ? requestAnimationFrame(animate) : null;
    }

    function startAnimation() {
        if (!animationFrame) animationFrame = requestAnimationFrame(animate);
    }

    document.addEventListener('mousemove', (event) => {
        const now = performance.now();
        particles.push({
            x: event.clientX,
            y: event.clientY,
            hue,
            life: 1,
            lastFrame: now
        });

        if (particles.length > maxParticles) particles.shift();
        hue = (hue + 3) % 360;
        startAnimation();
    });

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
}

document.addEventListener('DOMContentLoaded', initMouseTrail);
document.addEventListener('pjax:complete', initMouseTrail);