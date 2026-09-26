export const MEDICAL_DISCLAIMER =
  "This analysis is for informational purposes only and is not a medical diagnosis, treatment recommendation, or substitute for professional medical advice. Always consult a qualified healthcare provider about your results and health decisions.";

export const DISCLAIMER_VERSION = "v1";

export const REPORT_CATEGORIES = [
  { value: "GENERAL", label: "General" },
  { value: "DIABETES", label: "Diabetes" },
  { value: "CARDIAC", label: "Cardiac" },
  { value: "ONCOLOGY", label: "Oncology" },
  { value: "KIDNEY_LIVER", label: "Kidney / Liver" },
] as const;

export const SERVICE_DEFS = [
  {
    slug: "consult",
    name: "Consult",
    description: "Your personal doctor directory and appointment hub.",
    iconKey: "stethoscope",
    href: "/consult",
    isPlaceholder: false,
  },
  {
    slug: "lab-test",
    name: "Lab Test",
    description: "Book diagnostic panels and home sample collection.",
    iconKey: "flask",
    href: "/services/lab-test",
    isPlaceholder: true,
  },
  {
    slug: "pharmacy",
    name: "Pharmacy",
    description: "Order prescriptions and refills to your door.",
    iconKey: "pill",
    href: "/services/pharmacy",
    isPlaceholder: true,
  },
  {
    slug: "nutrition",
    name: "Nutrition",
    description: "Personalized meal plans guided by your labs.",
    iconKey: "apple",
    href: "/services/nutrition",
    isPlaceholder: true,
  },
  {
    slug: "physio",
    name: "Physio",
    description: "Recovery and mobility programs with specialists.",
    iconKey: "activity",
    href: "/services/physio",
    isPlaceholder: true,
  },
  {
    slug: "checkup",
    name: "Health Checkup",
    description: "Annual and preventive screening packages.",
    iconKey: "heart-pulse",
    href: "/services/checkup",
    isPlaceholder: true,
  },
] as const;

export const HEALTH_LINKS = [
  {
    href: "/health",
    name: "Health Overview",
    description: "A running picture of your health from report history.",
  },
  {
    href: "/reports",
    name: "My Reports",
    description: "Every uploaded report and its AI analysis.",
  },
  {
    href: "/medicines",
    name: "Medicines",
    description: "Log current medicines and prescriptions.",
  },
  {
    href: "/appointments",
    name: "Appointments",
    description: "Upcoming and past visits linked to Consult.",
  },
  {
    href: "/wellness",
    name: "Mental Wellness",
    description: "Mood check-ins, journaling, and gentle resources.",
  },
] as const;
