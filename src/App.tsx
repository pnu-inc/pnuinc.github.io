import { Fragment, useEffect, useRef, useState, type MouseEvent } from 'react';
import { useLanguage } from './i18n';

const professorPhoto = new URL('../assets/professor.png', import.meta.url).href;
const physicalAIPhoto = new URL('../assets/physicalAI.png', import.meta.url).href;
const wirelessAIPhoto = new URL('../assets/wirelessAI.png', import.meta.url).href;
const incLogo = new URL('../assets/inc_logo2.png', import.meta.url).href;
const catGif = new URL('../assets/cat.gif', import.meta.url).href;

const researchImages = [physicalAIPhoto, wirelessAIPhoto];

const topicImages: Record<string, string | string[]> = {
  'vla':      [
    new URL('../assets/card1.gif',   import.meta.url).href,
    new URL('../assets/card1-2.gif', import.meta.url).href,
  ],
  'jetbot':   new URL('../assets/card2.png', import.meta.url).href,
  'wifi-loc': new URL('../assets/card3.png', import.meta.url).href,
  'anomaly':  new URL('../assets/card4.png', import.meta.url).href,
  'lora':     new URL('../assets/card5.png', import.meta.url).href,
  'rl':       new URL('../assets/card6.png', import.meta.url).href,
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  'physical': 'linear-gradient(135deg, #0f3470 0%, #1a52a0 55%, #2d7dd2 100%)',
  'wireless': 'linear-gradient(135deg, #9e2a14 0%, #c44020 60%, #d06818 100%)',
  'rl':       'linear-gradient(135deg, #3b1578 0%, #6d28d9 55%, #8b5cf6 100%)',
  'vision':   'linear-gradient(135deg, #064e48 0%, #0d9488 55%, #14b8a6 100%)',
};

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 1C5.239 1 3 3.239 3 6c0 4 5 9.5 5 9.5S13 10 13 6c0-2.761-2.239-5-5-5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <circle cx="8" cy="6" r="1.8" stroke="currentColor" strokeWidth="1.4"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M5.2 2H3.5a1 1 0 0 0-1 1v.5C2.5 9.956 7.044 14.5 13.5 14.5h.5a1 1 0 0 0 1-1v-1.7a1 1 0 0 0-1-1h-1.5a1 1 0 0 0-.9.56l-.4.8a8.5 8.5 0 0 1-3.86-3.86l.8-.4a1 1 0 0 0 .56-.9V3a1 1 0 0 0-1-1H5.2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M1.5 5.5 8 9.5l6.5-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M8 1.5C8 1.5 5.5 4 5.5 8S8 14.5 8 14.5M8 1.5C8 1.5 10.5 4 10.5 8S8 14.5 8 14.5" stroke="currentColor" strokeWidth="1.4"/>
    <line x1="1.5" y1="8" x2="14.5" y2="8" stroke="currentColor" strokeWidth="1.4"/>
  </svg>
);

const CpuIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="4" y="4" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M5.5 1.5V4M7.5 1.5V4M9.5 1.5V4M5.5 11v2.5M7.5 11v2.5M9.5 11v2.5M1.5 5.5H4M1.5 7.5H4M1.5 9.5H4M11 5.5h2.5M11 7.5h2.5M11 9.5h2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M7.5 1.5L2 4v4C2 10.8 4.5 13.2 7.5 13.5 10.5 13.2 13 10.8 13 8V4L7.5 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M5 7.5l1.8 1.8L10.5 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CoinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M7.5 4v7M5.5 5.8c0-.9.9-1.8 2-1.8s2 .9 2 1.8-.9 1.7-2 1.7-2 .8-2 1.8.9 1.7 2 1.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const RocketIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M7.5 1.5C7.5 1.5 10.5 3 10.5 7L9 8.5H6L4.5 7C4.5 3 7.5 1.5 7.5 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M6 8.5L4.5 11h6L9 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    <circle cx="7.5" cy="6" r="1" stroke="currentColor" strokeWidth="1.1"/>
    <path d="M4.5 8L3 9.5M10.5 8L12 9.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
  </svg>
);


const GraduationCapIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M7.5 2.5L1 6l6.5 3.5L14 6 7.5 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M3.5 7.8v3c0 .9 1.8 1.7 4 1.7s4-.8 4-1.7v-3" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <line x1="14" y1="6" x2="14" y2="9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const BuildingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="3" width="12" height="11" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M5.5 14V9.5h5V14" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <rect x="5" y="5" width="2" height="2" rx="0.4" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="9" y="5" width="2" height="2" rx="0.4" stroke="currentColor" strokeWidth="1.2"/>
    <line x1="2" y1="7.5" x2="14" y2="7.5" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
);

const HamburgerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <line x1="3" y1="5" x2="17" y2="5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="3" y1="15" x2="17" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);


function highlightAuthors(authors: string, highlights: string[]) {
  if (!highlights || highlights.length === 0) return <>{authors}</>;
  return authors.split(',').map((part, i, arr) => {
    const name = part.trim();
    const isHighlighted = highlights.some(h => name === h || name.includes(h) || h.includes(name));
    return (
      <Fragment key={i}>
        {isHighlighted ? <strong className="pub-author-highlight">{name}</strong> : name}
        {i < arr.length - 1 ? ', ' : ''}
      </Fragment>
    );
  });
}

function renderEmphasisText(text: string, emphasisWords: string[]) {
  if (!emphasisWords.length) return <>{text}</>;
  const escaped = emphasisWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'g');
  return (
    <>
      {text.split(regex).map((token, i) =>
        emphasisWords.includes(token)
          ? <span key={i} className="desc-em">{token}</span>
          : token || null
      )}
    </>
  );
}

function renderDynamicHeadline(headline: string, emphasisWords: string[]) {
  const lines = headline.split('\n');
  const escaped = emphasisWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'g');
  return lines.map((line, li) => (
    <Fragment key={li}>
      {line.split(regex).map((token, i) =>
        emphasisWords.includes(token)
          ? <span key={i} className="hero-kw">{token}</span>
          : token || null
      )}
      {li < lines.length - 1 && <br />}
    </Fragment>
  ));
}


const PatentIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M6.5 8l1.8 1.8L11.5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.5 14.5l2.5 2 2.5-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="9" y1="13.5" x2="9" y2="16.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const DocIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="3" y="1.5" width="12" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <line x1="6" y1="6" x2="12" y2="6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <line x1="6" y1="9" x2="12" y2="9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <line x1="6" y1="12" x2="9.5" y2="12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M5.5 2.5H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M8.5 1.5H12.5V5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12.5" y1="1.5" x2="6.5" y2="7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const RecruitPaperIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="5" y="3" width="15" height="19" rx="2" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M9 9h8M9 13h8M9 17h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M17 3v4h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="21" cy="21" r="5" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M19 21h4M21 19v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const RecruitGlobeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M14 4C14 4 10 9 10 14s4 10 4 10M14 4c0 0 4 5 4 10s-4 10-4 10" stroke="currentColor" strokeWidth="1.4"/>
    <line x1="4" y1="14" x2="24" y2="14" stroke="currentColor" strokeWidth="1.4"/>
    <line x1="5.5" y1="9" x2="22.5" y2="9" stroke="currentColor" strokeWidth="1.2" strokeDasharray="1.5 1.5"/>
    <line x1="5.5" y1="19" x2="22.5" y2="19" stroke="currentColor" strokeWidth="1.2" strokeDasharray="1.5 1.5"/>
  </svg>
);

const RecruitLabIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="3" y="17" width="22" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M7 17V6.5M21 17V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="9" y="4" width="10" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7 20h2M11 20h2M15 20h2M19 20h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="22" cy="11" r="3.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M20.8 11h2.4M22 9.8v2.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const RecruitProjectIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="3" y="10" width="22" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M10 10V8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M3 16h22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M12 16v1.5M16 16v1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);


export default function App() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const statsTriggered = useRef(false);
  const { strings, toggleLanguage, language } = useLanguage();
  type Page = 'home' | 'publications' | 'professor' | 'team' | 'contact';
  const PAGES: Page[] = ['home', 'publications', 'professor', 'team', 'contact'];
  const [activePage, setActivePage] = useState<Page>(() => {
    const hash = window.location.hash.replace('#', '') as Page;
    if (PAGES.includes(hash)) return hash;
    const saved = sessionStorage.getItem('activePage') as Page;
    return PAGES.includes(saved) ? saved : 'home';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  type Topic = typeof strings.research.topics[0];
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [recruitHover, setRecruitHover] = useState<'masters' | 'phd' | null>(null);

  useEffect(() => {
    if (!selectedTopic) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedTopic(null); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [selectedTopic]);

  const CAT_ICONS: Record<string, React.ReactNode> = {
    bigtech: <CpuIcon />,
    defense: <ShieldIcon />,
    finance: <CoinIcon />,
    startup: <RocketIcon />,
    academia: <GraduationCapIcon />,
  };

  const CAT_COLORS: [string, string][] = [
    ['#7a1508', '#b53922'],   // bigtech:  레드
    ['#b53922', '#1c1917'],   // defense:  mid(1↔3) — 러스트/테라코타
    ['#1c1917', '#a8a29e'],   // finance:  웜스톤
    ['#14192a', '#6283b3'],   // startup:  mid(3↔5) — 스틸블루/슬레이트
    ['#0c1a3e', '#1d64c8'],   // academia: 딥네이비/파랑
  ];

  const handleCatMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg) translateY(-6px) scale(1.02)`;
    card.style.setProperty('--shimmer-x', `${(x + 0.5) * 100}%`);
    card.style.setProperty('--shimmer-y', `${(y + 0.5) * 100}%`);
  };

  const handleCatMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = '';
  };

  const experienceSection = strings.experienceSection as {
    eyebrow: string;
    heading: string;
    items: Array<{
      id: string;
      tag: string;
      bgWord: string;
      title: string;
      description: string;
      badge: string;
    }>;
  };

  const EXP_COLORS: Record<string, [string, string]> = {
    conference: ['#0e3a7a', '#1d64c8'],   // 딥 네이비 → 브랜드 블루
    overseas:   ['#8DA399', '#8DA399'],   // 미디엄 블루
    project:    ['#7c7cf0', '#8282ca'],   // 딥 버건디 → 브랜드 레드
    tech:       ['#b53922', '#8f4d3b'],   // 브랜드 레드
    paper:      ['#cc5220', '#f8b888'],   // 레드-오렌지 → 브랜드 오렌지
  };

  const EXP_ICONS: Record<string, JSX.Element> = {
    conference: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
        <path d="M7 8h10M7 11.5h6"/>
      </svg>
    ),
    overseas: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"/>
      </svg>
    ),
    project: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="6" height="6" rx="1"/>
        <rect x="9" y="2" width="6" height="6" rx="1"/>
        <rect x="16" y="7" width="6" height="6" rx="1"/>
        <path d="M5 13v2a2 2 0 002 2h10a2 2 0 002-2v-2"/>
        <path d="M12 8v5"/>
      </svg>
    ),
    tech: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
        <line x1="14" y1="4" x2="10" y2="20"/>
      </svg>
    ),
    paper: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
      </svg>
    ),
  };

  const labStats = strings.labStats as {
    eyebrow: string;
    cards: Array<{
      value: number | string;
      suffix: string;
      label: string;
      sub: string;
      icon: string;
    }>;
  };

  const STAT_COLORS: [string, string][] = [
    ['#7a1e0e', '#a82c18'],   // 딥 버건디
    ['#9e2a14', '#c4401e'],   // 딥 레드
    ['#b53922', '#d44e2c'],   // 브랜드 레드
    ['#c84a1e', '#e86530'],   // 레드-오렌지
    ['#d46020', '#f07a38'],   // 오렌지
    ['#d97020', '#ff9d53'],   // 브랜드 오렌지
  ];

  const STAT_ICONS: Record<string, JSX.Element> = {
    calendar: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2.5" y="3.5" width="15" height="14" rx="2"/>
        <path d="M2.5 8h15M7 1.5V5M13 1.5V5"/>
      </svg>
    ),
    people: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7.5" cy="6" r="3"/>
        <path d="M1.5 18a6 6 0 0112 0"/>
        <circle cx="14.5" cy="7" r="2.5"/>
        <path d="M13.5 18h5a4 4 0 00-4-4"/>
      </svg>
    ),
    graduate: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 3L1.5 8l8.5 5 8.5-5L10 3z"/>
        <path d="M5.5 10.5v4c0 1.7 2 3 4.5 3s4.5-1.3 4.5-3v-4"/>
        <path d="M18.5 8v4"/>
      </svg>
    ),
    paper: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2H4.5a1 1 0 00-1 1v14a1 1 0 001 1h11a1 1 0 001-1V7L12 2z"/>
        <path d="M12 2v5h4.5M6.5 11h7M6.5 14h5"/>
      </svg>
    ),
    building: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="9" height="15"/>
        <rect x="11" y="8" width="7" height="10"/>
        <path d="M5 7h3M5 10.5h3M5 14h3M13.5 12h1M13.5 15h1"/>
      </svg>
    ),
    research: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2a8 8 0 100 16A8 8 0 0010 2z"/>
        <path d="M10 6v4l3 3"/>
        <circle cx="10" cy="10" r="1.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
  };

  const publications = strings.publications as {
    eyebrow: string;
    heading: string;
  };

  const pubPage = strings.publicationsPage as {
    eyebrow: string;
    title: string;
    legend: { journal: string; conference: string };
    years: Array<{
      year: string;
      papers: Array<{ title: string; authors: string; venue: string; url: string; highlights?: string[]; type?: 'journal' | 'conference' }>;
    }>;
  };

  const contactPage = strings.contactPage as {
    eyebrow: string;
    title: string;
    mapLabel: string;
    infoTitle: string;
    items: Array<{ label: string; value: string; type: 'building' | 'location' | 'address' | 'phone' | 'email' | 'web' }>;
  };

  const professorStrings = strings.professorPage as {
    eyebrow: string;
    title: string;
    description: string;
    name: string;
    role: string;
    department: string;
    phone: string;
    email: string;
    photoAlt: string;
    contactLabels: {
      department: string;
      phone: string;
      email: string;
    };
    careerHeading: string;
    careers: Array<{
      org: string;
      role: string;
      period: string;
    }>;
    historyHeading: string;
    history: Array<{
      period: string;
      badge: string;
      institution: string;
      role: string;
    }>;
    projectSection: {
      eyebrow: string;
      heading: string;
    };
    projectTableColumns: {
      title: string;
      period: string;
      summary: string;
    };
    projects: Array<{
      title: string;
      period: string;
      summary: string;
    }>;
    outputSection: {
      eyebrow: string;
      heading: string;
      papersTitle: string;
      patentsTitle: string;
    };
    papers: Array<{
      title: string;
      venue: string;
    }>;
    patents: Array<{
      title: string;
      reference: string;
    }>;
  };

  const teamStrings = strings.teamPage as {
    eyebrow: string;
    title: string;
    description: string;
    currentSection: { eyebrow: string; heading: string };
    members: Array<{
      name: string;
      role: string;
      degreeLevel: 'professor' | 'phd' | 'masters' | 'undergrad';
      type?: string;
      email: string;
      description: string;
    }>;
    alumniSection: {
      eyebrow: string;
      heading: string;
      description: string;
      filterAll: string;
      namesHeading: string;
      degreeLabels: { masters: string; phd: string };
      categoryGroups: Array<{ id: string; label: string; items: string[] }>;
      names: Array<{ name: string; degree: 'masters' | 'phd' }>;
    };
  };


  const CARD_LINKS: Record<string, { page: 'home' | 'publications' | 'professor' | 'team' | 'contact'; section?: string }> = {
    people:   { page: 'team', section: 'team-members' },
    graduate: { page: 'team', section: 'team-alumni' },
    building: { page: 'team', section: 'team-alumni' },
    paper:    { page: 'publications' },
    research: { page: 'home', section: 'research' },
  };

  const pushPage = (page: Page) => {
    setActivePage(page);
    sessionStorage.setItem('activePage', page);
    history.pushState({ page }, '', page === 'home' ? location.pathname + location.search : `#${page}`);
  };

  const navigateTo = (page: Page, sectionId?: string) => {
    pushPage(page);
    window.scrollTo({ top: 0 });
    if (sectionId) {
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    }
  };

  const scrollToSection = (sectionId: string, event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    pushPage('home');
    closeMobileMenu();
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  };

  const handleToggleLanguage = () => {
    toggleLanguage();
    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    sessionStorage.setItem('activePage', activePage);
  }, [activePage]);

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const page = e.state?.page as string | undefined;
      const hash = window.location.hash.replace('#', '');
      const target = (PAGES.includes(page as Page) ? page : PAGES.includes(hash as Page) ? hash : 'home') as Page;
      setActivePage(target);
      sessionStorage.setItem('activePage', target);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow || !window.matchMedia('(pointer: fine)').matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;
    let rafId: number;

    const onMouseMove = (e: globalThis.MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      document.body.classList.add('glow-on');
    };
    const onMouseLeave = () => document.body.classList.remove('glow-on');

    const tick = () => {
      glowX += (mouseX - glowX) * 0.12;
      glowY += (mouseY - glowY) * 0.12;
      glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId);
      document.body.classList.remove('glow-on');
    };
  }, []);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    let observer: IntersectionObserver;
    const rafId = requestAnimationFrame(() => {
      const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-animate]'));
      observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-visible');
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.01 }
      );
      targets.forEach((target) => {
        const rect = target.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          target.classList.add('animate-visible');
        } else {
          observer.observe(target);
        }
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
      observer?.disconnect();
    };
  }, [activePage]);

  useEffect(() => {
    statsTriggered.current = false;
  }, [activePage]);

  useEffect(() => {
    const section = statsRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || statsTriggered.current) return;
        statsTriggered.current = true;
        section.querySelectorAll<HTMLElement>('[data-count-target]').forEach((el, i) => {
          const target = parseInt(el.dataset.countTarget ?? '0', 10);
          const duration = 1600;
          const delay = i * 100;
          const start = performance.now() + delay;
          const tick = (now: number) => {
            if (now < start) { requestAnimationFrame(tick); return; }
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = String(Math.round(eased * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [activePage]);

  return (
    <div className="page-shell" ref={pageRef}>
      <div className="cursor-glow" ref={glowRef} aria-hidden="true" />

      <header className="site-header" data-animate>
        <button
          type="button"
          className="brand"
          onClick={() => {
            pushPage('home');
            closeMobileMenu();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <img src={incLogo} alt="INC Lab logo" className="brand-logo" />
          <span className="brand-text">
            <span className="brand-name">INC</span>
            <span className="brand-sub">Intelligence &amp; Networking Communications Lab</span>
          </span>
        </button>
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(o => !o)}
          aria-label="메뉴"
          aria-expanded={mobileMenuOpen}
        >
          <HamburgerIcon />
        </button>
        <div className="header-actions">
          <nav className="site-nav">
            <a
              href="#"
              className={activePage === 'home' ? 'nav-active' : ''}
              onClick={(event) => {
                event.preventDefault();
                pushPage('home');
                closeMobileMenu();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              {(strings.nav as typeof strings.nav & { home: string }).home}
            </a>
            <a href="#research" onClick={(event) => scrollToSection('research', event)}>
              {strings.nav.research}
            </a>
            <a
              href="#publications"
              className={activePage === 'publications' ? 'nav-active' : ''}
              onClick={(event) => {
                event.preventDefault();
                pushPage('publications');
                closeMobileMenu();
                window.scrollTo({ top: 0 });
              }}
            >
              {strings.nav.publications}
            </a>
            <a
              href="#professor"
              className={activePage === 'professor' ? 'nav-active' : ''}
              onClick={(event) => {
                event.preventDefault();
                pushPage('professor');
                closeMobileMenu();
                window.scrollTo({ top: 0 });
              }}
            >
              {strings.nav.professor}
            </a>
            <a
              href="#team"
              className={activePage === 'team' ? 'nav-active' : ''}
              onClick={(event) => {
                event.preventDefault();
                pushPage('team');
                closeMobileMenu();
                window.scrollTo({ top: 0 });
              }}
            >
              {strings.nav.team}
            </a>
            <a
              href="#contact"
              className={activePage === 'contact' ? 'nav-active' : ''}
              onClick={(event) => {
                event.preventDefault();
                pushPage('contact');
                closeMobileMenu();
                window.scrollTo({ top: 0 });
              }}
            >
              {strings.nav.contact}
            </a>
          </nav>
          <div className="lang-toggle-split" role="group" aria-label="언어 선택">
            <button
              type="button"
              className={`lang-option${language === 'ko' ? ' lang-option--active' : ''}`}
              onClick={() => language !== 'ko' && handleToggleLanguage()}
              aria-pressed={language === 'ko'}
            >
              한국어
            </button>
            <span className="lang-divider" aria-hidden="true">/</span>
            <button
              type="button"
              className={`lang-option${language === 'en' ? ' lang-option--active' : ''}`}
              onClick={() => language !== 'en' && handleToggleLanguage()}
              aria-pressed={language === 'en'}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <button type="button" className="mobile-menu-close" onClick={closeMobileMenu} aria-label="닫기">
            <CloseIcon />
          </button>
          <nav className="mobile-nav">
            <a href="#" className={activePage === 'home' ? 'nav-active' : ''} onClick={(e) => { e.preventDefault(); setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); closeMobileMenu(); }}>{(strings.nav as typeof strings.nav & { home: string }).home}</a>
            <a href="#research" onClick={(e) => scrollToSection('research', e)}>{strings.nav.research}</a>
            <a href="#publications" onClick={(e) => { e.preventDefault(); setActivePage('publications'); window.scrollTo({ top: 0, behavior: 'smooth' }); closeMobileMenu(); }}>{strings.nav.publications}</a>
            <a href="#professor" onClick={(e) => { e.preventDefault(); setActivePage('professor'); window.scrollTo({ top: 0, behavior: 'smooth' }); closeMobileMenu(); }}>{strings.nav.professor}</a>
            <a href="#team" onClick={(e) => { e.preventDefault(); setActivePage('team'); window.scrollTo({ top: 0, behavior: 'smooth' }); closeMobileMenu(); }}>{strings.nav.team}</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); setActivePage('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); closeMobileMenu(); }}>{strings.nav.contact}</a>
          </nav>
          <div className="lang-toggle-split" role="group" aria-label="언어 선택">
            <button type="button" className={`lang-option${language === 'ko' ? ' lang-option--active' : ''}`} onClick={() => language !== 'ko' && handleToggleLanguage()} aria-pressed={language === 'ko'}>한국어</button>
            <span className="lang-divider" aria-hidden="true">/</span>
            <button type="button" className={`lang-option${language === 'en' ? ' lang-option--active' : ''}`} onClick={() => language !== 'en' && handleToggleLanguage()} aria-pressed={language === 'en'}>EN</button>
          </div>
        </div>
      )}

      <main>
        {activePage === 'home' ? (
          <>
            <section className="hero" data-animate>
              <div className="hero-meta-row">
                <p className="eyebrow">{strings.hero.eyebrow}</p>
                <div className="hero-keyword-row" aria-hidden="true">
                  {strings.hero.highlights.map((highlight, index) => (
                    <span key={index} className="hero-keyword">{highlight}</span>
                  ))}
                </div>
              </div>

              <h1>
                {renderDynamicHeadline(
                  strings.hero.headline,
                  (strings.hero as typeof strings.hero & { headlineEmphasis: string[] }).headlineEmphasis ?? []
                )}
              </h1>

              <hr className="hero-rule" />

              <div className="hero-footer-row">
                <p className="hero-description">
                  {renderEmphasisText(
                    strings.hero.description,
                    (strings.hero as typeof strings.hero & { descriptionEmphasis: string[] }).descriptionEmphasis ?? []
                  )}
                </p>
              </div>

              <div className="recruit-banner">
                <div className="recruit-banner-glow" aria-hidden="true" />
                <img src={catGif} className="banner-cat" alt="" aria-hidden="true" />

                {/* Left: headline + position tags + CTA */}
                <div className="recruit-left">
                  <span className="recruit-badge">
                    <span className="recruit-pulse" />
                    지금 모집 중
                  </span>
                  <p className="recruit-headline">
                    함께 연구하고<br />
                    성장할 팀원을 찾습니다
                  </p>
                  <div className="recruit-positions">
                    <span
                      className={`recruit-position-tag${!recruitHover ? ' recruit-position-tag--highlight' : ''}`}
                      onClick={() => setRecruitHover(null)}
                    >
                      학부연구생
                    </span>
                    <span
                      className={`recruit-position-tag${recruitHover === 'masters' ? ' recruit-position-tag--highlight' : ''}`}
                      onClick={() => setRecruitHover('masters')}
                    >
                      석사과정
                    </span>
                    <span
                      className={`recruit-position-tag${recruitHover === 'phd' ? ' recruit-position-tag--highlight' : ''}`}
                      onClick={() => setRecruitHover('phd')}
                    >
                      박사과정
                    </span>
                  </div>
                  <a
                    href={recruitHover ? 'https://go.pusan.ac.kr/graduate/main/grad_main.asp' : 'https://arise-ai.pusan.ac.kr/admission-v3-dark.html'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="recruit-cta"
                  >
                    {recruitHover ? '석박사 입학과정 자세히 보기 →' : '학석사 연계과정 자세히 보기 →'}
                  </a>
                </div>

                {/* Right: perks */}
                <div className="recruit-right">
                  <div className="recruit-perks">
                    <div className="recruit-perk-item">
                      <span className="recruit-perk-icon"><RecruitPaperIcon /></span>
                      <div className="recruit-perk-text">
                        <span className="recruit-perk-title">SCI 논문 게재 기회</span>
                        <span className="recruit-perk-desc">연구 성과에 따라 국제 저널 공동저자로 참여</span>
                      </div>
                    </div>
                    <div className="recruit-perk-item">
                      <span className="recruit-perk-icon"><RecruitGlobeIcon /></span>
                      <div className="recruit-perk-text">
                        <span className="recruit-perk-title">해외 학회 · 연구 연수</span>
                        <span className="recruit-perk-desc">국내외 학회 참석 및 해외 연구기관 방문 지원</span>
                      </div>
                    </div>
                    <div className="recruit-perk-item">
                      <span className="recruit-perk-icon"><RecruitLabIcon /></span>
                      <div className="recruit-perk-text">
                        <span className="recruit-perk-title">GPU 서버 · 최신 개발 환경</span>
                        <span className="recruit-perk-desc">고성능 GPU 클러스터 및 최신 연구 장비 지원</span>
                      </div>
                    </div>
                    <div className="recruit-perk-item">
                      <span className="recruit-perk-icon"><RecruitProjectIcon /></span>
                      <div className="recruit-perk-text">
                        <span className="recruit-perk-title">정부 · 기업 과제 참여</span>
                        <span className="recruit-perk-desc">국가 R&amp;D 및 기업 협력 프로젝트 실전 경험</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="lab-stats-section" ref={statsRef}>
              <p className="lab-stats-eyebrow">{labStats.eyebrow}</p>
              <div className="lab-stats-cards">
                {labStats.cards.map((card, idx) => {
                  const [c1, c2] = STAT_COLORS[idx % STAT_COLORS.length];
                  const isNumeric = typeof card.value === 'number';
                  const cardLink = CARD_LINKS[card.icon];
                  return (
                    <div
                      key={idx}
                      className={`stat-card${cardLink ? ' stat-card--link' : ''}`}
                      style={{ '--sc1': c1, '--sc2': c2 } as React.CSSProperties}
                      onClick={cardLink ? () => navigateTo(cardLink.page, cardLink.section) : undefined}
                      role={cardLink ? 'button' : undefined}
                      tabIndex={cardLink ? 0 : undefined}
                      onKeyDown={cardLink ? (e) => { if (e.key === 'Enter') navigateTo(cardLink.page, cardLink.section); } : undefined}
                    >
                      <div className="stat-card-icon">
                        {STAT_ICONS[card.icon]}
                      </div>
                      <div className="stat-card-body">
                        <div className="stat-card-value-row">
                          {isNumeric ? (
                            <span className="stat-card-value" data-count-target={card.value}>0</span>
                          ) : (
                            <span className="stat-card-value stat-card-value--text">{card.value}</span>
                          )}
                          {card.suffix && <span className="stat-card-suffix">{card.suffix}</span>}
                        </div>
                        <p className="stat-card-label">{card.label}</p>
                        <p className="stat-card-sub">{card.sub}</p>
                      </div>
                      {cardLink && <span className="stat-card-arrow" aria-hidden="true">→</span>}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="experience-section" data-animate>
              <div className="section-header">
                <div>
                  <p className="eyebrow">{experienceSection.eyebrow}</p>
                  <h2>{experienceSection.heading}</h2>
                </div>
              </div>
              <div className="exp-bento">
                {experienceSection.items.map((item) => {
                  const [c1, c2] = EXP_COLORS[item.id] ?? ['#b53922', '#ff9d53'];
                  const isPaper = item.id === 'paper';
                  return (
                    <div
                      key={item.id}
                      className={`exp-card exp-card--${item.id}`}
                      style={{ '--ec1': c1, '--ec2': c2 } as React.CSSProperties}
                      data-id={item.id}
                    >
                      <span className="exp-card-bg" aria-hidden="true">{item.bgWord}</span>
                      {isPaper ? (
                        <>
                          <div className="exp-card-icon-wrap">
                            {EXP_ICONS[item.id]}
                          </div>
                          <div className="exp-card-content exp-card-content--row">
                            <div className="exp-card-text">
                              <span className="exp-card-tag">{item.tag}</span>
                              <h3 className="exp-card-title">{item.title}</h3>
                              <p className="exp-card-desc">{item.description}</p>
                            </div>
                            <span className="exp-card-badge">{item.badge}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="exp-card-top">
                            <span className="exp-card-tag">{item.tag}</span>
                            <span className="exp-card-badge">{item.badge}</span>
                          </div>
                          <div className="exp-card-icon-wrap">
                            {EXP_ICONS[item.id]}
                          </div>
                          <div className="exp-card-content">
                            <h3 className="exp-card-title">{item.title}</h3>
                            <p className="exp-card-desc">{item.description}</p>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="research" id="research" data-animate>
              <div className="section-header">
                <div>
                  <p className="eyebrow">{strings.research.eyebrow}</p>
                  <h2>{strings.research.heading}</h2>
                </div>
              </div>

              <div className="research-grid">
                {strings.research.areas.map((area, index) => (
                  <article key={area.title} className="research-card">
                    <div className="research-card-illustration">
                      <img src={researchImages[index]} alt={area.title} />
                    </div>
                    <h3>{area.title}</h3>
                    <p>{area.description}</p>
                  </article>
                ))}
              </div>

              <div className="topic-grid" data-animate>
                <p className="topic-grid-heading">{strings.research.topicsHeading}</p>
                <div className="topic-cards">
                  {strings.research.topics.map((topic) => (
                    <article
                      key={topic.id}
                      className="topic-card"
                      onClick={() => setSelectedTopic(topic)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setSelectedTopic(topic)}
                    >
                      <div className="topic-card-media" style={{ background: CATEGORY_GRADIENTS[topic.categoryType] }}>
                        <span className="topic-badge">{topic.category}</span>
                        <div className="topic-card-hover">
                          <span className="topic-more-btn">
                            {strings.research.topicsMore}
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M3 7h8M7.5 4l3.5 3-3.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        </div>
                      </div>
                      <div className="topic-card-body">
                        <h4 className="topic-card-title">{topic.title}</h4>
                        <p className="topic-card-desc">{topic.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="publications" id="publications" data-animate>
              <div className="section-header">
                <div>
                  <p className="eyebrow">{publications.eyebrow}</p>
                  <h2>{publications.heading}</h2>
                </div>
              </div>

              <ul className="publication-list">
                {pubPage.years
                  .flatMap(y => y.papers.map(p => ({ ...p, year: y.year })))
                  .slice(0, 5)
                  .map((paper, index) => (
                    <li key={index} className="publication-item">
                      {highlightAuthors(paper.authors, paper.highlights ?? [])}, {paper.title}, <em>{paper.venue}</em>, {paper.year}
                    </li>
                  ))}
              </ul>
            </section>
          </>
        ) : activePage === 'publications' ? (
          <section className="publications-page" data-animate>
            <div className="member-hero">
              <p className="eyebrow">{pubPage.eyebrow}</p>
              <h1>{pubPage.title}</h1>
            </div>
            <div className="pub-legend">
              <div className="pub-legend-item">
                <span className="pub-legend-dot pub-legend-dot--journal" />
                <span>{pubPage.legend.journal}</span>
              </div>
              <div className="pub-legend-item">
                <span className="pub-legend-dot pub-legend-dot--conference" />
                <span>{pubPage.legend.conference}</span>
              </div>
            </div>
            <div className="pub-years">
              {pubPage.years.map((yearGroup) => (
                <div key={yearGroup.year} className="pub-year-card">
                  <div className="pub-year-header">
                    <span className="pub-year-badge">{yearGroup.year}</span>
                    <span className="pub-year-count">
                      {yearGroup.papers.length}{language === 'ko' ? '편' : ' papers'}
                    </span>
                  </div>
                  <ul className="pub-paper-list">
                    {yearGroup.papers.map((paper, i) => (
                      <li key={i} className="pub-paper-item">
                        <span className={`pub-paper-icon pub-paper-icon--${paper.type ?? 'journal'}`}><DocIcon /></span>
                        <div className="pub-paper-body">
                          <p className="pub-paper-title">{paper.title}</p>
                          <p className="pub-paper-meta">
                            {highlightAuthors(paper.authors, paper.highlights ?? [])} · <span className={`pub-paper-venue${paper.type === 'conference' ? ' pub-paper-venue--conference' : ''}`}>{paper.venue}</span>
                          </p>
                        </div>
                        <a
                          className={`pub-link${paper.url ? '' : ' pub-link--empty'}`}
                          href={paper.url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={paper.title}
                        >
                          <ExternalLinkIcon />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ) : activePage === 'contact' ? (
          <section className="contact-page" data-animate>
            <div className="member-hero">
              <p className="eyebrow">{contactPage.eyebrow}</p>
              <h1>{contactPage.title}</h1>
            </div>
            <div className="contact-layout">
              <div className="contact-map-wrap">
                <iframe
                  title={contactPage.mapLabel}
                  src="https://maps.google.com/maps?q=부산대학교+IT관+부산광역시+금정구&t=m&z=17&ie=UTF8&iwloc=B&output=embed"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="contact-card">
                <p className="contact-card-title">{contactPage.infoTitle}</p>
                {contactPage.items.map((item) => {
                  const icon =
                    item.type === 'phone' ? <PhoneIcon /> :
                    item.type === 'email' ? <MailIcon /> :
                    item.type === 'web' ? <GlobeIcon /> :
                    item.type === 'building' ? <BuildingIcon /> :
                    <MapPinIcon />;
                  const content =
                    item.type === 'email' ? (
                      <a href={`mailto:${item.value}`} className="contact-item-value">{item.value}</a>
                    ) : item.type === 'web' ? (
                      <a href={item.value} target="_blank" rel="noopener noreferrer" className="contact-item-value">{item.value}</a>
                    ) : item.type === 'phone' ? (
                      <a href={`tel:${item.value}`} className="contact-item-value">{item.value}</a>
                    ) : (
                      <p className="contact-item-value">{item.value}</p>
                    );
                  return (
                    <div key={item.label} className="contact-item">
                      <div className="contact-item-icon">{icon}</div>
                      <div className="contact-item-body">
                        <p className="contact-item-label">{item.label}</p>
                        {content}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ) : activePage === 'professor' ? (
          <section className="professor-page" id="professor" data-animate>
            <div className="member-hero">
              <p className="eyebrow">{professorStrings.eyebrow}</p>
              <h1>{professorStrings.title}</h1>
              <p className="section-description">{professorStrings.description}</p>
            </div>

            <div className="professor-layout">
              <img
                className="professor-photo"
                src={professorPhoto}
                alt={professorStrings.photoAlt}
              />
              <div className="professor-info">
                <div className="professor-header">
                  <h2>{professorStrings.name}</h2>
                  <p className="professor-role">{professorStrings.role}</p>
                </div>
                <div className="professor-contact">
                  <div className="prof-contact-left">
                    <div className="contact-item-compact">
                      <p className="contact-label">{professorStrings.contactLabels.department}</p>
                      <p className="contact-value">{professorStrings.department}</p>
                    </div>
                    <div className="contact-item-compact">
                      <p className="contact-label">{professorStrings.contactLabels.phone}</p>
                      <a href={`tel:${professorStrings.phone}`} className="contact-value contact-link">{professorStrings.phone}</a>
                    </div>
                    <div className="contact-item-compact">
                      <p className="contact-label">{professorStrings.contactLabels.email}</p>
                      <a href={`mailto:${professorStrings.email}`} className="contact-value contact-link">{professorStrings.email}</a>
                    </div>
                  </div>
                  <div className="prof-careers">
                    <p className="contact-label">{professorStrings.careerHeading}</p>
                    <ul className="career-list">
                      {professorStrings.careers.map((c, idx) => (
                        <li key={idx} className="career-item">
                          <span className="career-org">{c.org}</span>
                          <div className="career-meta">
                            <span className="career-role">{c.role}</span>
                            <span className="career-dot" aria-hidden="true" />
                            <span className="career-period">{c.period}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="professor-history">
              <h3>{professorStrings.historyHeading}</h3>
              <div className="timeline">
                <div className="timeline-periods">
                  {professorStrings.history.map((item, idx) => (
                    <span key={idx} className="timeline-period">{item.period}</span>
                  ))}
                </div>
                <div className="timeline-track">
                  {professorStrings.history.map((_, idx) => (
                    <div key={idx} className="timeline-dot" />
                  ))}
                </div>
                <div className="timeline-descriptions">
                  {professorStrings.history.map((item, idx) => (
                    <div key={idx} className="timeline-desc-item">
                      <span className="timeline-institution">{item.institution}</span>
                      <span className="timeline-role">{item.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <section className="professor-projects" data-animate>
              <div className="section-header">
                <div>
                  <p className="eyebrow">{professorStrings.projectSection.eyebrow}</p>
                  <h2>{professorStrings.projectSection.heading}</h2>
                </div>
              </div>
              <div className="project-cards">
                {professorStrings.projects.map((project, idx) => (
                  <div key={project.title} className="project-card">
                    <div className="project-card-num">{String(idx + 1).padStart(2, '0')}</div>
                    <div className="project-card-body">
                      <h4 className="project-card-title">{project.title}</h4>
                      <p className="project-card-summary">{project.summary}</p>
                    </div>
                    <div className="project-card-period">{project.period}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="professor-outputs" data-animate>
              <div className="section-header">
                <div>
                  <p className="eyebrow">{professorStrings.outputSection.eyebrow}</p>
                  <h2>{professorStrings.outputSection.heading}</h2>
                </div>
              </div>
              <div className="output-groups">
                <div className="output-group">
                  <h3 className="output-group-title">{professorStrings.outputSection.papersTitle}</h3>
                  <div className="output-table">
                    {professorStrings.papers.map((item, idx) => (
                      <div key={idx} className="output-row">
                        <span className="output-icon output-icon--paper"><DocIcon /></span>
                        <div className="output-body">
                          <p className="output-title">{item.title}</p>
                          <p className="output-meta">{item.venue}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="output-group">
                  <h3 className="output-group-title">{professorStrings.outputSection.patentsTitle}</h3>
                  <div className="output-table">
                    {professorStrings.patents.map((item, idx) => (
                      <div key={idx} className="output-row">
                        <span className="output-icon output-icon--patent"><PatentIcon /></span>
                        <div className="output-body">
                          <p className="output-title">{item.title}</p>
                          <p className="output-meta">{item.reference}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </section>
        ) : (
          <section className="team-page" id="team" data-animate>
            <div className="member-hero">
              <p className="eyebrow">{teamStrings.eyebrow}</p>
              <h1>{teamStrings.title}</h1>
              <p className="section-description">{teamStrings.description}</p>
            </div>
            <div className="team-list" id="team-members">
              {teamStrings.members.map((member) => (
                <div key={member.name} className={`team-member${member.type ? ` team-member--${member.type}` : ''}`}>
                  <h2>{member.name}</h2>
                  <div className="member-meta">
                    <span className={`member-role${member.type ? ` member-role--${member.type}` : ''}`}>{member.role}</span>
                    <span className="member-description-inline">{member.description}</span>
                  </div>
                  {member.degreeLevel !== 'undergrad' && <p className="member-email">{member.email}</p>}
                </div>
              ))}
            </div>

            <section className="alumni-section" id="team-alumni" data-animate>
              <div className="section-header">
                <div>
                  <p className="eyebrow">{teamStrings.alumniSection.eyebrow}</p>
                  <h2>{teamStrings.alumniSection.heading}</h2>
                </div>
              </div>
              <p className="section-description">{teamStrings.alumniSection.description}</p>
              <div className="cat-cards-grid">
                {teamStrings.alumniSection.categoryGroups.map((group, idx) => {
                  const [c1, c2] = CAT_COLORS[idx % CAT_COLORS.length];
                  return (
                    <div
                      key={group.id}
                      className="cat-card"
                      style={{ '--c1': c1, '--c2': c2 } as React.CSSProperties}
                      onMouseMove={handleCatMouseMove}
                      onMouseLeave={handleCatMouseLeave}
                    >
                      <div className="cat-card-header">
                        <h3 className="cat-card-title">{group.label}</h3>
                        <span className="cat-card-icon-badge">{CAT_ICONS[group.id]}</span>
                      </div>
                      <div className="cat-card-divider" />
                      <div className="cat-card-companies">
                        {group.items.map(name => (
                          <span key={name} className="cat-company-tag">{name}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="alumni-names-section">
                <p className="alumni-names-heading">{teamStrings.alumniSection.namesHeading}</p>
                <div className="alumni-name-wall">
                  {teamStrings.alumniSection.names.map((item, idx) => (
                    <div key={idx} className="alumni-name-card">
                      <span className={`alumni-degree alumni-degree--${item.degree}`}>
                        {teamStrings.alumniSection.degreeLabels[item.degree]}
                      </span>
                      <span className="alumni-name-text">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </section>
        )}
      </main>

      {selectedTopic && (() => {
        const modalImgRaw = topicImages[selectedTopic.id];
        const modalImgs = Array.isArray(modalImgRaw) ? modalImgRaw : modalImgRaw ? [modalImgRaw] : [];
        const hasImage = modalImgs.length > 0;
        const modalBg = CATEGORY_GRADIENTS[selectedTopic.categoryType];
        return (
          <div className="topic-modal-backdrop" onClick={() => setSelectedTopic(null)}>
            <div className={`topic-modal${hasImage ? ' has-image' : ''}${modalImgs.length > 1 ? ' has-multi-image' : ''}`} onClick={(e) => e.stopPropagation()}>
              {/* 얇은 컬러 헤더 */}
              <div className="topic-modal-header" style={{ background: modalBg }}>
                <span className="topic-badge">{selectedTopic.category}</span>
                <button className="topic-modal-close" onClick={() => setSelectedTopic(null)} aria-label="닫기">
                  <CloseIcon />
                </button>
              </div>
              {/* 본문: 데스크톱=좌우, 모바일=상하 */}
              <div className="topic-modal-content">
                {hasImage && (
                  <div className="topic-modal-img-side">
                    {modalImgs.map((src, i) => (
                      <img key={i} src={src} alt={`${selectedTopic.title} ${i + 1}`} className="topic-modal-img" />
                    ))}
                  </div>
                )}
                <div className="topic-modal-body">
                  <h3 className="topic-modal-title">{selectedTopic.title}</h3>
                  <p className="topic-modal-detail">
                    {selectedTopic.detail.split('\n').map((line, i, arr) => {
                      const isHeading = line.startsWith('#');
                      return (
                        <Fragment key={i}>
                          {isHeading
                            ? <strong className={`topic-detail-heading topic-detail-heading--${selectedTopic.categoryType}`}>{line.slice(1)}</strong>
                            : line}
                          {i < arr.length - 1 && !isHeading && '\n'}
                        </Fragment>
                      );
                    })}
                  </p>
                  <div className="topic-modal-keywords">
                    {selectedTopic.keywords.map((kw) => (
                      <span key={kw} className={`topic-keyword topic-keyword--${selectedTopic.categoryType}`}>{kw}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <footer className="site-footer" data-animate>
        <div className="footer-body">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <img src={incLogo} alt="INC Lab" className="footer-logo" />
              <div>
                <span className="footer-brand-name">{strings.footer.brand}</span>
                <span className="footer-brand-sub">{strings.footer.brandSub}</span>
              </div>
            </div>
            <p className="footer-tagline">{strings.footer.tagline}</p>
          </div>

          <div className="footer-nav-col">
            <p className="footer-col-heading">{strings.footer.navHeading}</p>
            <ul className="footer-nav-list">
              {strings.footer.navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={`#${link.page}`}
                    className="footer-nav-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setActivePage(link.page as 'home' | 'publications' | 'professor' | 'team' | 'contact');
                      if (link.section) {
                        setTimeout(() => document.getElementById(link.section!)?.scrollIntoView({ behavior: 'smooth' }), 120);
                      } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-contact-col">
            <p className="footer-col-heading">{strings.footer.contactHeading}</p>
            <ul className="footer-contact-list">
              <li>
                <MapPinIcon />
                <span>{strings.footer.address}</span>
              </li>
              <li>
                <PhoneIcon />
                <a href={`tel:${strings.footer.phone}`}>{strings.footer.phone}</a>
              </li>
              <li>
                <MailIcon />
                <a href={`mailto:${strings.footer.email}`}>{strings.footer.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{strings.footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
}
