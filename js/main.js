// ========================================
// MAIN JAVASCRIPT - CLÍNICA FENIX
// ========================================

// Inicializar AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 600,
        easing: 'ease-out',
        once: true,
        offset: 50
    });
    
    // Inicializar Slideshow (apenas se estiver na página inicial)
    const slideshowContainer = document.querySelector('.image-slider');
    if (slideshowContainer) {
        initSlideshow(slideshowContainer);
    }
});

// ========================================
// SLIDESHOW (EFEITO KEN BURNS)
// ========================================
function initSlideshow(slideshowContainer) {
    const slides = slideshowContainer.querySelectorAll('.slide');
    if (slides.length === 0) return;

    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    // Mostrar o primeiro slide
    showSlide(currentSlide);

    // Mudar de slide a cada 10 segundos (metade do tempo da animação Ken Burns)
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 10000); // 10 segundos
}

// ========================================
// MENU MOBILE
// ========================================
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
const menuOverlay = document.getElementById('menuOverlay');

if (menuToggle && nav && menuOverlay) {
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        
        // Mudar ícone do menu
        if (nav.classList.contains('active')) {
            menuToggle.textContent = '✕';
        } else {
            menuToggle.textContent = '☰';
        }
    });
    
    // Fechar menu ao clicar no overlay
    menuOverlay.addEventListener('click', function() {
        nav.classList.remove('active');
        menuOverlay.classList.remove('active');
        menuToggle.textContent = '☰';
    });
    
    // Fechar menu ao clicar em um link
    const navLinks = nav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 1050) {
                nav.classList.remove('active');
                menuOverlay.classList.remove('active');
                menuToggle.textContent = '☰';
            }
        });
    });
}

// ========================================
// HEADER SCROLL
// ========================================
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ========================================
// BUSCA DE ESPECIALIDADES
// ========================================
const searchEspecialidade = document.getElementById('searchEspecialidade');
if (searchEspecialidade) {
    searchEspecialidade.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const especialidadeItems = document.querySelectorAll('.especialidade-item');
        
        especialidadeItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// ========================================
// BUSCA DE EXAMES
// ========================================
const searchExame = document.getElementById('searchExame');
if (searchExame) {
    searchExame.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const exameCards = document.querySelectorAll('.exame-card');
        
        exameCards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            
            if (title.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// ========================================
// FILTRO DE CLÍNICAS POR ZONA
// ========================================
const filtroButtons = document.querySelectorAll('.btn-filtro');
const zonaSections = document.querySelectorAll('.zona-section');

if (filtroButtons.length > 0) {
    filtroButtons.forEach(button => {
        button.addEventListener('click', function() {
            const zona = this.getAttribute('data-zona');
            
            // Atualizar botão ativo
            filtroButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar seções
            if (zona === 'todas') {
                zonaSections.forEach(section => {
                    section.style.display = 'block';
                });
            } else {
                zonaSections.forEach(section => {
                    if (section.getAttribute('data-zona') === zona) {
                        section.style.display = 'block';
                    } else {
                        section.style.display = 'none';
                    }
                });
            }
            
            // Re-inicializar AOS para as seções filtradas
            AOS.refresh();
        });
    });
}

// ========================================
// FORMULÁRIO DE CONTATO
// ========================================
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obter valores do formulário
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;
        const assunto = document.getElementById('assunto').value;
        const mensagem = document.getElementById('mensagem').value;
        
        // Validação simples
        if (!nome || !email || !telefone || !assunto || !mensagem) {
            showFormMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormMessage('Por favor, insira um e-mail válido.', 'error');
            return;
        }
        
        // Simular envio (em produção, integrar com backend)
        const submitButton = contactForm.querySelector('.btn-submit');
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        
        // Simular delay de envio
        setTimeout(() => {
            showFormMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            contactForm.reset();
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Mensagem';
            
            // Opcional: Redirecionar para WhatsApp
            const whatsappMessage = `Olá! Meu nome é ${nome}. ${mensagem}`;
            const whatsappUrl = `https://wa.me/5521991685938?text=${encodeURIComponent(whatsappMessage)}`;
            
            setTimeout(() => {
                if (confirm('Deseja continuar a conversa pelo WhatsApp?')) {
                    window.open(whatsappUrl, '_blank');
                }
            }, 1500);
        }, 1500);
    });
}

function showFormMessage(message, type) {
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = 'form-message ' + type;
        formMessage.style.display = 'block';
        
        // Esconder mensagem após 5 segundos
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// ========================================
// SMOOTH SCROLL PARA LINKS INTERNOS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Ignorar links vazios ou apenas "#"
        if (href === '#' || href === '') {
            e.preventDefault();
            return;
        }
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            
            const headerHeight = header ? header.offsetHeight : 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// LAZY LOADING DE IMAGENS
// ========================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// ANIMAÇÃO DE NÚMEROS (CONTADORES)
// ========================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Observar elementos com classe .counter
if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                entry.target.classList.add('counted');
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.counter').forEach(counter => {
        counterObserver.observe(counter);
    });
}

// ========================================
// PREVENÇÃO DE SPAM NO FORMULÁRIO
// ========================================
let formSubmitCount = 0;
const maxSubmits = 3;
const submitTimeWindow = 60000; // 1 minuto

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        if (formSubmitCount >= maxSubmits) {
            e.preventDefault();
            showFormMessage('Você atingiu o limite de envios. Tente novamente mais tarde.', 'error');
            return false;
        }
        
        formSubmitCount++;
        setTimeout(() => {
            formSubmitCount = Math.max(0, formSubmitCount - 1);
        }, submitTimeWindow);
    });
}

// ========================================
// MÁSCARA DE TELEFONE
// ========================================
const telefoneInput = document.getElementById('telefone');
if (telefoneInput) {
    telefoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            if (value.length <= 2) {
                value = value.replace(/^(\d{0,2})/, '($1');
            } else if (value.length <= 6) {
                value = value.replace(/^(\d{2})(\d{0,4})/, '($1) $2');
            } else if (value.length <= 10) {
                value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            } else {
                value = value.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            }
        }
        
        e.target.value = value;
    });
}

// ========================================
// PERFORMANCE: DEBOUNCE PARA SCROLL
// ========================================
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

// Aplicar debounce ao scroll
const debouncedScroll = debounce(function() {
    // Funções que dependem do scroll podem ser otimizadas aqui
}, 100);

window.addEventListener('scroll', debouncedScroll);

// ========================================
// ACESSIBILIDADE: NAVEGAÇÃO POR TECLADO
// ========================================
document.addEventListener('keydown', function(e) {
    // ESC para fechar menu mobile
    if (e.key === 'Escape' && nav && nav.classList.contains('active')) {
        nav.classList.remove('active');
        menuOverlay.classList.remove('active');
        if (menuToggle) menuToggle.textContent = '☰';
    }
});

// ========================================
// CONSOLE LOG PARA DEBUG
// ========================================
console.log('🏥 Clínica Fenix - Site carregado com sucesso!');
console.log('📱 Versão: 1.0.0');
console.log('🎨 Desenvolvido com HTML5, CSS3/SASS e JavaScript');
