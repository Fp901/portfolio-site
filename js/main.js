// ==============================
// main.js — Enhanced + Visible Version
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
   Fade-In Animations (Fixed)
------------------------------ */
  const fadeItems = document.querySelectorAll(".fade-item");

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
      { threshold: 0.1 }
    );

    fadeItems.forEach((item) => {
      observer.observe(item);

      // ✅ Instantly show items already visible on page load
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        item.classList.add("visible");
        observer.unobserve(item);
      }
    });
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
    const scrollY = window.scrollY;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 200;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navItems.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href").replace("#", "");
      if (href === current) {
        link.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", activateSection);
  activateSection(); // run once on load
});
