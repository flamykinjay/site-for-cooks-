(function () {
  'use strict';

  function initMobileNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var panel = document.querySelector('[data-mobile-nav]');
    if (!toggle || !panel) return;

    var root = document.documentElement;

    function setOpen(isOpen) {
      root.classList.toggle('nav-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      panel.setAttribute('aria-hidden', String(!isOpen));
    }

    toggle.addEventListener('click', function () {
      var isOpen = root.classList.contains('nav-open');
      setOpen(!isOpen);
    });

    panel.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        setOpen(false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setOpen(false);
    });

    var desktopQuery = window.matchMedia('(min-width: 960px)');
    function handleBreakpointChange(query) {
      if (query.matches) setOpen(false);
    }
    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener('change', handleBreakpointChange);
    } else if (desktopQuery.addListener) {
      desktopQuery.addListener(handleBreakpointChange);
    }
  }

  function initScrollReveal() {
    var targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initStepScrollspy() {
    var steps = document.querySelectorAll('[data-step]');
    var navItems = document.querySelectorAll('[data-step-nav-item]');
    if (!steps.length || !navItems.length) return;

    var navByKey = {};
    navItems.forEach(function (item) {
      navByKey[item.getAttribute('data-step-nav-item')] = item;
    });

    function setActive(key) {
      navItems.forEach(function (item) {
        item.classList.toggle('is-active', item.getAttribute('data-step-nav-item') === key);
      });
    }

    if (!('IntersectionObserver' in window)) {
      setActive(steps[0].getAttribute('data-step'));
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActive(entry.target.getAttribute('data-step'));
          }
        });
      },
      { threshold: 0.5, rootMargin: '-20% 0px -40% 0px' }
    );

    steps.forEach(function (step) {
      observer.observe(step);
    });

    navItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var key = item.getAttribute('data-step-nav-item');
        var target = document.querySelector('[data-step="' + key + '"]');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function initMenuFilters() {
    var buttons = document.querySelectorAll('[data-filter]');
    var dishes = document.querySelectorAll('[data-dish]');
    if (!buttons.length || !dishes.length) return;

    function applyFilter(filter) {
      dishes.forEach(function (dish) {
        var categories = (dish.getAttribute('data-category') || '').split(' ');
        var show = filter === 'all' || categories.indexOf(filter) !== -1;
        dish.style.display = show ? '' : 'none';
      });
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) {
          b.setAttribute('aria-pressed', 'false');
        });
        btn.setAttribute('aria-pressed', 'true');
        applyFilter(btn.getAttribute('data-filter'));
      });
    });
  }

  function initFooterYear() {
    var el = document.querySelector('[data-year]');
    if (!el) return;
    el.textContent = String(new Date().getFullYear());
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    initScrollReveal();
    initStepScrollspy();
    initMenuFilters();
    initFooterYear();
  });
})();
