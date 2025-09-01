import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// Kallada Resorts – Single-file React site (sections stacked top-to-bottom)
// Frontend: React + Tailwind (single component export)
// Backend: Django REST (JWT) — full minimal code stubs included at the bottom as comments
// Preview: This file includes a MOCK mode so it runs without a backend. Set BACKEND_BASE_URL to use your Django API.

import React, { useEffect, useMemo, useState } from "react";

// ===============================
// CONFIG
// ===============================
const BACKEND_BASE_URL = ""; // e.g., "http://127.0.0.1:8000". Leave empty to use MOCK mode for preview
const USE_MOCK = !BACKEND_BASE_URL;

const heroBg =
  "https://images.unsplash.com/photo-1505692794403-34d4982f88aa?q=80&w=2070&auto=format&fit=crop"; // elegant resort exterior
const sectionBg =
  "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2070&auto=format&fit=crop"; // warm interior backdrop
const aboutBg =
  "https://images.unsplash.com/photo-1505692794403-1f9c36c1ba4e?q=80&w=2070&auto=format&fit=crop"; // architecture lines
const supportBg =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2069&auto=format&fit=crop"; // calm abstract

// Sample houses (images from Unsplash) — replace with your API data later
const HOUSES = [
  {
    id: 1,
    name: "Palm View Villa",
    location: "Varkala, Kerala",
    price: 17500000,
    features: ["4 BHK", "Sea-facing", "Pool", "Solar + Smart Home"],
    img: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c2bf?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Backwater Bungalow",
    location: "Alappuzha, Kerala",
    price: 12800000,
    features: ["3 BHK", "Private Jetty", "Garden", "Rainwater Harvesting"],
    img: "https://images.unsplash.com/photo-1613977257593-53c29fbb3834?q=80&w=2069&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Hillcrest Haven",
    location: "Munnar, Kerala",
    price: 9900000,
    features: ["2 BHK", "Tea Estate Views", "Fireplace", "EV Charging"],
    img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "City Luxe Loft",
    location: "Kochi, Kerala",
    price: 14500000,
    features: ["3 BHK", "Penthouse", "Gym Access", "24/7 Security"],
    img: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=2069&auto=format&fit=crop",
  },
];

// ===============================
// Helper: Currency format (INR)
// ===============================
const inr = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

// ===============================
// Minimal API layer (switches between mock & backend)
// ===============================
const API = {
  async signup(payload) {
    if (USE_MOCK) {
      const users = JSON.parse(localStorage.getItem("kr_users") || "[]");
      if (users.find((u) => u.email === payload.email)) throw new Error("User already exists");
      users.push({ ...payload, id: Date.now() });
      localStorage.setItem("kr_users", JSON.stringify(users));
      return { message: "signed_up" };
    }
    const r = await fetch(`${BACKEND_BASE_URL}/api/auth/signup/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  async login(payload) {
    if (USE_MOCK) {
      const users = JSON.parse(localStorage.getItem("kr_users") || "[]");
      const ok = users.find((u) => u.email === payload.email && u.password === payload.password);
      if (!ok) throw new Error("Invalid credentials");
      localStorage.setItem("kr_auth", JSON.stringify({ email: payload.email }));
      return { token: "mock-token" };
    }
    const r = await fetch(`${BACKEND_BASE_URL}/api/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  async bookViewing(payload) {
    if (USE_MOCK) {
      const bookings = JSON.parse(localStorage.getItem("kr_bookings") || "[]");
      bookings.push({ id: Date.now(), ...payload });
      localStorage.setItem("kr_bookings", JSON.stringify(bookings));
      return { status: "ok" };
    }
    const r = await fetch(`${BACKEND_BASE_URL}/api/booking/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
  async review(payload) {
    if (USE_MOCK) {
      const reviews = JSON.parse(localStorage.getItem("kr_reviews") || "[]");
      reviews.push({ id: Date.now(), ...payload });
      localStorage.setItem("kr_reviews", JSON.stringify(reviews));
      return { status: "ok" };
    }
    const r = await fetch(`${BACKEND_BASE_URL}/api/reviews/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },
};

// ===============================
// UI helpers
// ===============================
function Section({ id, bg, title, subtitle, children }) {
  return (
    <section id={id} className="w-full">
      <div
        className="w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="backdrop-brightness-75">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 text-white">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold drop-shadow-sm">{title}</h2>
            )}
            {subtitle && (
              <p className="mt-2 max-w-3xl text-white/90">{subtitle}</p>
            )}
            <div className="mt-6 md:mt-10">
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({ children }) {
  return (
    <div className="rounded-2xl bg-white/95 shadow-xl ring-1 ring-black/5 overflow-hidden">
      {children}
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-white/90">{label}</span>
      <input
        className="mt-1 w-full rounded-xl border border-white/20 bg-white/90 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        {...props}
      />
    </label>
  );
}

function Textarea({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-white/90">{label}</span>
      <textarea
        className="mt-1 w-full rounded-xl border border-white/20 bg-white/90 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        {...props}
      />
    </label>
  );
}

// ===============================
// MAIN COMPONENT
// ===============================
export default function KalladaResorts() {
  const [auth, setAuth] = useState(() => JSON.parse(localStorage.getItem("kr_auth") || "null"));
  const [authMode, setAuthMode] = useState("login");

  // Booking form state
  const [booking, setBooking] = useState({ houseId: HOUSES[0].id, name: "", phone: "", date: "" });
  const [bookingMsg, setBookingMsg] = useState("");

  // Review state
  const [rating, setRating] = useState(7);
  const [review, setReview] = useState("");
  const [supportMsg, setSupportMsg] = useState("");

  useEffect(() => {
    localStorage.setItem("kr_auth", JSON.stringify(auth));
  }, [auth]);

  const houses = useMemo(() => HOUSES, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      await API.signup({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      });
      setAuthMode("login");
      alert("Signup successful. Please login.");
    } catch (err) {
      alert(String(err.message || err));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      const res = await API.login({
        email: form.get("email"),
        password: form.get("password"),
      });
      setAuth({ email: form.get("email"), token: res.token || "" });
    } catch (err) {
      alert(String(err.message || err));
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await API.bookViewing({ ...booking, user: auth?.email || null });
      setBookingMsg("Viewing booked! Our advisor will reach out.");
      setBooking({ houseId: booking.houseId, name: "", phone: "", date: "" });
    } catch (err) {
      setBookingMsg(String(err.message || err));
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await API.review({ rating: Number(rating), review, user: auth?.email || "guest" });
      setSupportMsg("Thanks! Your feedback was submitted.");
      setReview("");
      setRating(7);
    } catch (err) {
      setSupportMsg(String(err.message || err));
    }
  };

  return (
    <div className="min-h-screen w-full text-white">
      {/* Sticky mini-header */}
      <div className="sticky top-0 z-50 bg-emerald-900/80 backdrop-blur supports-[backdrop-filter]:bg-emerald-900/60">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
          <div className="font-extrabold tracking-wide">Kallada Resorts</div>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#home" className="hover:underline">Home</a>
            <a href="#listings" className="hover:underline">Houses</a>
            <a href="#booking" className="hover:underline">Booking</a>
            <a href="#about" className="hover:underline">About</a>
            <a href="#support" className="hover:underline">Customer Service</a>
            <a href="#auth" className="hover:underline">Login/Sign up</a>
          </nav>
          <div className="md:hidden text-xs text-white/80">scroll ↓</div>
        </div>
      </div>

      {/* HOME */}
      <Section
        id="home"
        bg={heroBg}
        title="Kallada Resorts"
        subtitle={
          "Our mission is to craft homes that blend Kerala's natural beauty with modern comfort. Our vision is a sustainable, community-first future where every family finds a serene place to belong."
        }
      >
        <Card>
          <div className="grid md:grid-cols-2">
            <div className="p-6 md:p-10">
              <h3 className="text-2xl font-semibold text-emerald-900">Find your next home by the waters & hills</h3>
              <p className="mt-3 text-gray-700">
                Explore curated villas, bungalows, and lofts across Kerala — sea-facing retreats,
                backwater escapes, hilltop havens, and city luxe living. Transparent pricing,
                modern amenities, and guided tours.
              </p>
              <div className="mt-6 flex gap-3">
                <a href="#listings" className="rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">Browse Houses</a>
                <a href="#booking" className="rounded-xl bg-white px-4 py-2 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-50">Book a Viewing</a>
              </div>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=2069&auto=format&fit=crop" alt="Resort collage" className="h-full w-full object-cover" />
            </div>
          </div>
        </Card>
      </Section>

      {/* HOUSES / MAIN PAGE */}
      <Section
        id="listings"
        bg={sectionBg}
        title="Featured Houses"
        subtitle="Location, images, prices, and features — all at a glance."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {houses.map((h) => (
            <Card key={h.id}>
              <div className="grid md:grid-cols-2">
                <img src={h.img} alt={h.name} className="h-56 w-full object-cover md:h-full" />
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-emerald-900">{h.name}</h4>
                  <p className="text-sm text-gray-600">{h.location}</p>
                  <p className="mt-2 text-lg font-bold text-emerald-700">{inr(h.price)}</p>
                  <ul className="mt-3 list-disc pl-5 text-sm text-gray-700 space-y-1">
                    {h.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <a href="#booking" className="mt-4 inline-block rounded-xl bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700">Book a Viewing</a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* BOOKING SECTION */}
      <Section
        id="booking"
        bg={sectionBg}
        title="Book a House Viewing"
        subtitle="Choose a house, pick a date, and our advisor will confirm your slot."
      >
        <form onSubmit={handleBook} className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-white/90">Select House</span>
            <select
              className="mt-1 w-full rounded-xl border border-white/20 bg-white/90 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              value={booking.houseId}
              onChange={(e) => setBooking((b) => ({ ...b, houseId: Number(e.target.value) }))}
            >
              {houses.map((h) => (
                <option key={h.id} value={h.id}>{h.name} — {h.location}</option>
              ))}
            </select>
          </label>
          <Input
            label="Your Name"
            required
            value={booking.name}
            onChange={(e) => setBooking((b) => ({ ...b, name: e.target.value }))}
            placeholder="Full name"
          />
          <Input
            label="Phone"
            required
            value={booking.phone}
            onChange={(e) => setBooking((b) => ({ ...b, phone: e.target.value }))}
            placeholder="e.g., +91 98765 43210"
          />
          <Input
            label="Preferred Date"
            type="date"
            required
            value={booking.date}
            onChange={(e) => setBooking((b) => ({ ...b, date: e.target.value }))}
          />
          <div className="md:col-span-2">
            <button className="rounded-xl bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700">Submit Booking</button>
            {bookingMsg && <span className="ml-3 text-sm text-white/90">{bookingMsg}</span>}
          </div>
        </form>
      </Section>

      {/* ABOUT SECTION */}
      <Section
        id="about"
        bg={aboutBg}
        title="About Kallada Resorts"
        subtitle="Features, values, services, and the people behind our promise."
      >
        <Card>
          <div className="grid md:grid-cols-3">
            <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-emerald-100/40">
              <h4 className="text-xl font-semibold text-emerald-900">Our Features</h4>
              <ul className="mt-3 space-y-2 text-gray-700 text-sm list-disc pl-5">
                <li>Vetted locations: coastline, backwaters, hills, and urban cores</li>
                <li>Green builds: solar, rainwater harvesting, thermal insulation</li>
                <li>Smart living: IoT-enabled lighting, climate, and security</li>
                <li>Transparent pricing & documentation assistance</li>
              </ul>
            </div>
            <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-emerald-100/40">
              <h4 className="text-xl font-semibold text-emerald-900">Our Values</h4>
              <ul className="mt-3 space-y-2 text-gray-700 text-sm list-disc pl-5">
                <li>Customer-first guidance over pushy sales</li>
                <li>Long-term community building and local employment</li>
                <li>Sustainability across materials and operations</li>
                <li>Craftsmanship, reliability, and empathy</li>
              </ul>
            </div>
            <div className="p-6 md:p-8">
              <h4 className="text-xl font-semibold text-emerald-900">Services</h4>
              <ul className="mt-3 space-y-2 text-gray-700 text-sm list-disc pl-5">
                <li>Property discovery & tours</li>
                <li>Home customization packages</li>
                <li>Legal & financing coordination</li>
                <li>Handover & after-sales care</li>
              </ul>
            </div>
          </div>
          <div className="p-6 md:p-8 bg-emerald-50/80 text-emerald-900">
            <h4 className="text-lg font-semibold">Founders</h4>
            <p className="mt-2 text-sm leading-relaxed">
              <span className="font-semibold">Anaya Kallada</span> — Architect & Sustainability Lead. 
              <span className="font-semibold">Rohan Menon</span> — Operations & Community Partnerships. 
              <span className="font-semibold">Devika Suresh</span> — Customer Experience & Product.
              Together, they started Kallada Resorts in 2016 to bring hospitality-grade attention to residential living across Kerala.
            </p>
          </div>
        </Card>
      </Section>

      {/* CUSTOMER SERVICE */}
      <Section
        id="support"
        bg={supportBg}
        title="Customer Service"
        subtitle="Rate us, leave a review, or reach us in an emergency."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <div className="p-6">
              <h4 className="text-lg font-semibold text-emerald-900">Rate Your Experience</h4>
              <p className="text-sm text-gray-700 mt-1">1 (poor) to 10 (excellent)</p>
              <input
                type="range"
                min={1}
                max={10}
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="mt-4 w-full"
              />
              <div className="mt-2 text-sm text-gray-700">Selected: <span className="font-semibold">{rating}</span></div>
            </div>
          </Card>
          <Card>
            <div className="p-6">
              <h4 className="text-lg font-semibold text-emerald-900">Write a Review</h4>
              <form onSubmit={handleReview} className="mt-3 space-y-3">
                <Textarea
                  label="Your Thoughts"
                  required
                  rows={5}
                  placeholder="Tell us what worked well and what we can improve..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
                <button className="rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">Submit</button>
                {supportMsg && <div className="text-sm text-white/90">{supportMsg}</div>}
              </form>
            </div>
          </Card>
          <Card>
            <div className="p-6">
              <h4 className="text-lg font-semibold text-emerald-900">Emergency Contact</h4>
              <p className="mt-2 text-gray-700 text-sm">24/7 helpline for residents & visitors</p>
              <div className="mt-4 rounded-xl bg-emerald-600 text-white px-4 py-3 text-lg font-semibold select-all">
                +91 1800-22-4455
              </div>
              <p className="mt-2 text-xs text-gray-700">For immediate assistance with safety, medical, or property access issues.</p>
            </div>
          </Card>
        </div>
      </Section>

      {/* AUTH SECTION */}
      <Section
        id="auth"
        bg={sectionBg}
        title="Login / Sign up"
        subtitle={USE_MOCK ? "Preview mode is active (no backend). Set BACKEND_BASE_URL to connect Django backend." : "Connected to backend."}
      >
        <Card>
          <div className="grid md:grid-cols-2">
            <div className="p-6 md:p-10 border-b md:border-b-0 md:border-r border-emerald-100/40">
              <div className="flex items-center gap-3">
                <button
                  className={`rounded-full px-4 py-1 text-sm ${authMode === "login" ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700"}`}
                  onClick={() => setAuthMode("login")}
                >Login</button>
                <button
                  className={`rounded-full px-4 py-1 text-sm ${authMode === "signup" ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700"}`}
                  onClick={() => setAuthMode("signup")}
                >Sign up</button>
              </div>

              {authMode === "login" ? (
                <form onSubmit={handleLogin} className="mt-6 space-y-3">
                  <Input label="Email" name="email" type="email" required placeholder="you@example.com" />
                  <Input label="Password" name="password" type="password" required placeholder="••••••••" />
                  <button className="rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">Login</button>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="mt-6 space-y-3">
                  <Input label="Full Name" name="name" required placeholder="Your name" />
                  <Input label="Email" name="email" type="email" required placeholder="you@example.com" />
                  <Input label="Password" name="password" type="password" required placeholder="Create a password" />
                  <button className="rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">Create Account</button>
                </form>
              )}
            </div>
            <div className="p-6 md:p-10">
              <h4 className="text-xl font-semibold text-emerald-900">Account</h4>
              {auth ? (
                <div className="mt-4 text-gray-800 text-sm">
                  <p>You are logged in as <span className="font-semibold">{auth.email}</span>.</p>
                  <button
                    className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    onClick={() => setAuth(null)}
                  >Logout</button>
                </div>
              ) : (
                <p className="mt-2 text-gray-700 text-sm">Log in to book tours faster and view your submissions.</p>
              )}
            </div>
          </div>
        </Card>
      </Section>

      {/* FOOTER */}
      <footer className="bg-emerald-900">
        <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-lg font-bold">Kallada Resorts</div>
            <div className="text-sm text-white/80">Homes that feel like a holiday.</div>
          </div>
          <div className="text-sm text-white/70">
            © {new Date().getFullYear()} Kallada Resorts. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

/*
============================================
DJANGO BACKEND — Minimal, JWT-based Auth + Booking + Reviews
============================================
This is a compact example using Django + Django REST Framework + SimpleJWT. 
Structure shown with key files. Replace `yourproject` with your project name.

# 1) Create project & app
python -m venv venv && source venv/bin/activate  # (or venv\Scripts\activate on Windows)
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers

django-admin startproject yourproject
cd yourproject
python manage.py startapp api

# 2) settings.py (inside yourproject/settings.py)
INSTALLED_APPS = [
    'django.contrib.admin', 'django.contrib.auth', 'django.contrib.contenttypes',
    'django.contrib.sessions', 'django.contrib.messages', 'django.contrib.staticfiles',
    'rest_framework', 'corsheaders', 'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOW_ALL_ORIGINS = True  # tighten for production

REST_FRAMEWORK = {
  'DEFAULT_AUTHENTICATION_CLASSES': (
     'rest_framework_simplejwt.authentication.JWTAuthentication',
  ),
}

# 3) api/models.py
from django.contrib.auth.models import User
from django.db import models

class House(models.Model):
    name = models.CharField(max_length=120)
    location = models.CharField(max_length=120)
    price = models.PositiveIntegerField()
    features = models.TextField(blank=True)  # comma-separated
    image_url = models.URLField(blank=True)

class Booking(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    house = models.ForeignKey(House, on_delete=models.CASCADE)
    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=30)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

class Review(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    rating = models.IntegerField()
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

# 4) api/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import House, Booking, Review

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email")

class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "email", "password")
        extra_kwargs = {"password": {"write_only": True}}
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )
        return user

class HouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = House
        fields = "__all__"

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = "__all__"

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"

# 5) api/views.py
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from .serializers import SignupSerializer, HouseSerializer, BookingSerializer, ReviewSerializer
from .models import House, Booking, Review

class SignupView(generics.CreateAPIView):
    serializer_class = SignupSerializer
    permission_classes = [permissions.AllowAny]

@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def houses(request):
    qs = House.objects.all()
    return Response(HouseSerializer(qs, many=True).data)

class BookingView(generics.CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.AllowAny]  # set to IsAuthenticated to require login

class ReviewView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

# 6) api/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import SignupView, houses, BookingView, ReviewView

urlpatterns = [
    path('auth/signup/', SignupView.as_view()),
    path('auth/login/', TokenObtainPairView.as_view()),
    path('auth/refresh/', TokenRefreshView.as_view()),
    path('houses/', houses),
    path('booking/', BookingView.as_view()),
    path('reviews/', ReviewView.as_view()),
]

# 7) yourproject/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

# 8) Create initial houses (optional)
#   python manage.py makemigrations && python manage.py migrate
#   python manage.py createsuperuser
#   python manage.py shell
#   >>> from api.models import House
#   >>> House.objects.create(name="Palm View Villa", location="Varkala", price=17500000, features="4 BHK, Sea-facing, Pool, Solar + Smart Home", image_url="https://...")
#   (repeat for more)

# 9) Run server
python manage.py runserver 0.0.0.0:8000

# 10) Connect frontend
#   Set BACKEND_BASE_URL in this React file to your Django URL, e.g. http://127.0.0.1:8000
#   Replace mock listings with GET /api/houses/ and wire up.

# Notes:
# - For production, enable proper CORS, HTTPS, and secure JWT handling.
# - You may protect booking/review endpoints with IsAuthenticated and send JWT in Authorization header: Bearer <token>.
*/



export default App
