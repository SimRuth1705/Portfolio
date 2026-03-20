import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Quote,
  ChevronLeft,
  ChevronRight,
  User,
  Trash2,
  Edit2,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useDialog } from "../context/DialogContext";
import Editable from "./Editable";
import AdminSettingsButton from "./AdminSettingsButton";
import AddTestimonialModal from "./AddTestimonialModal";
import { API_BASE } from "../constants";

const Testimonials = () => {
  const { isDark } = useTheme();
  const { isAdmin } = useAuth();
  const [current, setCurrent] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { showAlert, showConfirm } = useDialog();

  const handleDeleteTestimonial = async (itemId) => {
    const confirmed = await showConfirm("Are you sure you want to delete this testimonial?");
    if (!confirmed) return;
    try {
      const res = await fetch(`${API_BASE}/api/testimonials/${itemId}`, {
        method: "DELETE",
        credentials: 'include'
      });
      if (res.ok) {
        setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      } else {
        showAlert("Failed to delete testimonial. Please try again.");
      }
    } catch (err) {
      showAlert("Failed to delete testimonial. Please try again.");
    }
  };

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/api/testimonials`);
        if (res.ok) {
          const data = await res.json();
          if (!ignore) {
            setItems(Array.isArray(data) ? data : []);
            setError(null);
          }
        } else {
          throw new Error(`Failed to fetch testimonials: ${res.status}`);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Error loading testimonials:", err);
          setError(err.message);
          setItems([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();

    const handleRefresh = () => load();
    window.addEventListener('content-updated', handleRefresh);

    return () => {
      ignore = true;
      window.removeEventListener('content-updated', handleRefresh);
    };
  }, [API_BASE]);

  const next = () => {
    if (items.length === 0) return;
    setCurrent((c) => (c + 1) % items.length);
  };
  const prev = () => {
    if (items.length === 0) return;
    setCurrent((c) => (c - 1 + items.length) % items.length);
  };

  return (
    <>
      <section
        id="testimonials"
        className={`py-28 sm:py-32 md:py-60 px-4 sm:px-6 md:px-10 border-b relative transition-colors duration-700 ${isDark ? "border-white/20" : "border-black/10"}`}
      >
        <span
          className={`absolute top-6 sm:top-8 md:top-10 left-4 sm:left-6 md:left-10 text-[10px] font-mono ${isDark ? "text-zinc-600" : "text-zinc-400"}`}
        >
          [ 05. SIGNAL ]
        </span>

        <div className="max-w-[1400px] mx-auto mt-10">
          {/* Header */}
          <div className="mb-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4"
            >
              <div
                className={`h-px w-8 ${isDark ? "bg-white/20" : "bg-black/20"}`}
              />
              <span
                className={`text-[10px] font-mono uppercase tracking-[0.5em] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
              >
                <Editable
                  id="testimonials_status"
                  defaultContent="Trust Signals"
                />
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`text-5xl sm:text-6xl md:text-9xl font-display font-black uppercase ${isDark ? "text-white" : "text-black"}`}
            >
              <Editable id="testimonials_title" defaultContent="VOICES" />
            </motion.h2>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div
                className={`animate-spin rounded-full h-12 w-12 border-4 ${isDark ? "border-white/20 border-t-white" : "border-black/20 border-t-black"}`}
              ></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div
              className={`text-center py-20 ${isDark ? "text-red-400" : "text-red-600"}`}
            >
              <p className="mb-4">Failed to load testimonials</p>
              <button
                onClick={() => window.location.reload()}
                className={`px-4 py-2 border ${isDark ? "border-white/20 hover:border-white/40" : "border-black/20 hover:border-black/40"}`}
              >
                Retry
              </button>
            </div>
          )}

          {/* Testimonial Card */}
          {!loading && !error && (
            <div className="grid md:grid-cols-12 gap-10 items-center">
              <div className="md:col-span-1 hidden md:flex flex-col items-center">
                <Quote
                  size={40}
                  className={`${isDark ? "text-white/10" : "text-black/10"}`}
                />
              </div>

              <div className="md:col-span-9 relative min-h-[200px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p
                      className={`text-2xl md:text-4xl font-display font-light leading-snug mb-10 ${isDark ? "text-zinc-300" : "text-zinc-600"}`}
                    >
                      {items.length > 0 ? `"${items[current].quote}"` : ""}
                    </p>

                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full border flex items-center justify-center ${isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/5"}`}
                      >
                        <User
                          size={16}
                          className={isDark ? "text-zinc-500" : "text-zinc-400"}
                        />
                      </div>
                      <div>
                        <p
                          className={`text-sm font-bold ${isDark ? "text-white" : "text-black"}`}
                        >
                          {items.length > 0 ? items[current].name : ""}
                        </p>
                        <p
                          className={`text-[10px] font-mono uppercase tracking-widest ${isDark ? "text-zinc-600" : "text-zinc-400"}`}
                        >
                          {items.length > 0 ? items[current].role : ""}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="md:col-span-2 flex md:flex-col items-center gap-4 justify-center">
                <button
                  onClick={prev}
                  className={`w-10 h-10 border flex items-center justify-center transition-all duration-300 ${isDark ? "border-white/10 hover:border-white/40 hover:bg-white/5 text-zinc-500 hover:text-white" : "border-black/10 hover:border-black/40 hover:bg-black/5 text-zinc-400 hover:text-black"}`}
                >
                  <ChevronLeft size={16} />
                </button>

                <span
                  className={`text-[10px] font-mono ${isDark ? "text-zinc-600" : "text-zinc-400"}`}
                >
                  {String(items.length === 0 ? 0 : current + 1).padStart(
                    2,
                    "0",
                  )}{" "}
                  / {String(items.length).padStart(2, "0")}
                </span>

                <button
                  onClick={next}
                  className={`w-10 h-10 border flex items-center justify-center transition-all duration-300 ${isDark ? "border-white/10 hover:border-white/40 hover:bg-white/5 text-zinc-500 hover:text-white" : "border-black/10 hover:border-black/40 hover:bg-black/5 text-zinc-400 hover:text-black"}`}
                >
                  <ChevronRight size={16} />
                </button>

                {/* Admin Delete Button */}
                {isAdmin && items.length > 0 && (
                  <button
                    onClick={() => handleDeleteTestimonial(items[current].id)}
                    className={`w-10 h-10 border flex items-center justify-center transition-all duration-300 ${isDark ? "border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10 text-red-500 hover:text-red-400" : "border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10 text-red-600 hover:text-red-700"}`}
                    title="Delete testimonial"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                {/* Dots */}
                <div className="flex md:flex-col gap-2 mt-2">
                  {items.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current
                        ? isDark
                          ? "bg-white scale-125"
                          : "bg-black scale-125"
                        : isDark
                          ? "bg-white/20 hover:bg-white/40"
                          : "bg-black/20 hover:bg-black/40"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Testimonials;
