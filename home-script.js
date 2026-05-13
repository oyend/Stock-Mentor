// 히어로 섹션 순차적 애니메이션
window.onload = () => {
    const elements = ['heroBadge', 'heroTitle', 'heroPara', 'heroBtn'];
    elements.forEach((id, index) => {
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            }
        }, 100 * (index + 1));
    });
};

const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));