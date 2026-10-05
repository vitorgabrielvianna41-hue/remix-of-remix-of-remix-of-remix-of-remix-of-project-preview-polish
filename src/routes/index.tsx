import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import content from "@/content/panoprato.html?raw";
import { imageUrls } from "@/content/panoprato-assets";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pintura em Pano de Prato | Comece do zero" },
      { name: "description", content: "Coleção digital com 300 riscos exclusivos, videoaula e guias para começar a pintar panos de prato mesmo sem experiência." },
      { property: "og:title", content: "Pintura em Pano de Prato | Comece do zero" },
      { property: "og:description", content: "Coleção digital com 300 riscos exclusivos, videoaula e guias para começar a pintar panos de prato mesmo sem experiência." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const pageMarkup = content
  .replace(/\/(?:assets)\/[\w/-]+\.webp/g, (path) => imageUrls[path] ?? path)
  // O navegador reescreve tags SVG auto-fechadas (<path/>) como <path></path>;
  // normalizamos para o HTML bater com o que o React compara na hidratação.
  .replace(/<(path|circle|polyline|line|rect|ellipse|polygon|use|stop)((?:[^>"']|"[^"]*"|'[^']*')*?)\/>/g, "<$1$2></$1>");

function Index() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const slides = [...root.querySelectorAll<HTMLElement>(".slide")];
    const dots = [...root.querySelectorAll<HTMLElement>(".dot")];
    const carousel = root.querySelector<HTMLElement>("#hero-carousel");
    let activeSlide = 0;
    let carouselTimer: ReturnType<typeof setInterval> | undefined;
    let lastFocusedElement: HTMLElement | null = null;
    let touchStartX = 0;

    function showSlide(index: number) {
      if (!slides.length) return;
      activeSlide = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === activeSlide);
        slide.setAttribute("aria-hidden", String(i !== activeSlide));
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === activeSlide);
        dot.setAttribute("aria-selected", String(i === activeSlide));
      });
      if (carousel) carousel.dataset['current'] = String(activeSlide + 1);
    }
    function startCarousel() {
      clearInterval(carouselTimer);
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        carouselTimer = setInterval(() => showSlide(activeSlide + 1), 6500);
      }
    }
    function closeModal(modal: HTMLElement | null) {
      if (!modal) return;
      modal.hidden = true;
      document.body.classList.remove("modal-open");
      lastFocusedElement?.focus();
    }
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const carouselButton = target.closest<HTMLElement>("[data-carousel]");
      if (carouselButton) {
        showSlide(activeSlide + (carouselButton.dataset['carousel'] === "next" ? 1 : -1));
        startCarousel();
      }
      const dot = target.closest<HTMLElement>(".dot[data-index]");
      if (dot) {
        showSlide(Number(dot.dataset['index']));
        startCarousel();
      }
      const faqButton = target.closest<HTMLElement>(".faq-item button");
      if (faqButton) {
        const item = faqButton.closest<HTMLElement>(".faq-item");
        const willOpen = !item?.classList.contains("is-open");
        root?.querySelectorAll<HTMLElement>(".faq-item").forEach((faq) => {
          faq.classList.toggle("is-open", faq === item && willOpen);
          faq.querySelector("button")?.setAttribute("aria-expanded", String(faq === item && willOpen));
        });
      }
      const modalTrigger = target.closest<HTMLElement>("[data-modal-open]");
      if (modalTrigger) {
        const modal = root?.querySelector<HTMLElement>(`#${modalTrigger.dataset['modalOpen']}`);
        if (modal) {
          lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
          modal.hidden = false;
          document.body.classList.add("modal-open");
          modal.querySelector<HTMLElement>(".modal-close")?.focus();
        }
      }
      const modalCloser = target.closest<HTMLElement>("[data-modal-close]");
      if (modalCloser) closeModal(modalCloser.closest<HTMLElement>(".modal"));
      if (target.closest(".back-top")) window.scrollTo({ top: 0, behavior: "smooth" });
      const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (anchor) {
        const id = anchor.getAttribute("href")?.slice(1);
        const destination = id ? document.getElementById(id) : null;
        if (destination) {
          event.preventDefault();
          destination.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeModal(root?.querySelector<HTMLElement>(".modal:not([hidden])") ?? null);
      if (document.activeElement === carousel && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
        event.preventDefault();
        showSlide(activeSlide + (event.key === "ArrowRight" ? 1 : -1));
        startCarousel();
      }
    }
    function onScroll() {
      root?.querySelector(".back-top")?.classList.toggle("is-visible", window.scrollY > 700);
    }
    function onTouchStart(event: TouchEvent) { touchStartX = event.changedTouches[0]?.screenX ?? 0; }
    function onTouchEnd(event: TouchEvent) {
      const distance = (event.changedTouches[0]?.screenX ?? 0) - touchStartX;
      if (Math.abs(distance) > 35) showSlide(activeSlide + (distance < 0 ? 1 : -1));
      startCarousel();
    }
    const observer = "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? new IntersectionObserver((entries, current) => entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal", "is-visible");
            current.unobserve(entry.target);
          }
        }), { threshold: 0.12 })
      : null;
    root.querySelectorAll(".section-heading, .worry-card, .gallery-card, .process-card, .icon-card, .benefit-card, .bonus-card, .social-grid figure, .creator-image, .offer-image, .offer-card").forEach((item) => observer?.observe(item));
    root.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    carousel?.addEventListener("touchstart", onTouchStart, { passive: true });
    carousel?.addEventListener("touchend", onTouchEnd, { passive: true });
    startCarousel();
    return () => {
      clearInterval(carouselTimer);
      observer?.disconnect();
      root.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
      carousel?.removeEventListener("touchstart", onTouchStart);
      carousel?.removeEventListener("touchend", onTouchEnd);
      document.body.classList.remove("modal-open");
    };
  }, []);

  return <div ref={pageRef} dangerouslySetInnerHTML={{ __html: pageMarkup }} />;
}
