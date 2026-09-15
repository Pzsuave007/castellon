import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API_BASE = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Attach token from localStorage as fallback if cookie is blocked
api.interceptors.request.use((config) => {
  const t = localStorage.getItem("castellon_token");
  if (t && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

export function formatApiError(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export const PHONE = "509-655-6480";
export const PHONE_HREF = "tel:+15096556480";
export const COMPANY = "Castellon Septic Services";

export const SERVICES = [
  {
    key: "residential",
    name: "Residential Septic Pumping",
    short: "Residential",
    desc: "Septic tank pumping for rural homes, manufactured homes, and farms outside city sewer.",
    color: "#3B82F6", // blue
  },
  {
    key: "commercial",
    name: "Commercial Septic Pumping",
    short: "Commercial",
    desc: "Scheduled reliable service for apartments, hotels, warehouses, and industrial sites.",
    color: "#94A3B8", // steel
  },
  {
    key: "grease_trap",
    name: "Restaurant Grease Trap Cleaning",
    short: "Grease Trap",
    desc: "Stay compliant. Scheduled quarterly maintenance contracts for restaurants & commercial kitchens.",
    color: "#FFB800", // amber
  },
  {
    key: "emergency",
    name: "Emergency Pump-Out Service",
    short: "Emergency",
    desc: "Septic backup? We dispatch fast. Same-day emergency response across the region.",
    color: "#EF4444", // red
  },
];

export const SERVICE_BY_KEY = SERVICES.reduce((acc, s) => {
  acc[s.key] = s;
  return acc;
}, {});
