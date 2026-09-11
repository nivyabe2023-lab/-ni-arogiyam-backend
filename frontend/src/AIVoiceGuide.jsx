import React, { useState, useEffect, useRef, useCallback } from "react";
import "./AIVoiceGuide.css";

// =========================================================
// SECTION NARRATION SCRIPTS & PRECISE TARGET SELECTORS
// =========================================================
const VOICE_SCRIPTS = {
  home: {
    title: "NI AROGIYAM Hospital Overview",
    label: "Home",
    speech:
      "Welcome to NI AROGIYAM Hospital, Madurai's premier multi-specialty healthcare destination. We are a 500-bed advanced hospital featuring 40+ specialized departments, 4th Generation Robotic Surgery, and round-the-clock Level-1 Trauma and Emergency care.",
    targetSelector: ".hero-stats-row, .exact-hero-section",
  },
  about: {
    title: "About NI AROGIYAM",
    label: "About Us",
    speech:
      "About NI AROGIYAM Hospital: Driven by compassionate healing and clinical excellence, our NABH-accredited tertiary care facility combines international healthcare protocols, state-of-the-art modular operation theatres, and dedicated medical experts committed to patient wellbeing.",
    targetSelector: ".about-hero-grid, .about-page-container",
  },
  specialties: {
    title: "Centers of Excellence & Specialties",
    label: "Specialties",
    speech:
      "Explore our Super-Specialty Centers of Excellence at NI AROGIYAM. From Interventional Cardiology, Comprehensive Oncology, and Neurology to Orthopedics and 4th Generation Robotic Surgeries, our clinical teams ensure world-class precision and fast recovery.",
    targetSelector: ".specialties-cards-grid, .exact-specialties-page-view",
  },
  facilities: {
    title: "World-Class Hospital Facilities",
    label: "Facilities",
    speech:
      "Our hospital facilities meet the highest global standards, including 24/7 Level-1 Emergency & Trauma Care, advanced 3T MRI & 128-Slice CT imaging, ultramodern ICUs, and a round-the-clock automated pharmacy.",
    targetSelector: ".facilities-cards-grid, .exact-facilities-page-view",
  },
  doctors: {
    title: "Our Senior Specialists & Doctors",
    label: "Our Doctors",
    speech:
      "Meet our distinguished medical faculty: Led by senior specialists including Dr. Rajesh Sharma in Cardiology and Dr. Saravanan in Oncology, our verified clinicians deliver personalized, compassionate, and evidence-based care.",
    targetSelector: ".doctors-showcase-grid, .exact-doctors-page-view",
  },
  "patient-visitors": {
    title: "Patient & Visitor Services",
    label: "Patient & Visitors",
    speech:
      "Patient and visitor care at NI AROGIYAM: We provide seamless cashless hospitalization with over 40 TPAs, comfortable patient suites, transparent billing, and dedicated assistance for families every step of the way.",
    targetSelector: ".pv-stats-bar-wrapper, .exact-patient-visitors-view",
  },
  contact: {
    title: "Contact & 24/7 Emergency",
    label: "Contact Us",
    speech:
      "Contact NI AROGIYAM Hospital: Conveniently located on Madurai Bypass Road, Tamil Nadu. For immediate emergency dispatch, call our 24/7 helpline at +91 452 300 5300. You can also explore our location on the interactive map.",
    targetSelector: ".contact-main-grid, .exact-contact-page-view",
  },
  booking: {
    title: "Book Doctor Consultation",
    label: "Book Appointment",
    speech:
      "Book a doctor consultation instantly: Select your preferred specialty, choose your consulting doctor and convenient time slot, verify your details, and receive instant SMS confirmation.",
    targetSelector: ".modal-dialog-card",
  },
  portal: {
    title: "24/7 Digital Patient Portal",
    label: "Patient Portal",
    speech:
      "Welcome to the NI AROGIYAM Patient Portal: Securely view and download your laboratory test reports, medical invoices, consultation history, and prescriptions anytime from your device.",
    targetSelector: ".patient-portal-content, .modal-dialog-card",
  },
};

const TOUR_ORDER = [
  "home",
  "about",
  "specialties",
  "facilities",
  "doctors",
  "patient-visitors",
  "contact",
];

export default function AIVoiceGuide({
  activeTab = "home",
  onNavigateTab,
  bookingModalOpen = false,
  patientPortalOpen = false,
}) {
  const synthRef = useRef(
    typeof window !== "undefined" ? window.speechSynthesis : null
  );
  const selectedVoiceRef = useRef(null);
  const autoTourTimerRef = useRef(null);
  const lastSectionSpokenRef = useRef(null);
  const hasStartedInitialRef = useRef(false);

  // Pick best available English voice
  const initVoice = useCallback(() => {
    if (!synthRef.current) return;
    const voices = synthRef.current.getVoices();
    if (!voices || voices.length === 0) return;

    const preferredVoice =
      voices.find(
        (v) =>
          v.lang.includes("en-IN") ||
          v.name.toLowerCase().includes("india") ||
          v.name.toLowerCase().includes("neerja")
      ) ||
      voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Natural") ||
            v.name.includes("Google") ||
            v.name.includes("Zira") ||
            v.name.includes("Samantha"))
      ) ||
      voices.find((v) => v.lang.startsWith("en")) ||
      voices[0];

    selectedVoiceRef.current = preferredVoice;
  }, []);

  useEffect(() => {
    initVoice();
    if (synthRef.current && synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = initVoice;
    }
  }, [initVoice]);

  // Smooth scroll to the active section so the visitor sees changes live on the website
  const smoothScrollToSection = useCallback((selector) => {
    if (typeof document === "undefined" || !selector) return;

    setTimeout(() => {
      const targets = selector.split(",").map((s) => s.trim());
      for (const sel of targets) {
        const el = document.querySelector(sel);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          break;
        }
      }
    }, 200);
  }, []);

  // Main Speech Function
  const speakSection = useCallback(
    (sectionKey) => {
      const scriptData = VOICE_SCRIPTS[sectionKey];
      if (!scriptData) return;

      const synth = synthRef.current;
      if (!synth) return;

      if (autoTourTimerRef.current) {
        clearTimeout(autoTourTimerRef.current);
        autoTourTimerRef.current = null;
      }

      // Cancel any ongoing speech before starting next section
      try {
        synth.cancel();
      } catch (err) {
        console.warn("Speech cancel warning:", err);
      }

      lastSectionSpokenRef.current = sectionKey;

      // Smoothly scroll to the section content on the live website
      smoothScrollToSection(scriptData.targetSelector);

      const utterance = new SpeechSynthesisUtterance(scriptData.speech);
      if (selectedVoiceRef.current) {
        utterance.voice = selectedVoiceRef.current;
      }
      utterance.rate = 0.98;
      utterance.pitch = 1.02;

      utterance.onend = () => {
        // Automatically tour through the next live website section
        if (!bookingModalOpen && !patientPortalOpen) {
          const currentIndex = TOUR_ORDER.indexOf(sectionKey);
          if (currentIndex !== -1 && currentIndex < TOUR_ORDER.length - 1) {
            const nextKey = TOUR_ORDER[currentIndex + 1];
            autoTourTimerRef.current = setTimeout(() => {
              if (onNavigateTab) {
                onNavigateTab(nextKey);
              }
            }, 1600);
          }
        }
      };

      utterance.onerror = (e) => {
        console.warn("Speech synthesis notice:", e);
      };

      try {
        synth.speak(utterance);
      } catch (err) {
        console.error("Speech speak error:", err);
      }
    },
    [bookingModalOpen, patientPortalOpen, onNavigateTab, smoothScrollToSection]
  );

  // Trigger voiceover when the active tab or modal changes
  useEffect(() => {
    let activeKey = "home";

    if (bookingModalOpen) {
      activeKey = "booking";
    } else if (patientPortalOpen) {
      activeKey = "portal";
    } else if (activeTab && VOICE_SCRIPTS[activeTab]) {
      activeKey = activeTab;
    }

    if (activeKey !== lastSectionSpokenRef.current) {
      speakSection(activeKey);
    }
  }, [activeTab, bookingModalOpen, patientPortalOpen, speakSection]);

  // Automatically start voiceover when opening website + robust HTTPS browser autoplay unlock
  useEffect(() => {
    const triggerInitialSpeech = () => {
      if (hasStartedInitialRef.current) return;
      hasStartedInitialRef.current = true;
      speakSection("home");
    };

    const initialTimer = setTimeout(() => {
      triggerInitialSpeech();
    }, 500);

    const handleFirstGesture = () => {
      if (synthRef.current && !synthRef.current.speaking) {
        triggerInitialSpeech();
      }
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("scroll", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
    };

    window.addEventListener("pointerdown", handleFirstGesture, { once: true });
    window.addEventListener("click", handleFirstGesture, { once: true });
    window.addEventListener("scroll", handleFirstGesture, { once: true });
    window.addEventListener("keydown", handleFirstGesture, { once: true });
    window.addEventListener("touchstart", handleFirstGesture, { once: true });

    return () => {
      clearTimeout(initialTimer);
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("scroll", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
      if (synthRef.current) {
        try {
          synthRef.current.cancel();
        } catch (e) {}
      }
    };
  }, [speakSection]);

  // Clean, invisible component with zero overlay images or dock bars
  return null;
}
