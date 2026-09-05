function initMouseTrail() {
    if (window.matchMedia('(max-width: 768px)').matches) return;
    if (document.getElementById('trail-container')) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'trail-container';
    document.body.appendChild(canvas);

    const context = canvas.getContext('2d');
    const particles = [];
    const maxParticles = 80;
    const particleLifetime = 550;
    let animationFrame;
    let lastSpawnAt = 0;
    let lastX = 0;
    let lastY = 0;

    function resizeCanvas() {
        const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * devicePixelRatio;
        canvas.height = window.innerHeight * devicePixelRatio;
        context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    function getRandomColor() {
        return `hsl(${Math.floor(Math.random() * 360)} 100% 65%)`;
    }

    function animate(timestamp) {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (let index = particles.length - 1; index >= 0; index--) {
            const particle = particles[index];
            const age = timestamp - particle.createdAt;

            if (age >= particleLifetime) {
                particles.splice(index, 1);
                continue;
            }

            context.globalAlpha = 1 - age / particleLifetime;
            context.fillStyle = particle.color;
            context.beginPath();
            context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            context.fill();
        }

        context.globalAlpha = 1;
        animationFrame = particles.length ? requestAnimationFrame(animate) : null;
    }

    function startAnimation() {
        if (!animationFrame) animationFrame = requestAnimationFrame(animate);
    }

    document.addEventListener('mousemove', (event) => {
        const now = performance.now();
        const distance = Math.hypot(event.clientX - lastX, event.clientY - lastY);

        if (now - lastSpawnAt < 16 || distance < 3) return;

        lastSpawnAt = now;
        lastX = event.clientX;
        lastY = event.clientY;
        particles.push({
            x: event.clientX,
            y: event.clientY,
            radius: 1.5,
            color: getRandomColor(),
            createdAt: now
        });

        if (particles.length > maxParticles) particles.shift();
        startAnimation();
    });

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
}

document.addEventListener('DOMContentLoaded', initMouseTrail);
document.addEventListener('pjax:complete', initMouseTrail);