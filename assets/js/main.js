/**
 * PORTFOLIO PAPE MAMADOU DIOP - CYBERSÉCURITÉ & RÉSEAUX
 * Script principal interactif (Canvas Cyber Nodes, Terminal interactif, Typewriter, EmailJS, Modal CV)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. GESTION DU DÉFILEMENT & PROGRESSION
     ========================================================================== */
  const scrollProgress = document.getElementById('scroll-progress');
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = `${progress}%`;

    // Header scrollez
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Bouton retour en haut
    if (window.scrollY > 400) {
      backToTop?.classList.add('visible');
    } else {
      backToTop?.classList.remove('visible');
    }

    // Active nav link spy
    updateActiveNav();
  });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  /* ==========================================================================
     2. AMBIENT GLOW SUIVANT LA SOURIS
     ========================================================================== */
  const ambientGlow = document.getElementById('ambient-glow');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;
    if (ambientGlow) {
      ambientGlow.style.left = `${currentX}px`;
      ambientGlow.style.top = `${currentY}px`;
    }
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  /* ==========================================================================
     3. CANVAS CYBER NODES & CONSTELLATION RÉSEAU
     ========================================================================== */
  const canvas = document.getElementById('cyber-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    });

    const nodeCount = Math.floor(Math.min(width, 1400) / 25);
    const nodes = [];

    class CyberNode {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 1.8 + 1;
        this.color = Math.random() > 0.4 ? '#00ff66' : '#00f0ff';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function initNodes() {
      nodes.length = 0;
      for (let i = 0; i < nodeCount; i++) {
        nodes.push(new CyberNode());
      }
    }
    initNodes();

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Connect nodes with glowing lines
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update();
        nodes[i].draw();

        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.22;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 255, 102, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Connection to mouse
        const mdx = nodes[i].x - mouseX;
        const mdy = nodes[i].y - mouseY;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 160) {
          const alpha = (1 - mDist / 160) * 0.4;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      requestAnimationFrame(renderCanvas);
    }
    renderCanvas();
  }

  /* ==========================================================================
     4. TYPEWRITER (Machine à écrire)
     ========================================================================== */
  const typewriterText = document.getElementById('typewriter-text');
  if (typewriterText) {
    const phrases = [
      'Étudiant en Cybersécurité & Réseaux',
      'Futur Administrateur Sécurité & Systèmes',
      'Passionné par l’Audit & la Défense Réseau',
      'Certifié CCNA & IA Force-N',
      'En recherche active d’un stage'
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function typeLoop() {
      const currentPhrase = phrases[phraseIdx];

      if (!isDeleting) {
        typewriterText.textContent = currentPhrase.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === currentPhrase.length) {
          isDeleting = true;
          setTimeout(typeLoop, 2200);
          return;
        }
        setTimeout(typeLoop, 70);
      } else {
        typewriterText.textContent = currentPhrase.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          isDeleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(typeLoop, 450);
          return;
        }
        setTimeout(typeLoop, 35);
      }
    }
    setTimeout(typeLoop, 500);
  }

  /* ==========================================================================
     5. TERMINAL CYBER INTERACTIF
     ========================================================================== */
  const terminalBody = document.getElementById('terminal-body');
  const quickCmdBtns = document.querySelectorAll('.quick-cmd-btn');

  const commandResponses = {
    whoami: `<p class="term-output">👤 <strong>Pape Mamadou Diop</strong><br>
Étudiant en 1ère année de Licence Cybersécurité (cycle combiné BTS / Licence) à <strong>Groupe ISI (Dakar)</strong>.<br>
Passionné par la sécurisation des architectures réseaux, l'investigation et le développement web.</p>`,
    
    skills: `<p class="term-output">⚡ <strong>Compétences clés :</strong><br>
▸ <em>Réseaux & Sécurité :</em> Cisco IOS, VLSM, Topologies, Kali Linux, OSINT, Wireshark, Nmap<br>
▸ <em>Développement :</em> Langage C, HTML5/CSS3, JavaScript, SQL/Bases de données, WordPress<br>
▸ <em>Multimédia :</em> Photoshop, Sertissage câblage RJ45</p>`,

    experience: `<p class="term-output">💼 <strong>Expérience en entreprise :</strong><br>
▸ <em>Groupe ADAMARIE TGI</em> (Dakar) — Mars à Avril 2025<br>
Rôle : Stagiaire en Maintenance Informatique & Multimédia<br>
Missions : Câblage & sertissage RJ45, conception site web WordPress, réalisations infographiques Photoshop.</p>`,

    certs: `<p class="term-output">📜 <strong>Certifications & Accréditations :</strong><br>
▸ Cisco Networking Academy — CCNA : Présentation des réseaux (Groupe ISI, 2026)<br>
▸ Microsoft & LinkedIn Learning — Préparer votre carrière dans la cybersécurité (2025)<br>
▸ Programme FORCE-N / UNCHK — Intelligence Artificielle pour tous (2026)</p>`,

    contact: `<p class="term-output">📡 <strong>Canaux de communication directs :</strong><br>
▸ Email : <a href="mailto:dioppapemamadou872@gmail.com" style="color:#00ff66;">dioppapemamadou872@gmail.com</a><br>
▸ Téléphone : <a href="tel:+221775350229" style="color:#00f0ff;">+221 77 535 02 29</a><br>
▸ WhatsApp : <a href="https://wa.me/221775350229" target="_blank" style="color:#25D366;">Discuter sur WhatsApp</a><br>
▸ Localisation : Dakar, Sénégal</p>`,

    help: `<p class="term-output">🛠️ <strong>Commandes reconnues :</strong><br>
• <code style="color:#00f0ff;">whoami</code> : Découvrir mon profil et statut<br>
• <code style="color:#00f0ff;">skills</code> : Lister mes compétences techniques<br>
• <code style="color:#00f0ff;">experience</code> : Consulter mes expériences professionnelles<br>
• <code style="color:#00f0ff;">certs</code> : Afficher mes certifications officielles<br>
• <code style="color:#00f0ff;">contact</code> : Obtenir mes coordonnées complètes<br>
• <code style="color:#00f0ff;">clear</code> : Nettoyer la console</p>`
  };

  window.runTerminalCommand = function(cmd) {
    if (!terminalBody) return;
    const cleanCmd = cmd.trim().toLowerCase();

    if (cleanCmd === 'clear') {
      terminalBody.innerHTML = `
        <div class="term-line">
          <span class="term-prompt">diop@isi-cyber:~$</span> 
          <span class="term-cmd">clear</span>
        </div>
        <p class="term-output" style="color:var(--text-muted);">Console réinitialisée. Tapez ou cliquez sur une commande.</p>
      `;
      return;
    }

    const output = commandResponses[cleanCmd] || `<p class="term-output" style="color:#ff3366;">Commande non reconnue: "${cmd}". Tapez 'help' pour la liste.</p>`;

    const cmdBlock = document.createElement('div');
    cmdBlock.innerHTML = `
      <div class="term-line" style="margin-top:12px;">
        <span class="term-prompt">diop@isi-cyber:~$</span> 
        <span class="term-cmd">${cmd}</span>
      </div>
      ${output}
    `;
    terminalBody.appendChild(cmdBlock);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  };

  quickCmdBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) runTerminalCommand(cmd);
    });
  });

  /* ==========================================================================
     6. STATISTIQUES ANIMÉES
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10) || 0;
          const suffix = stat.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 1600;
          const interval = 25;
          const steps = duration / interval;
          const increment = target / steps;

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              stat.textContent = target + suffix;
              clearInterval(timer);
            } else {
              stat.textContent = Math.floor(count) + suffix;
            }
          }, interval);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats');
  if (statsSection) statObserver.observe(statsSection);

  /* ==========================================================================
     7. ANIMATION DES JAUGES DE COMPÉTENCES & ONGLETS
     ========================================================================== */
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width') || '0%';
        bar.style.width = width;
      }
    });
  }, { threshold: 0.15 });

  skillBars.forEach(bar => skillObserver.observe(bar));

  // Onglets de filtre de compétences
  const tabBtns = document.querySelectorAll('.tab-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     8. MODAL VISUALISATION DU CV EN LIGNE
     ========================================================================== */
  const cvModal = document.getElementById('cvModal');
  const openCvBtns = document.querySelectorAll('.open-cv-modal');
  const closeCvBtn = document.getElementById('closeCvModal');

  openCvBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      cvModal?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeCVModalHandler() {
    cvModal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeCvBtn?.addEventListener('click', closeCVModalHandler);

  cvModal?.addEventListener('click', (e) => {
    if (e.target === cvModal) closeCVModalHandler();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cvModal?.classList.contains('active')) {
      closeCVModalHandler();
    }
  });

  /* ==========================================================================
     9. MENU MOBILE TOGGLE
     ========================================================================== */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  mobileToggle?.addEventListener('click', () => {
    mobileDrawer?.classList.toggle('active');
    const icon = mobileToggle.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    }
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer?.classList.remove('active');
      const icon = mobileToggle?.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
      }
    });
  });

  /* ==========================================================================
     10. NOTIFICATION TOAST
     ========================================================================== */
  window.showToast = function(message, isError = false) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');

    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    if (isError) {
      toast.classList.add('error');
      if (toastIcon) toastIcon.className = 'fas fa-exclamation-triangle';
    } else {
      toast.classList.remove('error');
      if (toastIcon) toastIcon.className = 'fas fa-check-circle';
    }

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 5500);
  };

  /* ==========================================================================
     11. EMAILJS & VALIDATION DU FORMULAIRE DE CONTACT
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnSpinner = document.getElementById('btnSpinner');
  const btnText = document.getElementById('btnText');

  // Initialisation sécurisée d'EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init({
      publicKey: "JhrnaSfpFPCPDPUqX"
    });
  }

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('formName')?.value.trim() || '';
    const firstName = document.getElementById('formFirstName')?.value.trim() || '';
    const email = document.getElementById('formEmail')?.value.trim() || '';
    const subject = document.getElementById('formSubject')?.value || '';
    const message = document.getElementById('formMessage')?.value.trim() || '';
    const honeypot = document.getElementById('formHoneypot')?.value || '';

    // Réinitialisation des erreurs visuelles
    document.querySelectorAll('.form-error-msg').forEach(el => el.classList.remove('show'));
    document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(el => el.classList.remove('error'));

    let isValid = true;

    // Protection anti-bot
    if (honeypot) {
      showToast('Envoi annulé (détection anti-spam).', true);
      return;
    }

    if (name.length < 2) {
      document.getElementById('formName')?.classList.add('error');
      document.getElementById('nameError')?.classList.add('show');
      isValid = false;
    }

    if (firstName.length < 2) {
      document.getElementById('formFirstName')?.classList.add('error');
      document.getElementById('firstNameError')?.classList.add('show');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      document.getElementById('formEmail')?.classList.add('error');
      document.getElementById('emailError')?.classList.add('show');
      isValid = false;
    }

    if (!subject) {
      document.getElementById('formSubject')?.classList.add('error');
      document.getElementById('subjectError')?.classList.add('show');
      isValid = false;
    }

    if (message.length < 15) {
      document.getElementById('formMessage')?.classList.add('error');
      document.getElementById('messageError')?.classList.add('show');
      isValid = false;
    }

    if (!isValid) {
      showToast('Veuillez compléter correctement les champs obligatoires.', true);
      return;
    }

    // État d'envoi
    if (submitBtn) submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Envoi sécurisé en cours...';
    if (btnSpinner) btnSpinner.style.display = 'inline-block';

    const fullName = `${firstName} ${name}`;
    const templateParams = {
      from_name: fullName,
      from_email: email,
      subject: subject,
      message: message,
      name: fullName,
      email: email
    };

    if (typeof emailjs !== 'undefined') {
      emailjs.send('service_messagerie', 'template_zntdov5', templateParams)
        .then(() => {
          showToast('Votre message a été transmis avec succès ! Je vous répondrai très rapidement.');
          contactForm.reset();
        })
        .catch((err) => {
          console.error('Erreur EmailJS:', err);
          showToast('Erreur lors de l’envoi. Vous pouvez me joindre directement via WhatsApp ou email direct !', true);
        })
        .finally(() => {
          if (submitBtn) submitBtn.disabled = false;
          if (btnText) btnText.textContent = 'Envoyer le message';
          if (btnSpinner) btnSpinner.style.display = 'none';
        });
    } else {
      // Fallback si EmailJS bloqué
      window.location.href = `mailto:dioppapemamadou872@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("De: " + fullName + " (" + email + ")\n\n" + message)}`;
      showToast('Ouverture de votre client de messagerie...');
      if (submitBtn) submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'Envoyer le message';
      if (btnSpinner) btnSpinner.style.display = 'none';
    }
  });

  /* ==========================================================================
     12. ANIMATION REVEAL AU DÉFILEMENT (INTERSECTION OBSERVER)
     ========================================================================== */
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

});
