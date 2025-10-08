// ==============================
// main.js — Step 4: Active Navigation Highlight (Fixed & Improved)
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  /* ------------------------------
     Smooth Scrolling
  ------------------------------ */
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* ------------------------------
     Scroll Progress Bar
  ------------------------------ */
  const progressBar = document.createElement("div");
  progressBar.id = "progress-bar";
  document.body.appendChild(progressBar);

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${scrollPercent}%`;
  });

  /* ------------------------------
     Fade-In Animations
  ------------------------------ */
  const fadeItems = document.querySelectorAll(".project, section");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    fadeItems.forEach((item) => observer.observe(item));
  } else {
    fadeItems.forEach((item) => item.classList.add("visible"));
  }

  /* ------------------------------
     Active Navigation Highlight (Fixed)
  ------------------------------ */
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-links a");

  const activateSection = () => {
    let current = "";
    const scrollPos = window.scrollY + window.innerHeight / 2;
    const docBottom =
      document.documentElement.scrollHeight - window.innerHeight - 5;

    sections.forEach((section) => {
      const top = section.offsetTop - 200;
      const bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        current = section.getAttribute("id");
      }
    });

    // Highlight last section when at page bottom
    if (window.scrollY >= docBottom) {
      current = sections[sections.length - 1].id;
    }

    navItems.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href").includes(current)
      );
    });
  };

  window.addEventListener("scroll", activateSection);
  window.addEventListener("resize", activateSection);
});
