// JavaScript for YRC Easwari Engineering College Website

/* ==========================================================================
   GLOBAL CUSTOM UI MODAL ALERT (Replaces native browser alerts)
   ========================================================================== */
window.showCustomAlert = function(title, message, type = 'warning') {
  let modal = document.getElementById('custom-alert-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'custom-alert-modal';
    modal.className = 'fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 hidden items-center justify-center p-4 transition-all duration-300';
    modal.innerHTML = `
      <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative overflow-hidden text-center transform scale-95 transition-all duration-300" id="custom-alert-card">
        <div id="custom-alert-ribbon" class="h-2.5 bg-gradient-to-r from-[#8b0c1e] via-[#6a0815] to-[#ebd86e] absolute top-0 left-0 right-0"></div>
        <div id="custom-alert-icon" class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 border shadow-inner">
          ⚠️
        </div>
        <h3 id="custom-alert-title" class="text-lg font-black text-slate-900 tracking-tight mb-2">Notice</h3>
        <p id="custom-alert-msg" class="text-xs text-slate-600 leading-relaxed mb-6 font-medium whitespace-pre-line"></p>
        <button id="custom-alert-close-btn" onclick="closeCustomAlert()" class="btn-gold w-full py-3.5 text-xs font-extrabold uppercase tracking-wider shadow-md hover:shadow-xl transition cursor-pointer">
          Understood
        </button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const iconEl = document.getElementById('custom-alert-icon');
  const titleEl = document.getElementById('custom-alert-title');
  const msgEl = document.getElementById('custom-alert-msg');
  const ribbonEl = document.getElementById('custom-alert-ribbon');

  if (titleEl) titleEl.innerText = title;
  if (msgEl) msgEl.innerText = message;

  if (type === 'duplicate' || type === 'warning') {
    if (iconEl) {
      iconEl.className = 'w-14 h-14 bg-amber-100 text-amber-700 border border-amber-300 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-inner';
      iconEl.innerText = '⚠️';
    }
    if (ribbonEl) ribbonEl.className = 'h-2.5 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 absolute top-0 left-0 right-0';
  } else if (type === 'error') {
    if (iconEl) {
      iconEl.className = 'w-14 h-14 bg-rose-100 text-rose-700 border border-rose-300 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-inner';
      iconEl.innerText = '❌';
    }
    if (ribbonEl) ribbonEl.className = 'h-2.5 bg-gradient-to-r from-rose-600 to-rose-800 absolute top-0 left-0 right-0';
  } else if (type === 'success') {
    if (iconEl) {
      iconEl.className = 'w-14 h-14 bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-inner';
      iconEl.innerText = '✓';
    }
    if (ribbonEl) ribbonEl.className = 'h-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 absolute top-0 left-0 right-0';
  } else {
    if (iconEl) {
      iconEl.className = 'w-14 h-14 bg-blue-100 text-blue-700 border border-blue-300 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-inner';
      iconEl.innerText = 'ℹ️';
    }
    if (ribbonEl) ribbonEl.className = 'h-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 absolute top-0 left-0 right-0';
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  setTimeout(() => {
    const card = document.getElementById('custom-alert-card');
    if (card) {
      card.classList.remove('scale-95');
      card.classList.add('scale-100');
    }
  }, 10);
};

window.closeCustomAlert = function() {
  const modal = document.getElementById('custom-alert-modal');
  if (modal) {
    const card = document.getElementById('custom-alert-card');
    if (card) {
      card.classList.remove('scale-100');
      card.classList.add('scale-95');
    }
    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }, 150);
  }
};

/* ==========================================================================
   CLOUD DATABASE REST SYNC FOR MULTI-DEVICE REALTIME DATA STORE
   Supports Firebase Realtime Database & Google Sheets Web App
   ========================================================================== */
// Active Firebase Realtime DB URL
const CLOUD_DB_BASE_URL = "https://yrc-eec-180dd-default-rtdb.asia-southeast1.firebasedatabase.app";

window.syncCloudData = async function(showNotice = false) {
  try {
    let cloudAuditions = null;
    let cloudVolunteers = null;

    if (CLOUD_DB_BASE_URL && !CLOUD_DB_BASE_URL.includes('crudcrud')) {
      // 1. Fetch Auditions
      try {
        const resAud = await fetch(`${CLOUD_DB_BASE_URL}/auditions.json`, { headers: { 'Accept': 'application/json' } });
        if (resAud.ok) {
          const jsonRes = await resAud.json();
          if (jsonRes) {
            cloudAuditions = (Array.isArray(jsonRes) ? jsonRes : Object.values(jsonRes)).filter(item => item !== null && item !== undefined);
          } else {
            cloudAuditions = [];
          }
        }
      } catch (err) {
        console.warn('Failed to fetch auditions from cloud:', err);
      }

      // 2. Fetch Volunteers
      try {
        const resVol = await fetch(`${CLOUD_DB_BASE_URL}/volunteers.json`, { headers: { 'Accept': 'application/json' } });
        if (resVol.ok) {
          const jsonResVol = await resVol.json();
          if (jsonResVol) {
            cloudVolunteers = (Array.isArray(jsonResVol) ? jsonResVol : Object.values(jsonResVol)).filter(item => item !== null && item !== undefined);
          } else {
            cloudVolunteers = [];
          }
        }
      } catch (err) {
        console.warn('Failed to fetch volunteers from cloud:', err);
      }
    }

    // Update LocalStorage if we successfully received data from the cloud
    if (cloudAuditions !== null) {
      cloudAuditions.sort((a, b) => {
        const numA = parseInt(a.refId?.split('-').pop() || 0, 10);
        const numB = parseInt(b.refId?.split('-').pop() || 0, 10);
        return numB - numA;
      });
      localStorage.setItem('yrc_audition_applications', JSON.stringify(cloudAuditions));
    }

    if (cloudVolunteers !== null) {
      cloudVolunteers.reverse();
      localStorage.setItem('yrc_volunteers', JSON.stringify(cloudVolunteers));
    }

    if (typeof renderAuditionsAdminTable === 'function') renderAuditionsAdminTable();
    if (typeof renderVolunteersAdminTable === 'function') renderVolunteersAdminTable();
    if (typeof updateCounts === 'function') updateCounts();

    if (showNotice && typeof showCustomAlert === 'function') {
      showCustomAlert('Cloud Sync Complete', 'Successfully fetched live candidate registrations across all mobile devices!', 'success');
    }
  } catch (err) {
    console.warn('Cloud DB sync offline / notice:', err);
  }
};

window.pushCloudData = async function(singleItem = null, type = 'auditions') {
  try {
    if (!CLOUD_DB_BASE_URL) return;

    if (singleItem) {
      const key = type === 'auditions' 
        ? singleItem.refId 
        : (singleItem.email ? singleItem.email.replace(/\./g, '_') : null);
      if (key) {
        const endpoint = `${CLOUD_DB_BASE_URL}/${type}/${key}.json`;
        await fetch(endpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(singleItem)
        });
      }
    } else {
      // Sync all local items to cloud via PUT
      const localItems = JSON.parse(localStorage.getItem(type === 'auditions' ? 'yrc_audition_applications' : 'yrc_volunteers') || '[]');
      for (const item of localItems) {
        const key = type === 'auditions' 
          ? item.refId 
          : (item.email ? item.email.replace(/\./g, '_') : null);
        if (key) {
          await fetch(`${CLOUD_DB_BASE_URL}/${type}/${key}.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(item)
          });
        }
      }
    }
  } catch (err) {
    console.warn('Push cloud data error:', err);
  }
};

// Trigger Cloud DB fetch on page load automatically
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.syncCloudData(false));
} else {
  window.syncCloudData(false);
}

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initNavObserver();
  initStatsCounter();
  initEventFilter();
  initEventsTenureToggle();
  initCabinetToggle();
  initVolunteerPortal();
  initHeroCarousel();
  initAuditionPortal();
});

/* ==========================================================================
   1. Scroll Reveal Animations
   ========================================================================== */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   2. Active Navigation Section Observer
   ========================================================================== */
function initNavObserver() {
  const navLinks = document.querySelectorAll('.nav-link');
  const hasLocalAnchors = Array.from(navLinks).some(link => {
    const href = link.getAttribute('href');
    return href && href.startsWith('#');
  });
  
  if (!hasLocalAnchors) return;

  const sections = document.querySelectorAll('section[id]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active-nav', 'text-red-600', 'font-semibold');
            link.classList.remove('text-slate-600');
          } else {
            link.classList.remove('active-nav', 'text-red-600', 'font-semibold');
            link.classList.add('text-slate-600');
          }
        });
      }
    });
  }, {
    threshold: 0.4,
    rootMargin: '-20% 0px -60% 0px'
  });

  sections.forEach(sec => navObserver.observe(sec));
}

/* ==========================================================================
   3. Stats Counter Animation
   ========================================================================== */
function initStatsCounter() {
  const statsSection = document.getElementById('statistics');
  if (!statsSection) return;

  const counters = statsSection.querySelectorAll('.counter-val');
  let animated = false;

  const countUp = () => {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const suffix = counter.getAttribute('data-suffix') || '';
      let count = 0;
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // ~60fps

      const updateCount = () => {
        count += increment;
        if (count < target) {
          counter.innerText = Math.floor(count) + suffix;
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = target + suffix;
        }
      };
      updateCount();
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        countUp();
        animated = true;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
}

/* ==========================================================================
   4. Events Filter Grid
   ========================================================================== */
function initEventFilter() {
  const tabButtons = document.querySelectorAll('.filter-tab');
  const eventCards = document.querySelectorAll('.event-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Active Button Styling
      tabButtons.forEach(t => {
        t.classList.remove('bg-red-600', 'text-white', 'shadow-md');
        t.classList.add('bg-white', 'text-slate-600', 'hover:bg-slate-100');
      });
      btn.classList.add('bg-red-600', 'text-white', 'shadow-md');
      btn.classList.remove('bg-white', 'text-slate-600', 'hover:bg-slate-100');

      const filter = btn.getAttribute('data-filter');
      
      // Animate cards transition
      eventCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden-card');
          setTimeout(() => {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          card.classList.add('hidden-card');
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   4b. Events Tenure Toggle (2025-26, 2024-25, 2023-24)
   ========================================================================== */
function initEventsTenureToggle() {
  const toggleEvents2526Btn = document.getElementById('toggle-events-2025-26');
  const toggleEvents2425Btn = document.getElementById('toggle-events-2024-25');
  const toggleEvents2324Btn = document.getElementById('toggle-events-2023-24');
  const grid2526 = document.getElementById('events-grid-25-26');
  const grid2425 = document.getElementById('events-grid-24-25');
  const grid2324 = document.getElementById('events-grid-23-24');
  const descText = document.getElementById('events-description-text');

  if (!toggleEvents2526Btn && !toggleEvents2425Btn && !toggleEvents2324Btn) return;

  const resetCategoryFilter = () => {
    const allTabBtn = document.querySelector('.filter-tab[data-filter="all"]');
    if (allTabBtn) {
      allTabBtn.click();
    }
  };

  const setTenure = (activeBtn, activeGrid, tenureText) => {
    const buttons = [toggleEvents2526Btn, toggleEvents2425Btn, toggleEvents2324Btn];
    const grids = [grid2526, grid2425, grid2324];

    buttons.forEach(btn => {
      if (!btn) return;
      if (btn === activeBtn) {
        btn.className = 'px-5 py-2.5 bg-[#4a040d] text-[#ebd86e] font-extrabold rounded-xl text-sm transition shadow-sm';
      } else {
        btn.className = 'px-5 py-2.5 text-slate-600 font-semibold rounded-xl text-sm transition hover:bg-slate-200/50';
      }
    });

    grids.forEach(g => {
      if (!g) return;
      if (g === activeGrid) {
        g.classList.remove('hidden');
        g.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
      } else {
        g.classList.add('hidden');
      }
    });

    if (descText) {
      descText.innerText = `Discover YRC Easwari Engineering College's events and campaigns spanning the academic term ${tenureText}.`;
    }

    resetCategoryFilter();
  };

  if (toggleEvents2526Btn) {
    toggleEvents2526Btn.addEventListener('click', () => setTenure(toggleEvents2526Btn, grid2526, '2025-2026'));
  }
  if (toggleEvents2425Btn) {
    toggleEvents2425Btn.addEventListener('click', () => setTenure(toggleEvents2425Btn, grid2425, '2024-2025'));
  }
  if (toggleEvents2324Btn) {
    toggleEvents2324Btn.addEventListener('click', () => setTenure(toggleEvents2324Btn, grid2324, '2023-2024'));
  }
}

/* ==========================================================================
   5. Cabinet Toggle (Current vs Past)
   ========================================================================== */
function initCabinetToggle() {
  const toggleCurrentBtn = document.getElementById('toggle-current-team');
  const togglePastBtn = document.getElementById('toggle-past-team');
  const team2026 = document.getElementById('team-2026-2027');
  const teamPast = document.getElementById('team-past-cabinets');

  if (!toggleCurrentBtn || !togglePastBtn || !team2026 || !teamPast) return;

  toggleCurrentBtn.addEventListener('click', () => {
    // Buttons styling
    toggleCurrentBtn.className = 'px-5 py-2.5 bg-[#4a040d] text-[#ebd86e] font-extrabold rounded-xl text-sm transition shadow-sm';
    togglePastBtn.className = 'px-5 py-2.5 text-slate-600 font-semibold rounded-xl text-sm transition hover:bg-slate-200/50';

    // Section Visibility
    teamPast.classList.add('hidden');
    team2026.classList.remove('hidden');
    team2026.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
  });

  togglePastBtn.addEventListener('click', () => {
    // Buttons styling
    togglePastBtn.className = 'px-5 py-2.5 bg-[#4a040d] text-[#ebd86e] font-extrabold rounded-xl text-sm transition shadow-sm';
    toggleCurrentBtn.className = 'px-5 py-2.5 text-slate-600 font-semibold rounded-xl text-sm transition hover:bg-slate-200/50';

    // Section Visibility
    team2026.classList.add('hidden');
    teamPast.classList.remove('hidden');
    teamPast.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
  });
}

/* ==========================================================================
   6. Volunteer Portal (Form Submission & Admin Dashboard)
   ========================================================================== */
function initVolunteerPortal() {
  const joinForm = document.getElementById('volunteer-form');
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const adminToggle = document.getElementById('toggle-admin-panel');
  const adminPanel = document.getElementById('admin-panel');
  const adminTableBody = document.getElementById('admin-table-body');
  const clearDbBtn = document.getElementById('clear-db-btn');
  const adminCloseBtn = document.getElementById('close-admin-panel');

  // Prepopulate mockup data if storage is empty
  const defaultSubmissions = [];

  if (!localStorage.getItem('yrc_volunteers')) {
    localStorage.setItem('yrc_volunteers', JSON.stringify([]));
  }

  // Handle Form Submission
  if (joinForm) {
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = document.getElementById('reg-email').value?.trim();
      const volunteers = JSON.parse(localStorage.getItem('yrc_volunteers') || '[]');

      // Check unique personal email ID
      const duplicateEmail = volunteers.find(v => v.email && v.email.toLowerCase().trim() === email.toLowerCase());
      if (duplicateEmail) {
        showCustomAlert('Duplicate Registration Detected', `A volunteer registration has already been submitted for Personal Email ID: ${email}`, 'warning');
        return;
      }

      const newRegistration = {
        name: document.getElementById('reg-name').value,
        email: email,
        phone: document.getElementById('reg-phone').value,
        dept: document.getElementById('reg-dept').value,
        year: document.getElementById('reg-year').value,
        skills: document.getElementById('reg-skills').value || 'General Volunteering',
        registeredAt: new Date().toLocaleString()
      };

      // Save to localStorage
      volunteers.unshift(newRegistration);
      localStorage.setItem('yrc_volunteers', JSON.stringify(volunteers));

      // Push to Cloud DB REST Endpoint for multi-device live sync
      if (typeof window.pushCloudData === 'function') {
        window.pushCloudData(newRegistration, 'volunteers');
      }

      // Reset form
      joinForm.reset();

      // Show Success Modal
      if (successModal) {
        successModal.classList.remove('hidden');
        successModal.classList.add('flex');
      }
      
      // Update the admin dashboard table immediately
      renderAdminTable();
    });
  }

  // Close Success Modal
  if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener('click', () => {
      successModal.classList.add('hidden');
      successModal.classList.remove('flex');
    });
  }

  // Toggle Admin Panel View
  if (adminToggle && adminPanel) {
    adminToggle.addEventListener('click', (e) => {
      e.preventDefault();
      renderAdminTable();
      adminPanel.classList.toggle('hidden');
      if (!adminPanel.classList.contains('hidden')) {
        adminPanel.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Close Admin Panel
  if (adminCloseBtn && adminPanel) {
    adminCloseBtn.addEventListener('click', () => {
      adminPanel.classList.add('hidden');
    });
  }

  // Render registrations in Admin Panel Table
  function renderAdminTable() {
    if (!adminTableBody) return;
    adminTableBody.innerHTML = '';
    
    const volunteers = JSON.parse(localStorage.getItem('yrc_volunteers') || '[]');
    
    if (volunteers.length === 0) {
      adminTableBody.innerHTML = `
        <tr>
          <td colspan="5" class="px-6 py-8 text-center text-slate-500 italic">
            No volunteers registered yet. Be the first!
          </td>
        </tr>
      `;
      return;
    }

    volunteers.forEach((v, index) => {
      const row = document.createElement('tr');
      row.className = "hover:bg-slate-50 border-b border-slate-100 transition-colors";
      row.innerHTML = `
        <td class="px-6 py-4 font-semibold text-slate-800">${v.name}</td>
        <td class="px-6 py-4 text-slate-600">
          <div class="font-medium">${v.dept}</div>
          <div class="text-xs text-slate-400">${v.year}</div>
        </td>
        <td class="px-6 py-4 text-slate-600 text-sm">
          <div>${v.email}</div>
          <div class="text-xs text-slate-400">${v.phone}</div>
        </td>
        <td class="px-6 py-4 text-slate-600 text-sm max-w-xs truncate" title="${v.skills}">${v.skills}</td>
        <td class="px-6 py-4 text-right">
          <button class="delete-reg-btn text-red-500 hover:text-red-700 text-sm font-semibold transition" data-index="${index}">
            Remove
          </button>
        </td>
      `;
      adminTableBody.appendChild(row);
    });

    // Wire up delete buttons
    const deleteBtns = adminTableBody.querySelectorAll('.delete-reg-btn');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const indexToDelete = parseInt(e.target.getAttribute('data-index'), 10);
        const volunteers = JSON.parse(localStorage.getItem('yrc_volunteers') || '[]');
        volunteers.splice(indexToDelete, 1);
        localStorage.setItem('yrc_volunteers', JSON.stringify(volunteers));
        renderAdminTable();
      });
    });
  }

  // Clear Database Button
  if (clearDbBtn) {
    clearDbBtn.addEventListener('click', () => {
      if (confirm("Are you sure you want to clear all volunteer registration records?")) {
        localStorage.setItem('yrc_volunteers', JSON.stringify([]));
        renderAdminTable();
      }
    });
  }
}

/* ==========================================================================
   7. Hero Section 5-Image Past Events Carousel
   ========================================================================== */
function initHeroCarousel() {
  const slides = document.querySelectorAll('.hero-carousel-slide');
  const dots = document.querySelectorAll('.hero-carousel-dot');
  const prevBtn = document.getElementById('hero-carousel-prev');
  const nextBtn = document.getElementById('hero-carousel-next');
  const carouselContainer = document.getElementById('hero-carousel');

  if (!slides.length || !carouselContainer) return;

  let currentSlide = 0;
  let slideInterval = null;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.remove('opacity-0', 'pointer-events-none');
        slide.classList.add('opacity-100', 'z-10');
      } else {
        slide.classList.remove('opacity-100', 'z-10');
        slide.classList.add('opacity-0', 'pointer-events-none');
      }
    });

    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('bg-[#ebd86e]', 'w-6');
        dot.classList.remove('bg-white/40', 'w-2');
      } else {
        dot.classList.remove('bg-[#ebd86e]', 'w-6');
        dot.classList.add('bg-white/40', 'w-2');
      }
    });

    currentSlide = index;
  }

  function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function prevSlide() {
    let prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
  }

  function startTimer() {
    stopTimer();
    slideInterval = setInterval(nextSlide, 3500);
  }

  function stopTimer() {
    if (slideInterval) clearInterval(slideInterval);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextSlide();
      startTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
      startTimer();
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      showSlide(i);
      startTimer();
    });
  });

  carouselContainer.addEventListener('mouseenter', stopTimer);
  carouselContainer.addEventListener('mouseleave', startTimer);

  // Initialize
  showSlide(0);
  startTimer();
}

/* ==========================================================================
   8. YRC Audition Recruitment Portal Controller
   ========================================================================== */
const DOMAIN_DATA = {
  media: {
    title: "Media & Photography",
    icon: "📸",
    questions: [
      { id: "aud_q_equipment", label: "What camera equipment or phone camera model do you use for photography/videography?", type: "text", placeholder: "e.g. Canon EOS 200D / iPhone 15 Pro / OnePlus 11..." },
      { id: "aud_q_software", label: "Which editing software/apps are you proficient in?", type: "text", placeholder: "e.g. Adobe Lightroom, Premiere Pro, CapCut, VN..." }
    ]
  },
  content: {
    title: "Content & Editorial",
    icon: "✍️",
    questions: [
      { id: "aud_q_writing_type", label: "What type of writing do you enjoy most?", type: "text", placeholder: "e.g. Event Reports, Social Media Captions, Magazine Articles, Formal Circulars..." },
      { id: "aud_q_sample_headline", label: "Write a 1-sentence catchy headline for our upcoming Annual Voluntary Blood Donation Camp:", type: "text", placeholder: "e.g. 'Be a Hero in Someone's Story: Donate Blood, Save Lives with YRC EEC!'" }
    ]
  },
  design: {
    title: "Visual & Graphic Design",
    icon: "🎨",
    questions: [
      { id: "aud_q_design_tools", label: "Which graphic design tools do you use regularly?", type: "text", placeholder: "e.g. Canva, Adobe Photoshop, Illustrator, Figma..." },
      { id: "aud_q_design_style", label: "Describe your preferred visual design aesthetic:", type: "text", placeholder: "e.g. Modern minimalist, bold typography, glassmorphism, vibrant vector illustrations..." }
    ]
  },
  operations: {
    title: "Operations & Logistics",
    icon: "🎪",
    questions: [
      { id: "aud_q_crowd_mgmt", label: "How would you handle a large crowd delay during an on-ground blood donation camp?", type: "text", placeholder: "e.g. Organize structured token queuing, ensure water distribution, assign volunteer zones..." },
      { id: "aud_q_availability", label: "Are you available for weekend out-of-campus events (e.g. Beach Cleanups, Cyclothon)?", type: "text", placeholder: "Yes, available on weekends / Partial weekend availability..." }
    ]
  },
  anchoring: {
    title: "Public Relations & Anchoring",
    icon: "🎤",
    questions: [
      { id: "aud_q_stage_exp", label: "Describe any past stage hosting or public speaking experience you have:", type: "text", placeholder: "e.g. Hosted school annual day, college symposium inaugurations, debate competitions..." },
      { id: "aud_q_lang", label: "Languages spoken fluently for stage hosting:", type: "text", placeholder: "e.g. English, Tamil, Hindi..." }
    ]
  },
  technical: {
    title: "Technical & Web Development",
    icon: "💻",
    questions: [
      { id: "aud_q_tech_stack", label: "What tech stack / web frameworks do you work with?", type: "text", placeholder: "e.g. HTML5, CSS3, Tailwind CSS, JavaScript, React, Python, Git..." },
      { id: "aud_q_github", label: "GitHub Profile URL or Web Project Link (Optional):", type: "text", placeholder: "e.g. https://github.com/username or project site URL..." }
    ]
  },
  team_management: {
    title: "Team Management",
    icon: "👥",
    questions: [
      { id: "aud_q_team_lead", label: "Describe any past team leadership or event coordination experience you have:", type: "text", placeholder: "e.g. Led a team of 10 volunteers, organized department event schedules..." },
      { id: "aud_q_conflict_mgmt", label: "How do you handle team miscommunication or task delays?", type: "text", placeholder: "e.g. Conduct regular check-ins, reassign urgent tasks, encourage active feedback..." }
    ]
  }
};

let currentAuditionStep = 1;

function initAuditionPortal() {
  const wizardForm = document.getElementById('audition-wizard-form');
  const modal = document.getElementById('audition-modal');
  const closeModalBtn = document.getElementById('close-audition-modal-btn');
  const adminToggle = document.getElementById('toggle-audition-admin');
  const adminPanel = document.getElementById('audition-admin-panel');
  const adminCloseBtn = document.getElementById('close-audition-admin');
  const searchInput = document.getElementById('admin-search-input');
  const domainFilter = document.getElementById('admin-domain-filter');
  const statusFilter = document.getElementById('admin-status-filter');
  const exportCsvBtn = document.getElementById('export-csv-btn');
  const exportExcelBtn = document.getElementById('export-excel-btn');
  const resetDbBtn = document.getElementById('reset-auditions-db-btn');

  if (!wizardForm) return;

  // Pre-populate Mock Audition Data if empty
  const defaultAuditions = [];

  if (!localStorage.getItem('yrc_audition_applications')) {
    localStorage.setItem('yrc_audition_applications', JSON.stringify([]));
  }

  // Handle Form Submission
  wizardForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Step 1 Validation
    const name = document.getElementById('aud-name')?.value?.trim();
    const regNo = document.getElementById('aud-regno')?.value?.trim();
    const dept = document.getElementById('aud-dept')?.value;
    const year = document.getElementById('aud-year')?.value;
    const email = document.getElementById('aud-email')?.value?.trim();
    const phone = document.getElementById('aud-phone')?.value?.trim();

    if (!name || !regNo || !dept || !year || !email || !phone) {
      showCustomAlert('Incomplete Details', 'Please fill out all required personal and academic details in Step 1.', 'warning');
      showWizardStepCard(1);
      return;
    }

    // Check Unique User (Exclusively By Personal Email ID)
    const existingApplications = JSON.parse(localStorage.getItem('yrc_audition_applications') || '[]');

    const duplicateEmail = existingApplications.find(a => a.email && a.email.toLowerCase().trim() === email.toLowerCase().trim());
    if (duplicateEmail) {
      showCustomAlert('Duplicate Submission Detected', `An application has already been submitted for Personal Email ID: ${email}\n\nReference ID: ${duplicateEmail.refId}`, 'warning');
      showWizardStepCard(1);
      return;
    }

    // Step 2 Validation
    const selectedDomainInput = document.querySelector('input[name="primary_domain"]:checked');
    if (!selectedDomainInput) {
      showCustomAlert('Domain Selection Required', 'Please select a primary domain choice in Step 2.', 'warning');
      showWizardStepCard(2);
      return;
    }

    const selectedSlotInput = document.querySelector('input[name="audition_slot"]:checked');
    if (!selectedSlotInput) {
      showCustomAlert('Time Slot Required', 'Please select your preferred audition time slot in Step 2.', 'warning');
      showWizardStepCard(2);
      return;
    }

    const termsCheckbox = document.getElementById('aud-terms');
    if (termsCheckbox && !termsCheckbox.checked) {
      showCustomAlert('Confirmation Required', 'Please check the confirmation box in Step 2.', 'warning');
      showWizardStepCard(2);
      return;
    }

    const domainKey = selectedDomainInput.value;
    const domainMeta = DOMAIN_DATA[domainKey] || { title: domainKey };
    const chosenSlot = selectedSlotInput.value;

    // Generate Sequential Application Reference ID (starting from 1500)
    let maxTicketNum = 1499;
    existingApplications.forEach(a => {
      if (a && a.refId) {
        const match = a.refId.match(/YRC-AUD-2026-(\d+)/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxTicketNum) {
            maxTicketNum = num;
          }
        }
      }
    });

    let nextTicketNum = maxTicketNum + 1;
    let refId = "";
    let isUnique = false;

    // Verify refId is unique against local and cloud DB
    while (!isUnique) {
      refId = `YRC-AUD-2026-${nextTicketNum}`;
      
      // 1. Check local applications
      const duplicateLocal = existingApplications.find(a => a.refId === refId);
      if (duplicateLocal) {
        nextTicketNum++;
        continue;
      }

      // 2. Check cloud database via REST
      try {
        const checkRes = await fetch(`${CLOUD_DB_BASE_URL}/auditions/${refId}.json`);
        if (checkRes.ok) {
          const cloudData = await checkRes.json();
          if (cloudData !== null) {
            nextTicketNum++;
            continue;
          }
        }
      } catch (err) {
        console.warn("Could not verify refId uniqueness on cloud, assuming unique:", err);
      }

      isUnique = true;
    }

    const newApplication = {
      refId: refId,
      name: name,
      regNo: regNo,
      dept: dept,
      year: year,
      email: email,
      phone: phone,
      primaryDomainKey: domainKey,
      primaryDomainTitle: domainMeta.title,
      secondaryDomain: document.getElementById('aud-secondary-domain')?.value || 'None',
      slot: chosenSlot,
      status: "Under Review",
      appliedAt: new Date().toLocaleString()
    };

    // Save to LocalStorage
    applications = [newApplication, ...existingApplications];
    localStorage.setItem('yrc_audition_applications', JSON.stringify(applications));

    // Push to Cloud DB REST Endpoint for instant multi-device sync
    if (typeof window.pushCloudData === 'function') {
      window.pushCloudData(newApplication, 'auditions');
    }

    // Populate Modal Ticket
    const ticketRef = document.getElementById('ticket-ref-id');
    const ticketName = document.getElementById('ticket-name');
    const ticketDept = document.getElementById('ticket-dept');
    const ticketDomain = document.getElementById('ticket-domain');
    const ticketSlot = document.getElementById('ticket-slot');

    if (ticketRef) ticketRef.innerText = refId;
    if (ticketName) ticketName.innerText = newApplication.name;
    if (ticketDept) ticketDept.innerText = `${newApplication.regNo} (${newApplication.dept})`;
    if (ticketDomain) ticketDomain.innerText = domainMeta.title;
    if (ticketSlot) ticketSlot.innerText = newApplication.slot;

    // Show Ticket Modal
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }

    // Reset Form & Return to Step 1
    wizardForm.reset();
    showWizardStepCard(1);

    // Refresh Admin Table if visible
    renderAuditionsAdminTable();
  });

  // Close Modal
  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    });
  }

  // Domain Radio Card Click Listeners
  const domainCards = document.querySelectorAll('.domain-radio-card');
  domainCards.forEach(card => {
    card.addEventListener('click', () => {
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        window.onPrimaryDomainChange(radio.value);
      }
    });
  });
  if (adminToggle && adminPanel) {
    adminToggle.addEventListener('click', (e) => {
      e.preventDefault();
      renderAuditionsAdminTable();
      adminPanel.classList.toggle('hidden');
      if (!adminPanel.classList.contains('hidden')) {
        adminPanel.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (adminCloseBtn && adminPanel) {
    adminCloseBtn.addEventListener('click', () => {
      adminPanel.classList.add('hidden');
    });
  }

  // Admin Search & Filter Listeners
  if (searchInput) searchInput.addEventListener('input', renderAuditionsAdminTable);
  if (domainFilter) domainFilter.addEventListener('change', renderAuditionsAdminTable);
  if (statusFilter) statusFilter.addEventListener('change', renderAuditionsAdminTable);

  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', exportAuditionsToCSV);
  }

  if (exportExcelBtn) {
    exportExcelBtn.addEventListener('click', exportAuditionsToExcel);
  }

  if (resetDbBtn) {
    resetDbBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all audition application records?')) {
        localStorage.setItem('yrc_audition_applications', JSON.stringify([]));
        renderAuditionsAdminTable();
      }
    });
  }
}

/* Global Navigation Step Helpers */
window.nextWizardStep = function(step) {
  // Validate current step before advancing
  if (step === 1) {
    const name = document.getElementById('aud-name')?.value?.trim();
    const regno = document.getElementById('aud-regno')?.value?.trim();
    const dept = document.getElementById('aud-dept')?.value;
    const year = document.getElementById('aud-year')?.value;
    const email = document.getElementById('aud-email')?.value?.trim();
    const phone = document.getElementById('aud-phone')?.value?.trim();

    if (!name || !regno || !dept || !year || !email || !phone) {
      showCustomAlert('Incomplete Details', 'Please fill out all required fields in Step 1 before proceeding.', 'warning');
      return;
    }

    // Check unique exclusively by Personal Email ID before stepping forward
    const existingApplications = JSON.parse(localStorage.getItem('yrc_audition_applications') || '[]');
    const duplicateEmail = existingApplications.find(a => a.email && a.email.toLowerCase().trim() === email.toLowerCase().trim());
    if (duplicateEmail) {
      showCustomAlert('Duplicate Submission Detected', `An application has already been submitted for Personal Email ID: ${email}\n\nReference ID: ${duplicateEmail.refId}`, 'warning');
      return;
    }
  }

  const nextStepNum = step + 1;
  showWizardStepCard(nextStepNum);
};

window.prevWizardStep = function(step) {
  const prevStepNum = step - 1;
  showWizardStepCard(prevStepNum);
};

function showWizardStepCard(targetStep) {
  currentAuditionStep = targetStep;

  // Toggle step cards (2 steps total)
  for (let i = 1; i <= 2; i++) {
    const card = document.getElementById(`step-card-${i}`);
    if (card) {
      if (i === targetStep) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    }
  }

  // Update progress bar width
  const progressBar = document.getElementById('wizard-progress-bar');
  if (progressBar) {
    const percentage = ((targetStep - 1) / 1) * 100;
    progressBar.style.width = `${percentage}%`;
  }

  // Update step nodes
  const nodes = document.querySelectorAll('.wizard-step-node');
  nodes.forEach(node => {
    const stepNum = parseInt(node.getAttribute('data-step'), 10);
    const circle = node.querySelector('div');
    const label = node.querySelector('span');

    if (stepNum <= targetStep) {
      if (circle) circle.className = 'w-10 h-10 rounded-full bg-[#4a040d] text-[#ebd86e] font-extrabold text-sm flex items-center justify-center shadow-md border-2 border-white transition-all';
      if (label) label.className = 'text-[11px] font-bold text-slate-900';
    } else {
      if (circle) circle.className = 'w-10 h-10 rounded-full bg-slate-200 text-slate-600 font-extrabold text-sm flex items-center justify-center border-2 border-white transition-all';
      if (label) label.className = 'text-[11px] font-bold text-slate-500';
    }
  });

  // Scroll to form top smoothly
  const section = document.getElementById('audition-form-section');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

window.onAuditionSlotChange = function(radioInput) {
  const cards = document.querySelectorAll('.slot-radio-card');
  cards.forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    if (radio && radio.checked) {
      card.classList.add('active-slot-card');
      const badge = card.querySelector('.slot-check-badge');
      if (badge) {
        badge.classList.add('bg-[#6a0815]', 'border-[#6a0815]', 'text-[#ebd86e]');
        badge.classList.remove('text-transparent', 'border-slate-300');
      }
    } else {
      card.classList.remove('active-slot-card');
      const badge = card.querySelector('.slot-check-badge');
      if (badge) {
        badge.classList.remove('bg-[#6a0815]', 'border-[#6a0815]', 'text-[#ebd86e]');
        badge.classList.add('text-transparent', 'border-slate-300');
      }
    }
  });
};

window.onPrimaryDomainChange = function(domainKey) {
  // Update Radio Card Styling
  const cards = document.querySelectorAll('.domain-radio-card');
  cards.forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    if (radio && radio.value === domainKey) {
      card.classList.add('active-domain-card');
    } else {
      card.classList.remove('active-domain-card');
    }
  });
};

window.selectDomainInForm = function(domainKey) {
  const radio = document.querySelector(`input[name="primary_domain"][value="${domainKey}"]`);
  if (radio) {
    radio.checked = true;
    window.onPrimaryDomainChange(domainKey);
  }
  showWizardStepCard(2);
};

/* Render Admin Management Table */
function renderAuditionsAdminTable() {
  const tableBody = document.getElementById('audition-admin-table-body');
  if (!tableBody) return;

  tableBody.innerHTML = '';
  const applications = JSON.parse(localStorage.getItem('yrc_audition_applications') || '[]');

  const searchVal = (document.getElementById('admin-search-input')?.value || '').toLowerCase();
  const domainVal = document.getElementById('admin-domain-filter')?.value || 'all';
  const slotVal = document.getElementById('admin-slot-filter')?.value || 'all';
  const statusVal = document.getElementById('admin-status-filter')?.value || 'all';

  const filtered = applications.filter(app => {
    const rawSlot = (app.slot || app.auditionSlot || app.timing || app.timeSlot || '').toLowerCase();
    const matchesSearch = (app.name || '').toLowerCase().includes(searchVal) ||
                          (app.regNo || '').toLowerCase().includes(searchVal) ||
                          (app.dept || '').toLowerCase().includes(searchVal) ||
                          (app.refId || '').toLowerCase().includes(searchVal) ||
                          rawSlot.includes(searchVal);
    const matchesDomain = (domainVal === 'all') || (app.primaryDomainTitle === domainVal);
    const matchesSlot = (slotVal === 'all') ||
                        (slotVal === 'none' && (!rawSlot || rawSlot === 'no slot' || rawSlot === 'no slot selected')) ||
                        (rawSlot.includes(slotVal.toLowerCase()));
    const matchesStatus = (statusVal === 'all') || (app.status === statusVal);

    return matchesSearch && matchesDomain && matchesSlot && matchesStatus;
  });

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="px-6 py-8 text-center text-slate-500 italic">
          No audition applications match the selected criteria.
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach((app) => {
    let statusBadge = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    if (app.status === 'Shortlisted') statusBadge = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    if (app.status === 'Audition Scheduled') statusBadge = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    if (app.status === 'Selected') statusBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (app.status === 'Rejected') statusBadge = 'bg-rose-500/10 text-rose-400 border-rose-500/30';

    const rawSlot = app.slot || app.auditionSlot || app.timing || app.timeSlot || '';
    const hasSlot = rawSlot && rawSlot !== 'No Slot' && rawSlot !== 'No Slot Selected';

    const slotBadgeHtml = hasSlot
      ? `<div class="px-2.5 py-1 bg-amber-500/15 text-amber-300 font-extrabold text-[11px] rounded-lg border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
           <span>🗓️</span>
           <span class="truncate max-w-[200px]" title="${rawSlot}">${rawSlot}</span>
         </div>`
      : `<div class="px-2 py-0.5 bg-slate-800 text-slate-400 font-semibold text-[10px] rounded border border-slate-700 inline-block">
           ⚠️ Unassigned / No Slot
         </div>`;

    const row = document.createElement('tr');
    row.className = "hover:bg-slate-800/50 transition-colors border-b border-slate-800";
    row.innerHTML = `
      <td class="px-4 py-3.5 font-extrabold text-[#ebd86e] font-mono text-[11px]">${app.refId}</td>
      <td class="px-4 py-3.5 font-bold text-white">
        <div>${app.name}</div>
        <div class="text-[10px] text-slate-400 font-normal">${app.email} &bull; ${app.phone}</div>
      </td>
      <td class="px-4 py-3.5 text-slate-300">
        <div class="font-semibold text-slate-200">${app.dept}</div>
        <div class="text-[10px] text-slate-400">${app.regNo} (${app.year})</div>
      </td>
      <td class="px-4 py-3.5">
        <span class="px-2 py-0.5 bg-[#4a040d] text-[#ebd86e] font-bold text-[10px] rounded uppercase border border-[#ebd86e]/30">${app.primaryDomainTitle}</span>
        <div class="text-[10px] text-slate-400 mt-0.5">Sec: ${app.secondaryDomain || 'None'}</div>
      </td>
      <td class="px-4 py-3.5">
        ${slotBadgeHtml}
        <div class="mt-1">
          <select onchange="updateApplicantSlot('${app.refId}', this.value)" class="w-full text-[10px] bg-slate-950 text-slate-300 border border-slate-800 rounded px-1.5 py-0.5 focus:outline-none focus:border-amber-400 truncate">
            <option value="" disabled selected>Reassign / Change Slot...</option>
            <option value="Saturday (15/08) - Evening 06:00 PM - 07:00 PM" ${rawSlot === 'Saturday (15/08) - Evening 06:00 PM - 07:00 PM' ? 'selected' : ''}>Sat 15/08 (06:00 PM – 07:00 PM)</option>
            <option value="Saturday (15/08) - Evening 07:00 PM - 08:00 PM" ${rawSlot === 'Saturday (15/08) - Evening 07:00 PM - 08:00 PM' ? 'selected' : ''}>Sat 15/08 (07:00 PM – 08:00 PM)</option>
            <option value="Sunday (16/08) - Morning 11:00 AM - 12:00 PM" ${rawSlot === 'Sunday (16/08) - Morning 11:00 AM - 12:00 PM' ? 'selected' : ''}>Sun 16/08 (11:00 AM – 12:00 PM)</option>
            <option value="Sunday (16/08) - Morning 12:00 PM - 01:00 PM" ${rawSlot === 'Sunday (16/08) - Morning 12:00 PM - 01:00 PM' ? 'selected' : ''}>Sun 16/08 (12:00 PM – 01:00 PM)</option>
            <option value="Sunday (16/08) - Evening 06:00 PM - 07:00 PM" ${rawSlot === 'Sunday (16/08) - Evening 06:00 PM - 07:00 PM' ? 'selected' : ''}>Sun 16/08 (06:00 PM – 07:00 PM)</option>
            <option value="Sunday (16/08) - Evening 07:00 PM - 08:00 PM" ${rawSlot === 'Sunday (16/08) - Evening 07:00 PM - 08:00 PM' ? 'selected' : ''}>Sun 16/08 (07:00 PM – 08:00 PM)</option>
          </select>
        </div>
      </td>
      <td class="px-4 py-3.5">
        <select onchange="updateApplicantStatus('${app.refId}', this.value)" class="px-2 py-1 bg-slate-950 border text-[11px] font-bold rounded-lg ${statusBadge}">
          <option value="Under Review" ${app.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
          <option value="Shortlisted" ${app.status === 'Shortlisted' ? 'selected' : ''}>Shortlisted</option>
          <option value="Audition Scheduled" ${app.status === 'Audition Scheduled' ? 'selected' : ''}>Audition Scheduled</option>
          <option value="Selected" ${app.status === 'Selected' ? 'selected' : ''}>Selected</option>
          <option value="Rejected" ${app.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
        </select>
      </td>
      <td class="px-4 py-3.5 text-right">
        <button onclick="deleteAuditionApplicant('${app.refId}')" class="text-rose-500 hover:text-rose-700 font-bold text-xs transition">
          Remove
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

window.updateApplicantSlot = function(refId, newSlot) {
  const applications = JSON.parse(localStorage.getItem('yrc_audition_applications') || '[]');
  const target = applications.find(a => a.refId === refId);
  if (target) {
    target.slot = newSlot;
    localStorage.setItem('yrc_audition_applications', JSON.stringify(applications));
    if (typeof renderAuditionsAdminTable === 'function') renderAuditionsAdminTable();
    if (typeof window.pushCloudData === 'function') window.pushCloudData(target, 'auditions');
  }
};

window.updateApplicantStatus = function(refId, newStatus) {
  const applications = JSON.parse(localStorage.getItem('yrc_audition_applications') || '[]');
  const target = applications.find(a => a.refId === refId);
  if (target) {
    target.status = newStatus;
    localStorage.setItem('yrc_audition_applications', JSON.stringify(applications));
    if (typeof renderAuditionsAdminTable === 'function') renderAuditionsAdminTable();
    if (typeof window.pushCloudData === 'function') window.pushCloudData(target, 'auditions');
  }
};

window.deleteAuditionApplicant = async function(refId) {
  if (confirm(`Remove application ${refId}?`)) {
    let applications = JSON.parse(localStorage.getItem('yrc_audition_applications') || '[]');
    applications = applications.filter(a => a.refId !== refId);
    localStorage.setItem('yrc_audition_applications', JSON.stringify(applications));
    if (typeof renderAuditionsAdminTable === 'function') renderAuditionsAdminTable();
    
    try {
      if (typeof CLOUD_DB_BASE_URL !== 'undefined' && CLOUD_DB_BASE_URL) {
        await fetch(`${CLOUD_DB_BASE_URL}/auditions/${refId}.json`, { method: 'DELETE' });
      }
    } catch (err) {
      console.warn('Cloud DB delete error:', err);
    }
  }
};

function exportAuditionsToCSV() {
  const applications = JSON.parse(localStorage.getItem('yrc_audition_applications') || '[]');
  if (applications.length === 0) {
    showCustomAlert('Export Notice', 'No audition application records to export.', 'info');
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
  csvContent += "Ref ID,Name,Reg No,Department,Year,Email,Phone,Primary Domain,Secondary Domain,Audition Slot,Status,Applied At\n";

  applications.forEach(a => {
    const row = [
      `"${a.refId}"`,
      `"${a.name}"`,
      `"${a.regNo}"`,
      `"${a.dept}"`,
      `"${a.year}"`,
      `"${a.email}"`,
      `"${a.phone}"`,
      `"${a.primaryDomainTitle}"`,
      `"${a.secondaryDomain || 'None'}"`,
      `"${a.slot || 'N/A'}"`,
      `"${a.status}"`,
      `"${a.appliedAt}"`
    ].join(",");
    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `YRC_Audition_Applicants_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportAuditionsToExcel() {
  const applications = JSON.parse(localStorage.getItem('yrc_audition_applications') || '[]');
  if (applications.length === 0) {
    showCustomAlert('Export Notice', 'No audition application records to export.', 'info');
    return;
  }

  const exportData = applications.map(a => ({
    "Ref ID": a.refId,
    "Applicant Name": a.name,
    "Register Number": a.regNo,
    "Department": a.dept,
    "Year of Study": a.year,
    "Email ID": a.email,
    "Phone Number": a.phone,
    "Primary Domain": a.primaryDomainTitle,
    "Secondary Domain": a.secondaryDomain || 'None',
    "Preferred Time Slot": a.slot || 'N/A',
    "Application Status": a.status,
    "Applied At": a.appliedAt
  }));

  if (window.XLSX) {
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Audition Applicants");
    XLSX.writeFile(workbook, `YRC_Audition_Applicants_${new Date().toISOString().slice(0,10)}.xlsx`);
  } else {
    exportAuditionsToCSV();
  }
}

// Expose admin utilities to global scope for admin.html
window.exportAuditionsToCSV = exportAuditionsToCSV;
window.exportAuditionsToExcel = exportAuditionsToExcel;
window.renderAuditionsAdminTable = renderAuditionsAdminTable;

