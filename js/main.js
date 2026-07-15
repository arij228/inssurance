// ==========================================================================
// Globatech — shared site behavior (nav, scroll reveal, back-to-top, tabs)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---- mobile nav toggle ---- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.navlinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* ---- highlight current page in nav ---- */
  const currentPage = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.navlinks a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---- scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---- back to top ---- */
  const toTop = document.querySelector('.to-top');
  if (toTop) {
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('show', window.scrollY > 600);
    });
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- dashboard tabs (Power BI page) ----
     Swap in real Power BI "Publish to web" embed URLs per tab here. */
  const dashTabs = document.querySelectorAll('.dash-tab');
  const dashBody = document.getElementById('dashBody');
  // NOTE: this is a secure ("autoAuth=true") embed URL, not a public "Publish to web" one.
  // It only renders for viewers signed into Power BI with access to this workspace —
  // it will show a Microsoft login (or access-denied) screen for anonymous public visitors.
  // Use this as-is for an internal/team site. For a public-facing site, replace with a
  // 'Publish to web' URL (https://app.powerbi.com/view?r=...) instead.
  const REPORT_BASE = 'https://app.powerbi.com/reportEmbed?reportId=fc057440-e911-44c2-b8eb-15e820e4badc&autoAuth=true&ctid=5a6af91f-06e5-43dd-b19b-6a9c31ed5c8c';

  const dashEmbeds = {
    0: REPORT_BASE, // Executive Summary — same report, default page
    1: REPORT_BASE + '&pageName=ReportSection_ClaimsAnalysis',  // update pageName to your real section id
    2: REPORT_BASE + '&pageName=ReportSection_RiskSegmentation' // update pageName to your real section id
  };
  if (dashTabs.length && dashBody) {
    // render the initially-active tab's embed on load, if one is configured
    const activeTab = document.querySelector('.dash-tab.active');
    if (activeTab) {
      const initialUrl = dashEmbeds[activeTab.dataset.tab];
      if (initialUrl) {
        dashBody.innerHTML = `<iframe src="${initialUrl}" title="Power BI report" allowfullscreen></iframe>`;
      }
    }

    dashTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        dashTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const url = dashEmbeds[tab.dataset.tab];
        if (url) {
          dashBody.innerHTML = `<iframe src="${url}" title="Power BI report" allowfullscreen></iframe>`;
        }
        // if url is null, the placeholder markup already in dashBody stays as-is
      });
    });
  }

});