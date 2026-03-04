/* ═══ PASSWORD GATE ═══
   Client-side gate for case study pages.
   Deters casual visitors; recruiters get the password from ABM.
   ─────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  var PASS = 'abmcooks';

  // Lock the body
  document.body.classList.add('gated');

  // Build overlay
  var overlay = document.createElement('div');
  overlay.className = 'gate-overlay';
  overlay.innerHTML =
    '<div class="gate-card">' +
    '<div class="gate-lock">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>' +
    '<path d="M7 11V7a5 5 0 0110 0v4"/>' +
    '</svg>' +
    '</div>' +
    '<div class="gate-title">Password Protected</div>' +
    '<div class="gate-sub">Enter password to view this case study.</div>' +
    '<form class="gate-form">' +
    '<div class="gate-input-wrap">' +
    '<input type="password" class="gate-input" placeholder="Password" autocomplete="off" autofocus>' +
    '</div>' +
    '<button type="submit" class="gate-btn">Unlock</button>' +
    '<div class="gate-error-msg">Wrong password</div>' +
    '</form>' +
    '<a href="/" class="gate-back">← Back to Home</a>' +
    '</div>';

  document.body.prepend(overlay);

  var input = overlay.querySelector('.gate-input');
  var errorMsg = overlay.querySelector('.gate-error-msg');

  // Focus input after animation
  setTimeout(function () { input.focus(); }, 500);

  overlay.querySelector('.gate-form').addEventListener('submit', function (e) {
    e.preventDefault();

    if (input.value === PASS) {
      // Success — remove gate
      overlay.classList.add('gate-leaving');
      document.body.classList.remove('gated');
      setTimeout(function () { overlay.remove(); }, 350);
    } else {
      // Wrong password
      input.classList.add('gate-error');
      errorMsg.classList.add('visible');
      input.value = '';
      setTimeout(function () {
        input.classList.remove('gate-error');
      }, 400);
    }
  });
})();
