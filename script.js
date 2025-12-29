/* =================================
   💕 Romantic Birthday Website Script
   ================================= */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMusicPlayer();
    initGallery();
    initQuotesCarousel();
    initScrollAnimations();
    initFloatingHearts();
    initConfetti();
    initScrollToTop();
    initMakeWish();
    initLoveStats();
});

/* =================================
   Navigation
   ================================= */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    // Mobile menu toggle
    navToggle?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close menu on link click
    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* =================================
   Music Player
   ================================= */
function initMusicPlayer() {
    const musicPlayer = document.getElementById('musicPlayer');
    const playerToggle = document.getElementById('playerToggle');
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    const progress = document.getElementById('progress');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const volumeSlider = document.getElementById('volumeSlider');
    const songTitle = document.getElementById('songTitle');
    const songArtist = document.getElementById('songArtist');
    const playlistItems = document.querySelectorAll('.playlist-item');

    let audio = new Audio();
    let currentSongIndex = 0;

    // Toggle player visibility
    playerToggle?.addEventListener('click', () => {
        musicPlayer.classList.toggle('active');
    });

    function playMusic() {
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                playBtn.textContent = '⏸';
                musicPlayer.classList.add('playing');
            }).catch(error => {
                console.log("Autoplay prevented. Waiting for user interaction.");
            });
        }
    }

    function pauseMusic() {
        audio.pause();
        playBtn.textContent = '▶';
        musicPlayer.classList.remove('playing');
    }

    // Play/Pause toggle
    playBtn?.addEventListener('click', () => {
        if (audio.paused) {
            playMusic();
        } else {
            pauseMusic();
        }
    });

    // Load song from playlist
    playlistItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            loadSong(index);
            playMusic();
        });
    });

    function loadSong(index) {
        const item = playlistItems[index];
        if (!item) return;

        // Update active state
        playlistItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        // Load audio
        const src = item.dataset.src;
        const title = item.dataset.title || 'Unknown Song';
        const artist = item.dataset.artist || 'Unknown Artist';

        audio.src = src;
        songTitle.textContent = title;
        songArtist.textContent = artist;
        currentSongIndex = index;

        audio.load();
    }

    // Next/Previous buttons
    prevBtn?.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex - 1 + playlistItems.length) % playlistItems.length;
        loadSong(currentSongIndex);
        playMusic();
    });

    nextBtn?.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex + 1) % playlistItems.length;
        loadSong(currentSongIndex);
        playMusic();
    });

    // Update progress bar
    audio.addEventListener('timeupdate', () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = `${percent}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('ended', () => {
        currentSongIndex = (currentSongIndex + 1) % playlistItems.length;
        loadSong(currentSongIndex);
        playMusic();
    });

    // Click on progress bar to seek
    progressBar?.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
    });

    // Volume control
    volumeSlider?.addEventListener('input', (e) => {
        audio.volume = e.target.value / 100;
    });

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Initialize volume
    audio.volume = 0.7;
    
    // Initialize volume
    audio.volume = 0.7;
    
    // Load first song
    loadSong(0);

    // Welcome Overlay Logic
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    const enterBtn = document.getElementById('enterBtn');

    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            // 1. Play Music
            playMusic();
            
            // 2. Hide Overlay
            welcomeOverlay.classList.add('hidden');
            
            // 3. Launch Confetti
            if (window.launchConfetti) window.launchConfetti(200);
            
            // 4. Start Floating Hearts if they were paused (optional)
        });
    } else {
        // Fallback if overlay is missing
        playMusic();
    }
}

/* =================================
   Photo Gallery & Lightbox
   ================================= */
function initGallery() {
    const galleryGrid = document.querySelector('.gallery-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    // Asset Configuration
    // Generated based on file list: 1-74 images (mixed exts), plus videos
    const assets = [
        // Videos
        { type: 'video', src: 'images/32.mp4' },
        { type: 'video', src: 'images/39.mp4' },
        { type: 'video', src: 'images/42.mp4' },
        { type: 'video', src: 'images/51.mp4' },
        { type: 'video', src: 'images/55.mp4' },
        { type: 'video', src: 'images/59.mp4' },
        { type: 'video', src: 'images/60.mp4' },
        { type: 'video', src: 'images/61.mp4' },
        { type: 'video', src: 'images/62.mp4' },
        { type: 'video', src: 'images/71.mp4' },
    ];

    // Add Images 1-74
    // Hardcoding specific known extensions, defaulting rest to .jpg
    const specialExtensions = {
        6: 'jpeg',
        66: 'webp',
        73: 'webp'
    };

    const missingImages = [32, 39, 42, 51, 55, 59, 60, 61, 62, 71]; // These are videos, so skip if image file doesn't exist (assuming mapped by number)
    // Actually, based on file list, numbers are unique across types mostly, or coexist.
    // Let's just iterate 1 to 74. If it's in the video list above, we might have skipped it or it's a diff file.
    // Looking at file list: 32.mp4 exists. 32.jpg does NOT appear in the list.
    // So distinct numbers for videos vs images mostly?
    // Let's allow for the full range and catch errors or just filter based on what we saw.
    // To be safe and precise, I'll list the ranges or check against known files.
    // simpler approach: iterate 1 to 74.
    
    for (let i = 1; i <= 74; i++) {
        // Skip if it's a known video number and no image exists (based on previous scan)
        // Previous scan showed: 32.mp4 (no 32.jpg), 39.mp4 (no 39.jpg), etc.
        // So we can assume numbers are unique identifiers.
        if ([32, 39, 42, 51, 55, 59, 60, 61, 62, 71].includes(i)) continue;

        const ext = specialExtensions[i] || 'jpg';
        assets.push({ type: 'image', src: `images/${i}.${ext}`, caption: `Memory #${i} 💕` });
    }

    // Shuffle assets for a random mix (optional, but nice)
    // assets.sort(() => Math.random() - 0.5); 
    // Keeping them ordered for now or maybe shuffle slightly? 
    // Let's just keep videos mixed in at the start or dispersed?
    // Let's shuffle them to make the collage look balanced (videos mixed with images)
    assets.sort(() => Math.random() - 0.5);


    // Render Gallery
    assets.forEach((asset, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.setAttribute('data-aos', 'fade-up');
        
        const card = document.createElement('div');
        card.className = 'gallery-card';
        
        let mediaEl;
        if (asset.type === 'video') {
            mediaEl = document.createElement('video');
            mediaEl.className = 'gallery-video';
            mediaEl.src = asset.src;
            mediaEl.muted = true;
            mediaEl.autoplay = true;
            mediaEl.loop = true;
            mediaEl.playsInline = true;
            // Ensure muted autoplay works
            mediaEl.setAttribute('muted', '');
            mediaEl.setAttribute('autoplay', '');
            mediaEl.setAttribute('loop', '');
            mediaEl.setAttribute('playsinline', '');
        } else {
            mediaEl = document.createElement('img');
            mediaEl.className = 'gallery-img';
            mediaEl.src = asset.src;
            mediaEl.alt = asset.caption;
            mediaEl.loading = 'lazy'; // Performance
        }
        
        // Add click listener for lightbox
        card.addEventListener('click', () => {
            openLightbox(index);
        });

        // Overlay
        const overlay = document.createElement('div');
        overlay.className = 'gallery-overlay';
        const caption = document.createElement('p');
        caption.className = 'gallery-caption';
        caption.textContent = asset.caption || 'Beautiful Moment ✨';
        
        overlay.appendChild(caption);
        card.appendChild(mediaEl);
        card.appendChild(overlay);
        item.appendChild(card);
        galleryGrid.appendChild(item);
    });

    // Re-init AOS for new elements if needed, or just let scroll observer catch them
    // Our initScrollAnimations uses a MutationObserver? No, it queries once. 
    // We should re-run animation observer
    if(window.initScrollAnimations) window.initScrollAnimations();


    // Lightbox Logic
    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function updateLightboxContent() {
        const asset = assets[currentIndex];
        
        // Clear previous content
        lightboxImg.style.display = 'none';
        const existingVideo = lightbox.querySelector('video');
        if (existingVideo) existingVideo.remove();

        if (asset.type === 'video') {
            const video = document.createElement('video');
            video.src = asset.src;
            video.controls = true;
            video.autoplay = true;
            video.className = 'lightbox-img'; // Reuse class for styling
            video.style.maxHeight = '80vh';
            video.style.maxWidth = '90%';
            
            // Insert before caption
            lightbox.insertBefore(video, lightboxCaption);
        } else {
            lightboxImg.src = asset.src;
            lightboxImg.style.display = 'block';
        }
        
        lightboxCaption.textContent = asset.caption || '';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        // Stop video if playing
        const existingVideo = lightbox.querySelector('video');
        if(existingVideo) existingVideo.pause();
    }

    // Event Listeners
    lightboxClose?.addEventListener('click', closeLightbox);
    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    lightboxPrev?.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + assets.length) % assets.length;
        updateLightboxContent();
    });

    lightboxNext?.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % assets.length;
        updateLightboxContent();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxPrev.click();
        if (e.key === 'ArrowRight') lightboxNext.click();
    });
}

/* =================================
   Quotes Carousel
   ================================= */
function initQuotesCarousel() {
    const quoteCards = document.querySelectorAll('.quote-card');
    const quoteDots = document.getElementById('quoteDots');
    const quotePrev = document.getElementById('quotePrev');
    const quoteNext = document.getElementById('quoteNext');

    let currentQuote = 0;
    const totalQuotes = quoteCards.length;

    // Create dots
    quoteCards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('quote-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToQuote(index));
        quoteDots?.appendChild(dot);
    });

    const dots = document.querySelectorAll('.quote-dot');

    function goToQuote(index) {
        // Remove classes from current quote
        quoteCards[currentQuote].classList.remove('active');
        quoteCards[currentQuote].classList.add('prev');
        dots[currentQuote]?.classList.remove('active');

        // Update index
        currentQuote = index;

        // Add classes to new quote
        setTimeout(() => {
            quoteCards.forEach(card => card.classList.remove('prev'));
            quoteCards[currentQuote].classList.add('active');
            dots[currentQuote]?.classList.add('active');
        }, 50);
    }

    function nextQuote() {
        goToQuote((currentQuote + 1) % totalQuotes);
    }

    function prevQuote() {
        goToQuote((currentQuote - 1 + totalQuotes) % totalQuotes);
    }

    quotePrev?.addEventListener('click', prevQuote);
    quoteNext?.addEventListener('click', nextQuote);

    // Auto-advance quotes every 5 seconds
    setInterval(nextQuote, 5000);
}

/* =================================
   Scroll Animations (AOS alternative)
   ================================= */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.aosDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
}

/* =================================
   Floating Hearts Background
   ================================= */
function initFloatingHearts() {
    const container = document.getElementById('heartsContainer');
    const hearts = ['💕', '💖', '💗', '💝', '💓', '❤️', '💘', '💞'];

    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart-bg');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
        heart.style.fontSize = (Math.random() * 15 + 15) + 'px';
        container.appendChild(heart);

        // Remove heart after animation
        setTimeout(() => {
            heart.remove();
        }, 20000);
    }

    // Create hearts periodically
    setInterval(createHeart, 2000);

    // Create initial hearts
    for (let i = 0; i < 10; i++) {
        setTimeout(createHeart, i * 300);
    }
}

/* =================================
   Confetti Effect
   ================================= */
function initConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const confettiPieces = [];
    const colors = ['#ff6b9d', '#ff4081', '#e91e63', '#9c27b0', '#ffc0cb', '#ffb6c1', '#ff69b4', '#ffd700'];

    class Confetti {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 10 + 5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.speedY = Math.random() * 3 + 2;
            this.speedX = Math.random() * 2 - 1;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 10 - 5;
            this.opacity = 1;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
            
            if (this.y > canvas.height + 50) {
                this.opacity -= 0.02;
                if (this.opacity <= 0) {
                    return false;
                }
            }
            return true;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size / 2);
            ctx.restore();
        }
    }

    function launchConfetti(count = 100) {
        for (let i = 0; i < count; i++) {
            const confetti = new Confetti();
            confetti.y = -Math.random() * 300;
            confettiPieces.push(confetti);
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = confettiPieces.length - 1; i >= 0; i--) {
            const confetti = confettiPieces[i];
            if (!confetti.update()) {
                confettiPieces.splice(i, 1);
            } else {
                confetti.draw();
            }
        }

        requestAnimationFrame(animate);
    }

    // Launch confetti on page load
    setTimeout(() => launchConfetti(150), 500);

    // Make launchConfetti available globally for the wish button
    window.launchConfetti = launchConfetti;

    animate();
}

/* =================================
   Scroll to Top Button
   ================================= */
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* =================================
   Make a Wish Button
   ================================= */
function initMakeWish() {
    const makeWishBtn = document.getElementById('makeWishBtn');

    makeWishBtn?.addEventListener('click', () => {
        // Launch confetti celebration
        if (window.launchConfetti) {
            window.launchConfetti(200);
        }

        // Add celebration animation
        makeWishBtn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            makeWishBtn.style.transform = '';
        }, 300);

        // Show celebration message
        const messages = [
            '🎉 Your wish is being sent to the stars! ✨',
            '💕 Wishing you all the happiness in the world! 🌟',
            '🎂 May all your dreams come true! 🦋',
            '✨ The universe heard your wish! 💖',
            '🌈 Magic is happening! 💫'
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        // Create and show toast notification
        showToast(randomMessage);
    });
}

function showToast(message) {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.classList.add('toast-notification');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 150px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        font-size: 1.1rem;
        font-weight: 500;
        box-shadow: 0 10px 40px rgba(255, 107, 157, 0.5);
        z-index: 9999;
        animation: toastSlideUp 0.5s ease;
    `;

    document.body.appendChild(toast);

    // Add animation keyframes if not exists
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes toastSlideUp {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-20px)';
        toast.style.transition = 'all 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

/* =================================
   Love Stats Counter Animation
   ================================= */
function initLoveStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target.dataset.target;
                
                // Skip infinity symbol
                if (target === '∞') {
                    return;
                }
                
                animateCounter(entry.target, parseInt(target));
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    statNumbers.forEach(stat => {
        if (stat.dataset.target !== '∞') {
            observer.observe(stat);
        }
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50; // 50 steps
    const duration = 2000; // 2 seconds
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

/* =================================
   Typewriter Effect (Optional use)
   ================================= */
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Export for potential use
window.typeWriter = typeWriter;
