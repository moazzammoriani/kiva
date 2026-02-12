export type NavLinkItem = {
  type: "link";
  label: string;
  href: string;
};

export type NavGroupItem = {
  type: "group";
  label: string;
  base: string;
  children: {
    label: string;
    href: string;
  }[];
};

export type NavItem = NavLinkItem | NavGroupItem;

export const navItems: NavItem[] = [
  { type: "link", label: "Home", href: "/" },
  {
    type: "group",
    label: "About Us",
    base: "/about/",
    children: [
      { label: "Our Story", href: "/about/our-story/" },
      { label: "Mission, Vision & Values", href: "/about/mission/" },
      { label: "Meet the Team", href: "/about/team/" },
    ],
  },
  {
    type: "group",
    label: "Programmes",
    base: "/programmes/",
    children: [
      {
        label: "Pre-school & Elementary School",
        href: "/programmes/preschool-and-elementary/",
      },
      {
        label: "Senior School",
        href: "/programmes/middle-and-senior/",
      },
      { label: "Kiva Kamps", href: "/programmes/kiva-kamps/" },
    ],
  },
  {
    type: "group",
    label: "Admissions",
    base: "/admission/",
    children: [
      { label: "Admission Process", href: "/admission/process/" },
      { label: "Admission Form", href: "/admission/form/" },
    ],
  },
  { type: "link", label: "Careers", href: "/careers/" },
  {
    type: "group",
    label: "Kiva Square",
    base: "/kiva_square/",
    children: [
      { label: "2024", href: "/kiva_square/2024/" },
      { label: "2026", href: "/kiva_square/2026/" },
    ],
  },
  { type: "link", label: "Contact Us", href: "/contact/" },
  { type: "link", label: "Community Enrichment", href: "/community/" },
];
