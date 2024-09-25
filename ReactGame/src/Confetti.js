import confetti from 'canvas-confetti';

let animationFrameId = null;

export function triggerConfetti() {
    const end = Date.now() + 15 * 1000;
    const colors = ["#bb0000", "#ffffff"];

    (function frame() {
        if (Date.now() < end) {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors,
            });

            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors,
            });

            animationFrameId = requestAnimationFrame(frame);
        }
    })();
}

export function stopConfetti() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null; // Reset the frame ID
}
}
