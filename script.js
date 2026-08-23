/**
 * Kazi Anamul Haque - Portfolio JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTypingEffect();
  initNavigation();
  initStatsCounter();
  initProjectFilter();
  initProjectModal();
  initContactForm();
  initBackToTop();
  initScrollReveal();
  setCurrentYear();
});

/* ==========================================================================
   1. Theme Management (Dark / Light)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    htmlRoot.setAttribute('data-theme', savedTheme);
  } else if (!prefersDark) {
    htmlRoot.setAttribute('data-theme', 'light');
  } else {
    htmlRoot.setAttribute('data-theme', 'dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      
      showToast(`Switched to ${newTheme} mode`, 'success');
    });
  }
}

/* ==========================================================================
   2. Typing Text Effect
   ========================================================================== */
function initTypingEffect() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const roles = [
    'Aspiring Full-Stack Developer.',
    'CS Student at DIU.',
    'Python & ML Enthusiast.',
    'Problem Solver.',
    'Quick Learner.'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   3. Header, Mobile Menu & Scroll Spy
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const correspondingLink = document.querySelector(`.nav-menu a[href*='${sectionId}']`);

      if (correspondingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          correspondingLink.classList.add('active');
        } else {
          correspondingLink.classList.remove('active');
        }
      }
    });
  });

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   4. Animated Stat Counters
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          const duration = 1800;
          const stepTime = 20;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;
          let current = 0;

          const counter = setInterval(() => {
            current += increment;
            if (current >= target) {
              stat.textContent = target;
              clearInterval(counter);
            } else {
              stat.textContent = Math.floor(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.stats-card');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================================================
   5. Project Category Filtering
   ========================================================================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('hide');
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.classList.add('hide');
        }
      });
    });
  });
}

/* ==========================================================================
   6. Project Modal Details
   ========================================================================== */
const projectData = {
  1: {
    title: "Quiz App",
    category: "Console Application",
    year: "Fall 2023",
    client: "Academic Project — DIU",
    image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=1000&auto=format&fit=crop&q=80",
    description: "A level-based quiz game developed as a console application using C programming. The app features multiple difficulty tiers, letting users progress through increasingly challenging questions while tracking their scores in real-time.",
    features: [
      "Multiple difficulty levels with progressive question sets",
      "Score tracking and performance summary at the end of each round",
      "Clean console-based user interface with input validation",
      "File I/O for storing quiz questions and high scores"
    ],
    techStack: ["C", "Console App", "File I/O", "Logic Building"],
    demoUrl: "#",
    githubUrl: "https://github.com"
  },
  2: {
    title: "Guessing Game (Akinator-Style)",
    category: "Console Application — Data Structures",
    year: "Spring 2024",
    client: "Academic Project — DIU",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1000&auto=format&fit=crop&q=80",
    description: "A character guessing bot inspired by the popular Akinator game. Built using fundamental data structures in C, this project uses a decision tree approach to narrow down guesses based on yes/no user responses.",
    features: [
      "Binary decision tree algorithm for intelligent character guessing",
      "Dynamic question flow that adapts based on user responses",
      "Ability to learn new characters when the guess is incorrect",
      "Efficient memory management using linked data structures"
    ],
    techStack: ["C", "Data Structures", "Decision Trees", "Algorithms", "Linked Lists"],
    demoUrl: "#",
    githubUrl: "https://github.com"
  },
  3: {
    title: "Personal Portfolio Website",
    category: "Web Development",
    year: "2025",
    client: "Personal Project",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1000&auto=format&fit=crop&q=80",
    description: "A modern, fully responsive personal portfolio website built entirely from scratch using HTML5, CSS3, and vanilla JavaScript. Features a sleek dark/light mode toggle, interactive project modals, smooth scroll animations, and a validated contact form.",
    features: [
      "Dark/Light mode toggle with localStorage persistence",
      "Dynamic typing animation for role display",
      "Interactive project detail modals with full case studies",
      "Client-side form validation with toast notification feedback",
      "Smooth scroll-reveal animations using IntersectionObserver",
      "Fully responsive design across mobile, tablet, and desktop"
    ],
    techStack: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "CSS Variables"],
    demoUrl: "#",
    githubUrl: "https://github.com"
  },
  4: {
    title: "EDGE Python ML Course Work",
    category: "Machine Learning & Data Science",
    year: "2024",
    client: "EDGE Certification",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1000&auto=format&fit=crop&q=80",
    description: "A collection of hands-on machine learning projects completed as part of the EDGE Python ML professional certification. Covers the full ML workflow from data collection and preprocessing to model training, evaluation, and prediction.",
    features: [
      "Data preprocessing and cleaning with Pandas and NumPy",
      "Supervised learning model implementations (classification & regression)",
      "Model evaluation metrics and performance comparison",
      "Data visualization with Matplotlib and Seaborn"
    ],
    techStack: ["Python", "Machine Learning", "Pandas", "NumPy", "Matplotlib", "Scikit-learn"],
    demoUrl: "#",
    githubUrl: "https://github.com"
  }
};

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body');
  const triggerBtns = document.querySelectorAll('.view-project-btn');

  if (!modal || !modalBody) return;

  function openModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    modalBody.innerHTML = `
      <img src="${data.image}" alt="${data.title}" class="modal-img">
      <h3 class="modal-title">${data.title}</h3>
      <div class="modal-meta-row">
        <div class="modal-meta-item"><strong>Category:</strong> ${data.category}</div>
        <div class="modal-meta-item"><strong>Period:</strong> ${data.year}</div>
        <div class="modal-meta-item"><strong>Context:</strong> ${data.client}</div>
      </div>
      <p class="modal-desc">${data.description}</p>
      
      <div class="modal-features">
        <h4>Key Features & Highlights:</h4>
        <ul>
          ${data.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>

      <div class="modal-tech">
        <h4 style="margin-bottom: 0.6rem; color: var(--text-primary); font-size: 1.1rem; font-weight: 700;">Technologies Used:</h4>
        <div class="project-tech-list" style="margin-bottom: 1rem;">
          ${data.techStack.map(t => `<span class="tech-badge">${t}</span>`).join('')}
        </div>
      </div>

      <div class="modal-actions">
        <a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
          <i class="fa-brands fa-github"></i>
          <span>View on GitHub</span>
        </a>
      </div>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-id');
      openModal(projectId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   7. Contact Form Handling & Validation
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function setFieldValidation(input, isValid) {
    const parentGroup = input.closest('.form-group');
    if (!isValid) {
      parentGroup.classList.add('error');
    } else {
      parentGroup.classList.remove('error');
    }
  }

  [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        const parentGroup = input.closest('.form-group');
        parentGroup.classList.remove('error');
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    if (!nameInput.value.trim()) {
      setFieldValidation(nameInput, false);
      isValid = false;
    } else {
      setFieldValidation(nameInput, true);
    }

    if (!validateEmail(emailInput.value.trim())) {
      setFieldValidation(emailInput, false);
      isValid = false;
    } else {
      setFieldValidation(emailInput, true);
    }

    if (!subjectInput.value.trim()) {
      setFieldValidation(subjectInput, false);
      isValid = false;
    } else {
      setFieldValidation(subjectInput, true);
    }

    if (messageInput.value.trim().length < 10) {
      setFieldValidation(messageInput, false);
      isValid = false;
    } else {
      setFieldValidation(messageInput, true);
    }

    if (!isValid) {
      showToast('Please correct the errors in the form.', 'error');
      return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      form.reset();

      showToast('Thank you! Your message has been sent successfully.', 'success');
    }, 1200);
  });
}

/* ==========================================================================
   8. Floating Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   9. Scroll Reveal Elements
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.skill-category-card, .project-card, .timeline-item, .testimonial-card, .contact-card, .about-info, .stats-card');

  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -40px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   10. Toast Notification System
   ========================================================================== */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconClass = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation';

  toast.innerHTML = `
    <i class="${iconClass} toast-icon"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 4000);
}

/* ==========================================================================
   11. Footer Dynamic Year
   ========================================================================== */
function setCurrentYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
