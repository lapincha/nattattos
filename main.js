// ============================================================
// MAIN.JS · Natty Tattoos Studio
// ============================================================

document.addEventListener('DOMContentLoaded', function() {

    // ============================================================
    // 1. NAVEGACIÓN · Hamburguesa
    // ============================================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    // 🔥 VERIFICACIÓN: si no encuentra los elementos, avisa en consola
    if (!hamburger) {
        console.warn('⚠️ No se encontró el botón #hamburger');
    }
    if (!navLinks) {
        console.warn('⚠️ No se encontró el menú #navLinks');
    }

    if (hamburger && navLinks) {
        // Función para abrir/cerrar el menú
        function toggleMenu() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
            console.log('Menú toggled:', navLinks.classList.contains('open')); // Para depurar
        }

        // Evento clic en la hamburguesa
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation(); // Evita que el clic se propague
            toggleMenu();
        });

        // Cerrar menú al hacer clic en un enlace
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });

        // Cerrar menú al hacer clic fuera de él (en el fondo)
        document.addEventListener('click', function(e) {
            if (navLinks.classList.contains('open')) {
                // Si el clic no fue dentro del menú ni en la hamburguesa
                if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('open');
                }
            }
        });

        // Cerrar menú al redimensionar a desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            }
        });

        console.log('✅ Menú hamburguesa inicializado correctamente');
    }

    // ============================================================
    // 2. NAVEGACIÓN · Cambio de estilo al hacer scroll
    // ============================================================
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ============================================================
    // 3. GALERÍA · Lightbox al hacer clic en imágenes
    // ============================================================
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (!img) return;

            // Obtener la URL de la imagen
            let imgSrc = img.src;

            // Si es placeholder de Unsplash, usar una versión más grande
            if (imgSrc.includes('unsplash')) {
                imgSrc = imgSrc.replace('w=800&h=600', 'w=1200&h=900');
            }

            // Crear modal
            const modal = document.createElement('div');
            modal.className = 'lightbox-modal';
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');

            // Botón cerrar
            const closeBtn = document.createElement('span');
            closeBtn.className = 'close-lightbox';
            closeBtn.innerHTML = '✕';
            closeBtn.setAttribute('aria-label', 'Cerrar');
            modal.appendChild(closeBtn);

            // Imagen
            const modalImg = document.createElement('img');
            modalImg.src = imgSrc;
            modalImg.alt = img.alt || 'Tatuaje';
            modal.appendChild(modalImg);

            // Cerrar al hacer clic fuera de la imagen (en el fondo)
            modal.addEventListener('click', function(e) {
                if (e.target === modal || e.target === closeBtn) {
                    modal.remove();
                }
            });

            // Cerrar con tecla ESC
            modal.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    modal.remove();
                }
            });

            document.body.appendChild(modal);
            modal.focus();
        });
    });

    // ============================================================
    // 4. PARTÍCULAS (fondo animado) con Canvas
    // ============================================================
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId = null;
        let isVisible = true;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Rebote en bordes
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(197, 160, 89, ${this.opacity})`;
                ctx.fill();
            }
        }

        function initParticles() {
            const count = Math.min(
                80,
                Math.floor((canvas.width * canvas.height) / 15000)
            );
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            const maxDistance = 150;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const opacity = (1 - distance / maxDistance) * 0.3;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(197, 160, 89, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            if (!isVisible) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            connectParticles();

            animationId = requestAnimationFrame(animateParticles);
        }

        function startParticles() {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            isVisible = true;
            initParticles();
            animateParticles();
        }

        function stopParticles() {
            isVisible = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        }

        // Iniciar partículas
        startParticles();

        // Detener partículas en móvil para ahorrar batería
        let isMobile = window.innerWidth < 768;
        if (isMobile) {
            stopParticles();
        }

        window.addEventListener('resize', function() {
            resizeCanvas();
            const mobile = window.innerWidth < 768;
            if (mobile && isVisible) {
                stopParticles();
            } else if (!mobile && !isVisible) {
                startParticles();
            }
        });

        // Detener animación cuando la pestaña no está visible
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                stopParticles();
            } else {
                startParticles();
            }
        });

        console.log('✅ Partículas inicializadas correctamente');
    }

    // ============================================================
    // 5. ENLACES SUAVES · Scroll suave para todos los enlaces
    // ============================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navbarHeight = document.getElementById('navbar').offsetHeight || 70;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    console.log('✅ Natty Tattoos · Todo inicializado correctamente');
});