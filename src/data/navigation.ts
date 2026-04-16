export type NavLinkItem = {
  type: "link";
  key: string;
  label: string;
  href: string;
};

export type NavChildItem = {
  key: string;
  label: string;
  href: string;
  external?: boolean;
};

export type NavGroupItem = {
  type: "group";
  key: string;
  label: string;
  base: string;
  children: NavChildItem[];
};

export type NavItem = NavLinkItem | NavGroupItem;

export const staticAboutChildren = [
  { key: "aboutOurStory", label: "Our Story", href: "/about/our-story/" },
  { key: "aboutMission", label: "Mission, Vision & Values", href: "/about/mission/" },
  { key: "aboutTeam", label: "Meet the Team", href: "/about/team/" },
];

export const staticProgrammeChildren: NavChildItem[] = [
  {
    key: "progPreschool",
    label: "Pre-school & Elementary School",
    href: "/programmes/preschool-and-elementary/",
  },
  {
    key: "progSenior",
    label: "Senior School",
    href: "/programmes/middle-and-senior/",
  },
  { key: "progKamps", label: "Kiva Kamps", href: "/programmes/kiva-kamps/" },
  {
    key: "progReports",
    label: "Progress Reports",
    href: "https://my.amischool.edu.pk",
    external: true,
  },
];

export const staticKivaSquareChildren = [
  { key: "kSquare2024", label: "2024", href: "/kiva_square/2024/" },
];

export const staticAdmissionChildren = [
  { key: "admProcess", label: "Admission Process", href: "/admission/process/" },
  { key: "admForm", label: "Admission Form", href: "/admission/form/" },
];

export const navItems: NavItem[] = [
  { type: "link", key: "home", label: "Home", href: "/" },
  {
    type: "group",
    key: "aboutUs",
    label: "About Us",
    base: "/about/",
    children: staticAboutChildren,
  },
  {
    type: "group",
    key: "programmes",
    label: "Programmes",
    base: "/programmes/",
    children: staticProgrammeChildren,
  },
  {
    type: "group",
    key: "admissions",
    label: "Admissions",
    base: "/admission/",
    children: staticAdmissionChildren,
  },
  { type: "link", key: "careers", label: "Careers", href: "/careers/" },
  {
    type: "group",
    key: "kivaSquare",
    label: "Kiva Square",
    base: "/kiva_square/",
    children: staticKivaSquareChildren,
  },
  { type: "link", key: "contactUs", label: "Contact Us", href: "/contact/" },
  { type: "link", key: "communityEnrichment", label: "Community Enrichment", href: "/community/" },
];
