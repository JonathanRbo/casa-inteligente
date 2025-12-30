/**
 * Casa Inteligente - JavaScript Principal
 * Autor: Jonathan Ribeiro
 * Descrição: Script para adicionar interatividade ao site
 */

// ==========================================
// INICIALIZAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSmoothScroll();
    initScrollSpy();
    initHeaderScroll();
    initBackToTop();
    initLazyLoading();
    initAccessibility();
    initAnimations();
    console.log('Casa Inteligente - Site carregado com sucesso!');
});

// ==========================================
// MENU MOBILE
// ==========================================
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        // Toggle menu mobile
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Fecha menu ao clicar em um link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('menu-open');
            });
        });

        // Fecha menu ao clicar fora
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('menu-open');
            }
        });
    }
}

// ==========================================
// HEADER SCROLL
// ==========================================
function initHeaderScroll() {
    const header = document.querySelector('.header');

    if (header) {
        window.addEventListener('scroll', debounce(() => {
            const currentScroll = window.pageYOffset;

            // Adiciona classe quando scrollar
            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, 10));
    }
}

// ==========================================
// SCROLL SUAVE
// ==========================================
function initSmoothScroll() {
    // Adiciona scroll suave para todos os links âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// BOTÃO VOLTAR AO TOPO
// ==========================================
function initBackToTop() {
    // Detecta links de "voltar ao topo" vazios
    const backToTopLinks = document.querySelectorAll('a[href=""]');

    backToTopLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Atualiza o texto se necessário
        if (link.textContent.toLowerCase().includes('topo') ||
            link.textContent.toLowerCase().includes('início')) {
            link.setAttribute('aria-label', 'Voltar ao topo da página');
        }
    });
}

// ==========================================
// LAZY LOADING DE IMAGENS
// ==========================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para navegadores sem suporte
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// ==========================================
// MELHORIAS DE ACESSIBILIDADE
// ==========================================
function initAccessibility() {
    // Adiciona indicadores visuais para foco em navegação por teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });

    // Adiciona role e aria-label para links externos
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        if (!link.hasAttribute('aria-label')) {
            const linkText = link.textContent.trim();
            link.setAttribute('aria-label', `${linkText} (abre em nova aba)`);
        }

        // Garante rel="noopener noreferrer" para segurança
        if (!link.hasAttribute('rel')) {
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
}

// ==========================================
// ANIMAÇÕES DE ENTRADA
// ==========================================
function initAnimations() {
    const animatedElements = document.querySelectorAll('.content-box, .sponsor-card, .team-card, .product-section');

    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            animationObserver.observe(el);
        });
    }
}

// ==========================================
// UTILITÁRIOS
// ==========================================

/**
 * Detecta se o usuário prefere redução de movimento
 */
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Adiciona classe quando elemento está visível na viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ==========================================
// PERFORMANCE - DEBOUNCE
// ==========================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==========================================
// SCROLL SPY (opcional)
// ==========================================
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const makeActive = debounce(() => {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, 100);

    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', makeActive);
    }
}

// ==========================================
// ESTILO PARA ANIMAÇÕES (adiciona ao DOM)
// ==========================================
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }

    body.keyboard-navigation *:focus {
        outline: 3px solid #1d71a1 !important;
        outline-offset: 2px !important;
    }

    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
        }
    }
`;
document.head.appendChild(style);
