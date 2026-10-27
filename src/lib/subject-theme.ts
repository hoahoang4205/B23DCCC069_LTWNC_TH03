export interface SubjectTheme {
  slug: string;
  badgeClass: string;
  borderClass: string;
  gradientClass: string;
  iconBgClass: string;
  accentText: string;
  pillColor: string;
  accentBg: string;
}

export const SUBJECT_THEMES: Record<string, SubjectTheme> = {
  ltwnc: {
    slug: 'ltwnc',
    badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200',
    borderClass: 'hover:border-blue-400 hover:shadow-md hover:shadow-blue-100/50',
    gradientClass: 'from-blue-600 via-indigo-600 to-blue-700',
    iconBgClass: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-200',
    accentText: 'text-blue-600',
    pillColor: 'blue',
    accentBg: 'bg-blue-50/70',
  },
  csdl: {
    slug: 'csdl',
    badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    borderClass: 'hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-100/50',
    gradientClass: 'from-emerald-600 via-teal-600 to-emerald-700',
    iconBgClass: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-200',
    accentText: 'text-emerald-600',
    pillColor: 'emerald',
    accentBg: 'bg-emerald-50/70',
  },
  mmt: {
    slug: 'mmt',
    badgeClass: 'bg-amber-50 text-amber-800 border border-amber-200',
    borderClass: 'hover:border-amber-400 hover:shadow-md hover:shadow-amber-100/50',
    gradientClass: 'from-amber-500 via-orange-500 to-amber-600',
    iconBgClass: 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md shadow-amber-200',
    accentText: 'text-amber-600',
    pillColor: 'amber',
    accentBg: 'bg-amber-50/70',
  },
  ai: {
    slug: 'ai',
    badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200',
    borderClass: 'hover:border-purple-400 hover:shadow-md hover:shadow-purple-100/50',
    gradientClass: 'from-purple-600 via-fuchsia-600 to-indigo-700',
    iconBgClass: 'bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-md shadow-purple-200',
    accentText: 'text-purple-600',
    pillColor: 'purple',
    accentBg: 'bg-purple-50/70',
  },
};

export function getSubjectTheme(slug: string): SubjectTheme {
  return (
    SUBJECT_THEMES[slug.toLowerCase()] || {
      slug,
      badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200',
      borderClass: 'hover:border-slate-400 hover:shadow-md hover:shadow-slate-100/50',
      gradientClass: 'from-slate-600 via-slate-700 to-slate-800',
      iconBgClass: 'bg-gradient-to-br from-slate-500 to-slate-700 text-white shadow-md shadow-slate-200',
      accentText: 'text-slate-700',
      pillColor: 'default',
      accentBg: 'bg-slate-50',
    }
  );
}
