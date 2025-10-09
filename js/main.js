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
     Portfolio Scroll Fade-in
  ------------------------------ */
  const projectCards = document.querySelectorAll("#portfolio .project");

  if ("IntersectionObserver" in window) {
    const projectObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // ✨ Smooth staggered reveal
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, index * 120);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    projectCards.forEach((card) => {
      projectObserver.observe(card);

      // ✅ Instantly show already visible cards on page load
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        card.classList.add("visible");
        projectObserver.unobserve(card);
      }
    });
  } else {
    projectCards.forEach((card) => card.classList.add("visible"));
  }

  /* ------------------------------
     Active Navigation Highlight (Fixed for bottom)
  ------------------------------ */
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-links a");

  const activateSection = () => {
    let current = "";
    const scrollY = window.scrollY;
    const windowBottom = scrollY + window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 200;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    // 🧩 Fix: if user reaches the very bottom, force 'scs' to be active
    if (windowBottom >= docHeight - 5) {
      current = "scs";
    }

    navItems.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href").replace("#", "");
      if (href === current) {
        link.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", activateSection);
  activateSection();
});

/* ------------------------------
   Hamburger Menu Toggle + Outside Click Close
------------------------------ */
const burger = document.querySelector(".burger");
const sidebar = document.querySelector(".sidebar");
const content = document.querySelector(".content"); // main page area

if (burger && sidebar) {
  burger.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent click from bubbling
    const isOpen = sidebar.classList.toggle("open");
    burger.classList.toggle("open", isOpen);
  });

  // Close sidebar when clicking a link
  const sidebarLinks = sidebar.querySelectorAll("a");
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("open");
      burger.classList.remove("open");
    });
  });

  // ✅ Close sidebar when clicking outside it
  document.addEventListener("click", (e) => {
    if (
      sidebar.classList.contains("open") &&
      !sidebar.contains(e.target) &&
      !burger.contains(e.target)
    ) {
      sidebar.classList.remove("open");
      burger.classList.remove("open");
    }
  });
}
