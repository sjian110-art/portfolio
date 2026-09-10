document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Navigation Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileNavToggle && navMenu) {
        mobileNavToggle.addEventListener('click', () => {
            mobileNavToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // 2. Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Custom Cursors Logic
    const mainCursor = document.getElementById('main-cursor-container');
    const projectCursor = document.getElementById('custom-cursor');
    const projectTriggers = document.querySelectorAll('.project-link-trigger');

    if (mainCursor && projectCursor) {
        const isDesktop = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches;
        
        if (isDesktop) {
            let lastPointerX = window.innerWidth / 2;
            let lastPointerY = window.innerHeight / 2;
            let isProjectHover = false;
            let themeCheckRAF = null;

            function updateCursorThemeAtPoint(x, y) {
                const elements = document.elementsFromPoint(x, y);
                let theme = 'light';
                for (let el of elements) {
                    const themeEl = el.closest('[data-cursor-theme]');
                    if (themeEl) {
                        theme = themeEl.getAttribute('data-cursor-theme');
                        break;
                    }
                }
                mainCursor.setAttribute('data-theme', theme);
            }
            
            // Track mouse movement
            document.addEventListener('mousemove', (e) => {
                lastPointerX = e.clientX;
                lastPointerY = e.clientY;
                
                // Immediate update for container and project cursor
                if (isProjectHover) {
                    projectCursor.style.left = lastPointerX + 'px';
                    projectCursor.style.top = lastPointerY + 'px';
                }
                mainCursor.style.transform = `translate3d(${lastPointerX}px, ${lastPointerY}px, 0)`;
                
                updateCursorThemeAtPoint(lastPointerX, lastPointerY);
            });

            // Handle scroll and resize for theme updates
            function handleScrollOrResize() {
                if (themeCheckRAF) return;
                themeCheckRAF = requestAnimationFrame(() => {
                    updateCursorThemeAtPoint(lastPointerX, lastPointerY);
                    themeCheckRAF = null;
                });
            }
            
            document.addEventListener('scroll', handleScrollOrResize, { passive: true });
            window.addEventListener('resize', handleScrollOrResize, { passive: true });

            // Hide/Show main cursor when mouse leaves/enters window
            document.addEventListener('mouseleave', () => mainCursor.classList.add('is-hidden'));
            document.addEventListener('mouseenter', () => mainCursor.classList.remove('is-hidden'));

            // Hover states for generic clickable elements
            const hoverElements = document.querySelectorAll('a, button, .nav-link, .email-cta');
            hoverElements.forEach(el => {
                el.addEventListener('mouseenter', () => mainCursor.classList.add('is-hovering'));
                el.addEventListener('mouseleave', () => mainCursor.classList.remove('is-hovering'));
            });

            // Click state
            document.addEventListener('mousedown', () => {
                mainCursor.classList.add('is-clicking');
                projectCursor.classList.add('is-clicking');
            });
            document.addEventListener('mouseup', () => {
                mainCursor.classList.remove('is-clicking');
                projectCursor.classList.remove('is-clicking');
            });

            // Project Cursor Interaction
            projectTriggers.forEach(trigger => {
                trigger.addEventListener('mouseenter', () => {
                    isProjectHover = true;
                    mainCursor.classList.add('is-hidden');
                    const colorTheme = trigger.getAttribute('data-cursor-color');
                    if (colorTheme) {
                        projectCursor.setAttribute('data-theme', colorTheme);
                    } else {
                        projectCursor.removeAttribute('data-theme');
                    }
                    projectCursor.classList.add('active');
                });
                trigger.addEventListener('mouseleave', () => {
                    isProjectHover = false;
                    mainCursor.classList.remove('is-hidden');
                    projectCursor.classList.remove('active');
                });
                
                trigger.addEventListener('click', () => {
                    const link = trigger.getAttribute('data-link');
                    if (link) {
                        window.open(link, '_blank');
                    }
                });
            });
        }
    }

    // 4. Hero Parallax / Mousemove Interaction
    const orbitWrapper = document.querySelector('.hero-orbit-wrapper');
    if (orbitWrapper) {
        let isOrbitHover = false;
        let orbitScale = 1;
        let orbitHoverY = 0;
        let parallaxX = 0;
        let parallaxY = 0;

        orbitWrapper.addEventListener('mouseenter', () => isOrbitHover = true);
        orbitWrapper.addEventListener('mouseleave', () => isOrbitHover = false);

        document.addEventListener('mousemove', (e) => {
            const isDesktop = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches;
            if (isDesktop) {
                // 1.5배 강화: 50 -> 33
                parallaxX = (window.innerWidth / 2 - e.pageX) / 33;
                parallaxY = (window.innerHeight / 2 - e.pageY) / 33;
                // 최대 이동량 18px로 제한
                parallaxX = Math.max(-18, Math.min(18, parallaxX));
                parallaxY = Math.max(-18, Math.min(18, parallaxY));
            }
        });

        function animateOrbitWrapper() {
            const isDesktop = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches;
            // scale: 약 1.06~1.08, translateY: -14px~-20px
            const targetScale = (isDesktop && isOrbitHover) ? 1.07 : 1;
            const targetHoverY = (isDesktop && isOrbitHover) ? -16 : 0;
            
            // cubic-bezier(0.22, 1, 0.36, 1)와 유사한 빠르고 부드러운 lerp (factor 0.12)
            orbitScale += (targetScale - orbitScale) * 0.12;
            orbitHoverY += (targetHoverY - orbitHoverY) * 0.12;
            
            // 하나의 transform 구조로 통합
            orbitWrapper.style.transform = `translateY(-50%) translate(${parallaxX}px, ${parallaxY}px) translateY(${orbitHoverY}px) scale(${orbitScale})`;
            
            requestAnimationFrame(animateOrbitWrapper);
        }
        animateOrbitWrapper();
    }

    // 5. Bidirectional Scroll Reveal Animation
    const revealItems = document.querySelectorAll('.reveal-clip, .reveal-text');
    
    // Scroll direction tracking
    let lastScrollY = window.scrollY;
    let scrollDir = 'down';

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY + 5) {
            scrollDir = 'down';
        } else if (currentScrollY < lastScrollY - 5) {
            scrollDir = 'up';
        }
        lastScrollY = currentScrollY;
    }, { passive: true });

    // Group items for dynamic stagger
    const groupedItems = [];
    const processedItems = new Set();
    
    // Sections and containers that act as stagger groups
    const groupSelectors = [
        '.hero-content', 
        '.about-container', 
        '.projects-intro', 
        '.p-mallang .project-container', 
        '.p-diptyque .project-container', 
        '.p-kaeri .project-container', 
        '.skills-container', 
        '.contact-container'
    ];
    
    groupSelectors.forEach(selector => {
        const container = document.querySelector(selector);
        if (container) {
            const items = Array.from(container.querySelectorAll('.reveal-clip, .reveal-text')).filter(item => !processedItems.has(item));
            if (items.length > 0) {
                groupedItems.push({ container, items });
                items.forEach(i => processedItems.add(i));
            }
        }
    });

    // Any leftover reveal elements get their own group
    const leftOvers = Array.from(revealItems).filter(item => !processedItems.has(item));
    leftOvers.forEach(item => {
        groupedItems.push({ container: item.parentElement, items: [item] });
    });

    // Assign data attributes for indexing
    groupedItems.forEach(group => {
        group.items.forEach((item, idx) => {
            item.dataset.idx = idx;
            item.dataset.total = group.items.length;
        });
    });

    // Observer 1: Reveal items when they enter the viewport
    const revealOptions = {
        threshold: 0.02,
        rootMargin: "0px 0px 5% 0px" // Trigger slightly before it fully enters
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                if (!item.classList.contains('is-visible')) {
                    const idx = parseInt(item.dataset.idx);
                    const total = parseInt(item.dataset.total);
                    const delayStep = 0.05; // 0.05s stagger step
                    
                    let delay = 0;
                    // Apply DOM order delay when scrolling down, reverse delay when scrolling up
                    if (scrollDir === 'down') {
                        delay = idx * delayStep;
                    } else {
                        delay = (total - 1 - idx) * delayStep;
                    }

                    item.style.transitionDelay = delay + 's';
                    void item.offsetWidth; // Force reflow to ensure transition-delay applies
                    item.classList.add('is-visible');
                }
            }
        });
    }, revealOptions);

    // Observer 2: Reset items ONLY when they are completely out of view (150px safety margin)
    const resetOptions = {
        threshold: 0,
        rootMargin: "150px 0px 150px 0px"
    };

    const resetObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                const item = entry.target;
                // Header and Hero elements should never reset
                const isHero = item.closest('#hero');
                const isHeader = item.closest('#header');
                
                if (!isHero && !isHeader) {
                    item.classList.remove('is-visible');
                    item.style.transitionDelay = '0s'; // Reset delay so it hides instantly
                }
            }
        });
    }, resetOptions);
    
    revealItems.forEach(item => {
        revealObserver.observe(item);
        resetObserver.observe(item);
    });

    // 5-B. Custom Observer for Process Animation
    const processObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-animated');
            } else {
                entry.target.classList.remove('is-animated');
            }
        });
    }, { 
        threshold: 0,
        rootMargin: "0px 0px -25% 0px" // Trigger when element is 75% visible in viewport
    });
    
    document.querySelectorAll('.animate-process').forEach(item => {
        processObserver.observe(item);
    });

    // 6. rAF Fallback for fast scrolling / navigation jumps
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const triggerBottom = window.innerHeight * 1.05; 
                revealItems.forEach(item => {
                    const rect = item.getBoundingClientRect();
                    // Fallback Reveal: If it's in the viewport but missed by IO
                    if (!item.classList.contains('is-visible')) {
                        if (rect.top < triggerBottom && rect.bottom > 0) {
                            item.style.transitionDelay = '0s'; // fast reveal without delay
                            item.classList.add('is-visible');
                        }
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Initial check on load for items already in viewport
    setTimeout(() => {
        revealItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                item.classList.add('is-visible');
            }
        });
    }, 50);

    // 7. Copy Email to Clipboard
    const copyBtn = document.getElementById('copy-email-btn');
    const copyToast = document.getElementById('copy-toast');
    let toastTimeout;

    if (copyBtn && copyToast) {
        const copyEmail = async () => {
            const email = 'lars00@naver.com';
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(email);
                    showToast('이메일 주소가 복사되었습니다.');
                } else {
                    // Fallback
                    const textArea = document.createElement("textarea");
                    textArea.value = email;
                    textArea.style.position = "fixed";
                    textArea.style.left = "-999999px";
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    try {
                        document.execCommand('copy');
                        showToast('이메일 주소가 복사되었습니다.');
                    } catch (err) {
                        showToast('이메일 주소를 복사하지 못했습니다.');
                    }
                    textArea.remove();
                }
            } catch (err) {
                showToast('이메일 주소를 복사하지 못했습니다.');
            }
        };

        const showToast = (message) => {
            const toastTextSpan = copyToast.querySelector('.toast-text');
            if (toastTextSpan) {
                toastTextSpan.textContent = message;
            }
            copyToast.classList.add('show');
            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                copyToast.classList.remove('show');
            }, 2000);
        };

        const triggerClickFlash = () => {
            const emailText = copyBtn.querySelector('.email-text');
            if (emailText) {
                emailText.classList.remove('flash-click');
                void emailText.offsetWidth; // force reflow
                emailText.classList.add('flash-click');
            }
        };

        copyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            copyEmail();
            triggerClickFlash();
        });

        copyBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                copyEmail();
                triggerClickFlash();
            }
        });

        const contactSection = document.getElementById('contact');
        const emailAttentionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const emailGroup = copyBtn.querySelector('.email-text-group');
                    const emailUnderline = copyBtn.querySelector('.email-underline');
                    
                    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                        copyBtn.classList.remove('email-attention');
                        void copyBtn.offsetWidth;
                        copyBtn.classList.add('email-attention');
                        
                        if (emailGroup) {
                            emailGroup.classList.remove('email-attention');
                            void emailGroup.offsetWidth;
                            emailGroup.classList.add('email-attention');
                        }
                        if (emailUnderline) {
                            emailUnderline.classList.remove('email-attention');
                            void emailUnderline.offsetWidth;
                            emailUnderline.classList.add('email-attention');
                        }
                        
                        setTimeout(() => {
                            copyBtn.classList.remove('email-attention');
                            if (emailGroup) emailGroup.classList.remove('email-attention');
                            if (emailUnderline) {
                                emailUnderline.classList.remove('email-attention');
                                emailUnderline.classList.add('has-grown');
                            }
                        }, 1500);
                    } else {
                        if (emailUnderline) emailUnderline.classList.add('has-grown');
                    }
                    observer.unobserve(copyBtn);
                }
            });
        }, { threshold: 0.6 });
        
        if (copyBtn) {
            emailAttentionObserver.observe(copyBtn);
        }
    }

    // 8. KAERI Gallery Swap Logic
    const kaeriMainImg = document.getElementById('kaeri-main-img');
    const kaeriThumbs = document.querySelectorAll('.data-thumb');

    if (kaeriMainImg && kaeriThumbs.length > 0) {
        kaeriThumbs.forEach(thumbBtn => {
            thumbBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const thumbImg = thumbBtn.querySelector('img');
                if (!thumbImg) return;

                // Fade out main image
                kaeriMainImg.style.opacity = '0';

                // Wait for fade out to complete (0.4s)
                setTimeout(() => {
                    // Swap src and alt
                    const tempSrc = kaeriMainImg.src;
                    const tempAlt = kaeriMainImg.alt;

                    kaeriMainImg.src = thumbImg.src;
                    kaeriMainImg.alt = thumbImg.alt;

                    thumbImg.src = tempSrc;
                    thumbImg.alt = tempAlt;

                    // Fade in main image
                    kaeriMainImg.style.opacity = '1';
                }, 400);
            });
        });
    }

    // 9. Skills Counter & Progress Bar
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const skillCategories = document.querySelectorAll('.section-skills .skill-category');
    
    const easeOutQuad = t => t * (2 - t);
    const animDuration = 1000; // ~1 second (0.9-1.2s range requested)

    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const category = entry.target;
                
                // Progress bar fill
                const progressFill = category.querySelector('.skill-progress-fill');
                if (progressFill) {
                    const percent = progressFill.dataset.percent;
                    if (prefersReducedMotion) {
                        progressFill.style.transition = 'none';
                        progressFill.style.width = percent + '%';
                    } else {
                        // Apply width to trigger CSS transition defined in style.css
                        setTimeout(() => {
                            progressFill.style.width = percent + '%';
                        }, 50); // slight delay to ensure browser paints initial state
                    }
                }
                
                // Number Counter
                const counterSpan = category.querySelector('.count-up');
                if (counterSpan) {
                    const target = parseInt(counterSpan.dataset.target, 10);
                    if (prefersReducedMotion) {
                        counterSpan.textContent = target;
                    } else {
                        let startTime = null;
                        const animateCount = (timestamp) => {
                            if (!startTime) startTime = timestamp;
                            const progress = timestamp - startTime;
                            const timeRatio = Math.min(progress / animDuration, 1);
                            const easeRatio = easeOutQuad(timeRatio);
                            
                            const currentVal = Math.floor(easeRatio * target);
                            counterSpan.textContent = currentVal;
                            
                            if (progress < animDuration) {
                                requestAnimationFrame(animateCount);
                            } else {
                                counterSpan.textContent = target; // ensure exact final value
                            }
                        };
                        requestAnimationFrame(animateCount);
                    }
                }
                
                // Run only once per page load
                observer.unobserve(category);
            }
        });
    }, { threshold: 0.1 }); // triggers slightly after coming into view

    skillCategories.forEach(cat => {
        skillsObserver.observe(cat);
    });

    // 10. Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        const checkScroll = () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('is-visible');
            } else {
                backToTopBtn.classList.remove('is-visible');
            }
        };
        
        // Use the existing ticking logic from scroll event listener if possible, 
        // but adding another independent one is fine since scroll events are lightweight with rAF
        let bttTicking = false;
        window.addEventListener('scroll', () => {
            if (!bttTicking) {
                window.requestAnimationFrame(() => {
                    checkScroll();
                    bttTicking = false;
                });
                bttTicking = true;
            }
        });
        
        // Initial check
        checkScroll();

        const scrollToTop = () => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        };

        backToTopBtn.addEventListener('click', scrollToTop);
        backToTopBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollToTop();
            }
        });
    }

    // 10. Diptyque Gallery Interaction
    const diptyqueSection = document.querySelector("#project-diptyque");
    if (diptyqueSection) {
        const mainImage = diptyqueSection.querySelector("[data-diptyque-main]");
        const mainLabel = diptyqueSection.querySelector("[data-diptyque-main-label]");
        const thumbnails = diptyqueSection.querySelectorAll("[data-diptyque-thumbnail]");

        let isTransitioning = false;

        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (isTransitioning) return;
                isTransitioning = true;

                // Update selected state
                thumbnails.forEach(t => t.classList.remove('selected'));
                thumbnail.classList.add('selected');


                const thumbImage = thumbnail.querySelector('.d-img-sub');
                const thumbLabel = thumbnail.querySelector('[data-diptyque-sub-label]');

                const currentMainSrc = mainImage.getAttribute('src');
                const currentMainAlt = mainImage.getAttribute('alt');
                const currentMainFrame = mainImage.getAttribute('data-frame');
                const currentMainTitle = mainImage.getAttribute('data-title');
                
                const currentThumbSrc = thumbImage.getAttribute('src');
                const currentThumbAlt = thumbImage.getAttribute('alt');
                const currentThumbFrame = thumbImage.getAttribute('data-frame');
                const currentThumbTitle = thumbImage.getAttribute('data-title');

                mainImage.classList.add('fade-out');
                mainLabel.classList.add('fade-out');

                setTimeout(() => {
                    mainImage.setAttribute('src', currentThumbSrc);
                    mainImage.setAttribute('alt', currentThumbAlt);
                    mainImage.setAttribute('data-frame', currentThumbFrame);
                    mainImage.setAttribute('data-title', currentThumbTitle);
                    mainLabel.textContent = `FRAME NO. ${currentThumbFrame} — ${currentThumbTitle}`;

                    thumbImage.setAttribute('src', currentMainSrc);
                    thumbImage.setAttribute('alt', currentMainAlt);
                    thumbImage.setAttribute('data-frame', currentMainFrame);
                    thumbImage.setAttribute('data-title', currentMainTitle);
                    thumbLabel.textContent = `NO. ${currentMainFrame}`;

                    mainImage.classList.remove('fade-out');
                    mainLabel.classList.remove('fade-out');
                    
                    setTimeout(() => {
                        isTransitioning = false;
                    }, 200);
                }, 200);
            });
        });
    }

    // 11. Thumbnail Entry Animation & Notice Text Interactions
    const projectsWithThumbs = [
        { section: document.querySelector('#project-diptyque'), thumbs: '.d-sub-wrapper', notice: '.d-sub-gallery-notice .notice-right' },
        { section: document.querySelector('#project-kaeri'), thumbs: '.data-thumb', notice: '.data-thumb-notice .notice-right' }
    ];

    projectsWithThumbs.forEach(proj => {
        if (!proj.section) return;
        const thumbnails = proj.section.querySelectorAll(proj.thumbs);
        const noticeRight = proj.section.querySelector(proj.notice);
        if (thumbnails.length === 0 || !noticeRight) return;

        // Entry Animation (IntersectionObserver)
        let hasAnimated = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                if (entry.isIntersecting && !hasAnimated && !prefersReducedMotion) {
                    hasAnimated = true;
                    
                    noticeRight.classList.add('bump-arrow');

                    if (proj.section.id === 'project-kaeri') {
                        const noticeWrapper = proj.section.querySelector('.data-thumb-notice');
                        if (noticeWrapper) {
                            noticeWrapper.classList.add('kaeri-notice-entry');
                        }
                    } else if (proj.section.id === 'project-diptyque') {
                        const noticeWrapper = proj.section.querySelector('.d-sub-gallery-notice');
                        if (noticeWrapper) {
                            noticeWrapper.classList.add('diptyque-notice-entry');
                        }
                    }
                    
                    thumbnails.forEach((thumb, index) => {
                        setTimeout(() => {
                            thumb.classList.add('thumb-entry-bounce');
                            setTimeout(() => {
                                thumb.classList.remove('thumb-entry-bounce');
                            }, 350); 
                        }, index * 120); 
                    });

                    setTimeout(() => {
                        noticeRight.classList.remove('bump-arrow');
                    }, 350);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(proj.section);

        // Click Feedback & Accessibility
        thumbnails.forEach((thumb) => {
            // A11y keyboard support
            thumb.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    thumb.click();
                }
            });

            // Click notice feedback
            thumb.addEventListener('click', () => {
                let frameNum = "";
                const img = thumb.querySelector('img');
                if (img && img.src) {
                    const match = img.src.match(/-(\d{2})\.(jpg|png)/i);
                    if (match) {
                        frameNum = match[1];
                    }
                }

                if (frameNum) {
                    noticeRight.innerHTML = `VIEWING FRAME ${frameNum}`;
                    if (noticeRight.timeoutId) clearTimeout(noticeRight.timeoutId);
                    noticeRight.timeoutId = setTimeout(() => {
                        noticeRight.innerHTML = `<span class="arrow" style="font-size: 1.2em; display: inline-block;">↓</span> CLICK TO PREVIEW`;
                    }, 1000);
                }
            });
        });
    });

    // 12. Mallang Lightbox Modal Logic
    const mallangPhones = Array.from(document.querySelectorAll('.m-phone-wrapper'));
    // Sort phones by data-screen (01 to 04) so navigation is sequential left-to-right
    mallangPhones.sort((a, b) => a.dataset.screen.localeCompare(b.dataset.screen));
    
    const mModal = document.getElementById('mallang-modal');
    if (mModal && mallangPhones.length > 0) {
        const mModalImg = mModal.querySelector('.m-modal-img');
        const mModalCounter = mModal.querySelector('.m-modal-counter');
        const mModalClose = mModal.querySelector('.m-modal-close');
        const mModalPrev = mModal.querySelector('.m-modal-nav.prev');
        const mModalNext = mModal.querySelector('.m-modal-nav.next');
        const mModalOverlay = mModal.querySelector('.m-modal-overlay');

        let currentModalIndex = 0;
        let previouslyFocusedElement = null;

        const updateModal = (index) => {
            currentModalIndex = index;
            const phone = mallangPhones[index];
            const img = phone.querySelector('img');
            if (img) {
                mModalImg.src = img.src;
                mModalImg.alt = img.alt;
            }
            mModalCounter.textContent = `${phone.dataset.screen} / 04`;
            
            mModalPrev.disabled = index === 0;
            mModalNext.disabled = index === mallangPhones.length - 1;
        };

        const openModal = (index) => {
            previouslyFocusedElement = document.activeElement;
            updateModal(index);
            mModal.classList.add('is-active');
            mModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Lock scroll
            mModalClose.focus();
        };

        const closeModal = () => {
            mModal.classList.remove('is-active');
            mModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Restore scroll
            if (previouslyFocusedElement) {
                previouslyFocusedElement.focus();
            }
        };

        // Click listeners on phones
        document.querySelectorAll('.m-phone-wrapper').forEach(wrapper => {
            wrapper.addEventListener('click', (e) => {
                const screenStr = wrapper.dataset.screen;
                const idx = mallangPhones.findIndex(p => p.dataset.screen === screenStr);
                if (idx !== -1) openModal(idx);
            });
            // Also trigger on tag click (bubbling will handle it, but prevent default just in case)
            const tag = wrapper.querySelector('.m-tag');
            if (tag) {
                tag.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const screenStr = wrapper.dataset.screen;
                    const idx = mallangPhones.findIndex(p => p.dataset.screen === screenStr);
                    if (idx !== -1) openModal(idx);
                });
            }
        });

        // Navigation listeners
        mModalPrev.addEventListener('click', () => {
            if (currentModalIndex > 0) updateModal(currentModalIndex - 1);
        });
        mModalNext.addEventListener('click', () => {
            if (currentModalIndex < mallangPhones.length - 1) updateModal(currentModalIndex + 1);
        });

        // Close listeners
        mModalClose.addEventListener('click', closeModal);
        mModalOverlay.addEventListener('click', closeModal);

        // Keyboard navigation and escape
        document.addEventListener('keydown', (e) => {
            if (!mModal.classList.contains('is-active')) return;
            
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft' && currentModalIndex > 0) updateModal(currentModalIndex - 1);
            if (e.key === 'ArrowRight' && currentModalIndex < mallangPhones.length - 1) updateModal(currentModalIndex + 1);
            
            // Basic focus trap
            if (e.key === 'Tab') {
                const focusableElements = mModal.querySelectorAll('button:not([disabled])');
                const first = focusableElements[0];
                const last = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });
    }
    // 10. Render Explore Channels
    const channelData = [
        {
            id: "01",
            title: "NOTION",
            category: "PROCESS & ARCHIVE",
            desc: "기획서와 프로젝트 제작 과정을 기록합니다.",
            url: "https://app.notion.com/p/c60e67e45338825fb8b1019a2226c869"
        },
        {
            id: "02",
            title: "GITHUB",
            category: "CODE & DEVELOPMENT",
            desc: "코드와 프로젝트 구현 기록을 확인할 수 있습니다.",
            url: "https://github.com/sjian110-art"
        },
        {
            id: "03",
            title: "NOTEFOLIO",
            category: "VISUAL PORTFOLIO",
            desc: "앱 소개서와 디자인 결과물을 소개합니다.",
            url: "https://notefolio.net/sjan1102197"
        }
    ];

    const channelContainer = document.getElementById('channel-cards-container');
    if (channelContainer) {
        channelData.forEach(item => {
            const isLink = item.url.trim() !== "";
            const wrapperTag = isLink ? "a" : "div";
            const hrefAttr = isLink ? `href="${item.url}" target="_blank" rel="noopener noreferrer"` : "";
            
            const cardHTML = `
                <${wrapperTag} ${hrefAttr} class="channel-card ${isLink ? '' : 'is-empty'}">
                    <div class="channel-card-corners"></div>
                    <div class="channel-card-content">
                        <div class="cc-header">
                            <span class="cc-id">${item.id} / ${item.title}</span>
                        </div>
                        <div class="cc-body">
                            <h4 class="cc-category">${item.category}</h4>
                            <p class="cc-desc">${item.desc}</p>
                        </div>
                        <div class="cc-footer">
                            <span class="cc-visit">VISIT <span class="visit-arrow">↗</span></span>
                        </div>
                    </div>
                </${wrapperTag}>
            `;
            channelContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    // 11. KAERI to Skills Mask Transition
    const transitionWrapper = document.getElementById('skills-transition');
    const maskBg = document.querySelector('.st-mask-bg');
    const maskFrame = document.getElementById('st-mask-frame');

    if (transitionWrapper && maskBg && maskFrame) {
        let ticking = false;

        function updateTransition() {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            const rect = transitionWrapper.getBoundingClientRect();
            const wrapperTop = rect.top;
            
            let progress = 0;
            if (wrapperTop <= 0) {
                const scrolledPast = -wrapperTop;
                const stickyEl = transitionWrapper.querySelector('.st-sticky');
                const pinDistance = transitionWrapper.offsetHeight - (stickyEl ? stickyEl.offsetHeight : 0);
                progress = pinDistance > 0 ? scrolledPast / pinDistance : 0;
            }

            progress = Math.max(0, Math.min(1, progress));

            const vh = window.innerHeight;
            const vw = window.innerWidth;
            const maxDim = Math.max(vw, vh) * 2; // to fully cover viewport

            // Window starting size
            const startW = 80;
            const startH = 50;

            // Expand fully by progress = 0.5 to leave 50% of scroll for the full image
            const expandProgress = Math.min(1, progress / 0.5);
            
            // Ease the expansion: slow at first, then fast
            const easeProgress = Math.pow(expandProgress, 3);

            let currentW = startW + (maxDim - startW) * easeProgress;
            let currentH = startH + (maxDim - startH) * easeProgress;

            // Frame opacity: fade in, stay, then fade out right before fully expanded
            let frameOpacity = 0;
            if (expandProgress > 0.02 && expandProgress < 0.95) {
                frameOpacity = 1;
            } else if (expandProgress <= 0.02) {
                frameOpacity = expandProgress / 0.02;
            } else {
                frameOpacity = (1 - expandProgress) / 0.05;
            }

            // Text Animations
            const textContainer = document.querySelector('.st-text-container');
            if (textContainer) {
                let labelOp = 0, labelY = 20;
                if (progress > 0.35) {
                    let p = Math.min(1, (progress - 0.35) / 0.05);
                    labelOp = p;
                    labelY = 20 - (p * 20);
                }

                let line1Op = 0, line1Y = 20;
                if (progress > 0.40) {
                    let p = Math.min(1, (progress - 0.40) / 0.05);
                    line1Op = p;
                    line1Y = 20 - (p * 20);
                }

                let line2Op = 0, line2Y = 20;
                if (progress > 0.45) {
                    let p = Math.min(1, (progress - 0.45) / 0.05);
                    line2Op = p;
                    line2Y = 20 - (p * 20);
                }

                let keysOp = 0, keysY = 20;
                if (progress > 0.50) {
                    let p = Math.min(1, (progress - 0.50) / 0.05);
                    keysOp = p;
                    keysY = 20 - (p * 20);
                }

                let containerOp = 1, containerY = 0;
                if (progress > 0.90) {
                    let p = Math.min(1, (progress - 0.90) / 0.10);
                    containerOp = 1 - p;
                    containerY = -30 * p;
                }

                textContainer.style.setProperty('--label-op', labelOp);
                textContainer.style.setProperty('--label-y', `${labelY}px`);
                textContainer.style.setProperty('--line1-op', line1Op);
                textContainer.style.setProperty('--line1-y', `${line1Y}px`);
                textContainer.style.setProperty('--line2-op', line2Op);
                textContainer.style.setProperty('--line2-y', `${line2Y}px`);
                textContainer.style.setProperty('--keys-op', keysOp);
                textContainer.style.setProperty('--keys-y', `${keysY}px`);
                textContainer.style.setProperty('--container-op', containerOp);
                textContainer.style.setProperty('--container-y', `${containerY}px`);
            }

            // Apply CSS variables
            maskBg.style.setProperty('--mask-w', `${currentW}px`);
            maskBg.style.setProperty('--mask-h', `${currentH}px`);
            maskFrame.style.setProperty('--mask-w', `${currentW}px`);
            maskFrame.style.setProperty('--mask-h', `${currentH}px`);
            maskFrame.style.setProperty('--frame-opacity', frameOpacity);

            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateTransition);
                ticking = true;
            }
        });
        window.addEventListener('resize', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateTransition);
                ticking = true;
            }
        });

        updateTransition();
    }

});
