// No backend exists yet, so the form hands off to the visitor's email app (mailto:).
// We never claim "sent": the message only exists once the visitor sends it themselves.
export const CONTACT_EMAIL = 'info@vpyoga.com'; // from the original index.html
const $ = (s, r = document) => r.querySelector(s);

export function initEnquiry(programmes) {
  const dlg = $('#enquiry'), form = $('#enquiry-form'), status = $('#enquiry-status');
  const sel = $('#f-programme');
  sel.innerHTML = '<option value="">Not sure yet</option>' + programmes.map(p => `<option value="${p.title}">${p.title}</option>`).join('');
  const open = (title = '') => { sel.value = title; status.textContent = ''; dlg.showModal(); $('#f-name').focus(); };
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-enquire]');
    if (t) { e.preventDefault(); open(t.dataset.enquire); }
    if (e.target === dlg || e.target.closest('[data-close]')) dlg.close();
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    const phoneOk = /^[+()\-\s\d]{7,18}$/.test(d.phone.trim());
    const emailOk = !d.email || /^\S+@\S+\.\S+$/.test(d.email);
    $('#f-phone').setCustomValidity(phoneOk ? '' : 'Enter a valid phone number');
    $('#f-email').setCustomValidity(emailOk ? '' : 'Enter a valid email address');
    if (!form.reportValidity()) return;
    const body = `Name: ${d.name}\nPhone: ${d.phone}\nEmail: ${d.email || '-'}\nProgramme: ${d.programme || 'Not sure yet'}\n\n${d.message || ''}`;
    status.textContent = 'Opening your email app. Your enquiry is only sent once you press send there.';
    location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Enquiry: ' + (d.programme || 'Yoga classes'))}&body=${encodeURIComponent(body)}`;
  });
}
