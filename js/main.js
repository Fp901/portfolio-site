// ==============================
// main.js — Step 4: Active Navigation Highlight
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
            // Keep fade once behavior (no re-fade)
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
     Active Navigation Highlight
  ------------------------------ */
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-links a");

  const activateSection = () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 150;
      if (scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navItems.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(current)) {
        link.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", activateSection);
});
