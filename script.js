/**
 * Nexora Digital - Frontend Interaction Script
 * Features:
 * - Mobile drawer navigation
 * - Contact form validation & dual WhatsApp/Email delivery
 * - URL parameter query parsing for service selection
 * - Scroll engagement modal popup
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // --- 1. Mobile Menu Drawer Toggle ---
  var menuToggle = document.getElementById('menuToggle');
  var mobileDrawer = document.getElementById('mobileDrawer');

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = mobileDrawer.classList.toggle('show');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (!mobileDrawer.contains(e.target) && !menuToggle.contains(e.target)) {
        mobileDrawer.classList.remove('show');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close drawer when clicking any link inside
    var drawerLinks = mobileDrawer.querySelectorAll('a');
    drawerLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        mobileDrawer.classList.remove('show');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- 2. URL Param Auto-select Service in Contact Form ---
  var serviceSelect = document.getElementById('service');
  if (serviceSelect) {
    try {
      var urlParams = new URLSearchParams(window.location.search);
      var svcParam = urlParams.get('service');
      if (svcParam) {
        var lowerSvc = svcParam.toLowerCase();
        for (var i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value.toLowerCase().indexOf(lowerSvc) !== -1) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }
    } catch (err) {
      // Graceful fallback
    }
  }

  // --- 3. Contact Form Submission & WhatsApp Routing ---
  var contactForm = document.getElementById('contact-form');
  var formFeedback = document.getElementById('form-feedback');
  var feedbackMsg = document.getElementById('feedback-msg');
  var feedbackWaBtn = document.getElementById('feedback-wa-btn');
  var feedbackMailBtn = document.getElementById('feedback-mail-btn');
  var feedbackResetBtn = document.getElementById('feedback-reset-btn');
  var directWhatsAppBtn = document.getElementById('directWhatsAppBtn');

  // Agency Phone / WhatsApp Target
  var AGENCY_PHONE_RAW = '918921859547';

  function buildInquiryPayload(form) {
    var name = (form.querySelector('#name') ? form.querySelector('#name').value.trim() : '') || 'Potential Client';
    var phone = (form.querySelector('#phone') ? form.querySelector('#phone').value.trim() : '') || 'Not provided';
    var email = (form.querySelector('#email') ? form.querySelector('#email').value.trim() : '') || 'Not provided';
    var service = (form.querySelector('#service') ? form.querySelector('#service').value : 'General Enquiry');
    var message = (form.querySelector('#message') ? form.querySelector('#message').value.trim() : '') || 'Interested in learning more.';

    var waText = '👋 *New Enquiry for Nexora Digital*\n\n' +
      '👤 *Name:* ' + name + '\n' +
      '📞 *Phone:* ' + phone + '\n' +
      '✉️ *Email:* ' + email + '\n' +
      '🎯 *Service Interest:* ' + service + '\n\n' +
      '💬 *Project Details:* ' + message;

    var mailSubject = 'Enquiry from ' + name + ' - Nexora Digital';
    var mailBody = 'Name: ' + name + '\n' +
      'Phone: ' + phone + '\n' +
      'Email: ' + email + '\n' +
      'Service: ' + service + '\n\n' +
      'Project Details:\n' + message;

    var waUrl = 'https://wa.me/' + AGENCY_PHONE_RAW + '?text=' + encodeURIComponent(waText);
    var mailUrl = 'mailto:hello@nexoradigital.com?subject=' + encodeURIComponent(mailSubject) + '&body=' + encodeURIComponent(mailBody);

    return {
      name: name,
      phone: phone,
      email: email,
      service: service,
      message: message,
      waUrl: waUrl,
      mailUrl: mailUrl
    };
  }

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic field validation
      var nameInput = contactForm.querySelector('#name');
      var phoneInput = contactForm.querySelector('#phone');
      var messageInput = contactForm.querySelector('#message');

      if (!nameInput.value.trim() || !phoneInput.value.trim() || !messageInput.value.trim()) {
        alert('Please fill in your name, phone number, and a brief message so we can assist you.');
        return;
      }

      var payload = buildInquiryPayload(contactForm);

      // Setup feedback options
      feedbackWaBtn.href = payload.waUrl;
      feedbackMailBtn.href = payload.mailUrl;
      feedbackMsg.textContent = 'Hi ' + payload.name + ', your request for "' + payload.service + '" has been formatted. Choose your preferred way to connect:';

      // Hide form and show confirmation card
      contactForm.style.display = 'none';
      formFeedback.classList.add('show');

      // Seamlessly open WhatsApp in new tab for instant connection
      window.open(payload.waUrl, '_blank');
    });

    if (directWhatsAppBtn) {
      directWhatsAppBtn.addEventListener('click', function () {
        var payload = buildInquiryPayload(contactForm);
        window.open(payload.waUrl, '_blank');
      });
    }

    if (feedbackResetBtn) {
      feedbackResetBtn.addEventListener('click', function () {
        contactForm.reset();
        formFeedback.classList.remove('show');
        contactForm.style.display = 'block';
      });
    }
  }

  // --- 4. Scroll Engagement Modal Popup (on index.html if element exists) ---
  var pop = document.getElementById('pop');
  if (pop) {
    var seen = false;
    try {
      seen = !!sessionStorage.getItem('nxPopSeen');
    } catch (e) {}

    var openModal = function () {
      if (seen) return;
      seen = true;
      pop.classList.add('show');
      try {
        sessionStorage.setItem('nxPopSeen', '1');
      } catch (e) {}
      window.removeEventListener('scroll', onScrollTrigger);
    };

    var closeModal = function () {
      pop.classList.remove('show');
    };

    var onScrollTrigger = function () {
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0 && (window.scrollY / scrollable) >= 0.38) {
        openModal();
      }
    };

    window.addEventListener('scroll', onScrollTrigger, { passive: true });

    var popx = document.getElementById('popx');
    var poplater = document.getElementById('poplater');

    if (popx) popx.addEventListener('click', closeModal);
    if (poplater) poplater.addEventListener('click', closeModal);

    pop.addEventListener('click', function (e) {
      if (e.target === pop) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }
});
