import { useNavigate } from 'react-router-dom';

const GITHUB_URL = 'https://github.com/charles-gentry/open-sample';

const features = [
  {
    title: 'Four Sampling Algorithms',
    desc: 'Random (Poisson disk), grid, clustered, and W-pattern transect strategies for rigorous spatial sampling.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-6 h-6">
        <circle cx="6" cy="6" r="1.5" /><circle cx="18" cy="6" r="1.5" />
        <circle cx="6" cy="18" r="1.5" /><circle cx="18" cy="18" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
      </svg>
    ),
  },
  {
    title: 'Interactive Map Planning',
    desc: 'Draw study area polygons directly on the map or upload KML files from existing GIS workflows.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z" />
        <path d="M9 4v13M15 7v13" />
      </svg>
    ),
  },
  {
    title: 'Weather Forecasts',
    desc: '14-day weather outlook for your study area so you can plan fieldwork around conditions.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    title: 'Satellite Pass Times',
    desc: 'Sentinel satellite overflight schedule to coordinate ground-truth sampling with remote sensing.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
      </svg>
    ),
  },
  {
    title: 'QR Code Sharing',
    desc: 'Generate compressed URLs and QR codes to instantly share plans with field teams.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M14 14h3v3h-3zM20 14v3h-3M14 20h3M20 20h0" />
      </svg>
    ),
  },
  {
    title: 'Mobile GPS Navigation',
    desc: 'Real-time compass navigation on your phone with distance tracking and point completion.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polygon points="3,11 22,2 13,21 11,13" />
      </svg>
    ),
  },
];

const steps = [
  {
    num: '1',
    title: 'Draw Your Study Area',
    desc: 'Define your sampling boundary by drawing a polygon on the interactive map, or upload an existing KML file.',
  },
  {
    num: '2',
    title: 'Generate Sample Points',
    desc: 'Choose from four algorithms — random, grid, clustered, or W-pattern — and configure point count and spacing.',
  },
  {
    num: '3',
    title: 'Navigate in the Field',
    desc: 'Share your plan via QR code. Open it on a mobile device and follow the GPS compass to each sampling point.',
  },
];

export default function LandingView() {
  const navigate = useNavigate();

  return (
    <div className="overflow-y-auto h-full bg-surface">
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center relative">
        <img src="/favicon.svg" alt="Open Sample logo" className="w-16 h-16 drop-shadow-lg" />
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Open Sample
        </h1>
        <p className="text-base sm:text-lg text-slate-500 max-w-xl leading-relaxed">
          Plan statistically robust sampling locations for environmental field studies,
          then navigate to them using your phone's GPS and compass.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <span className="bg-brand-light text-brand rounded-full px-3 py-1 text-sm font-medium">
            Free &amp; Open Source
          </span>
          <span className="bg-brand-light text-brand rounded-full px-3 py-1 text-sm font-medium">
            No Account Required
          </span>
        </div>
        <button
          onClick={() => navigate('/plan')}
          className="bg-brand text-white rounded-2xl px-8 py-3.5 text-lg font-semibold hover:bg-brand-hover shadow-lg shadow-brand-glow transition-all duration-200 cursor-pointer"
        >
          Start Planning
        </button>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-brand transition-colors text-sm"
        >
          <svg className="w-5 h-5"><use href="/icons.svg#github-icon" /></svg>
          View on GitHub
        </a>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 animate-bounce-slow text-slate-300">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 px-8 bg-white">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight text-center mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((s) => (
            <div key={s.num} className="flex flex-col items-center text-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold text-lg">
                {s.num}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 sm:py-20 px-8 bg-slate-50">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight text-center mb-12">
          Key Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm flex flex-col gap-3"
            >
              <div className="text-brand">{f.icon}</div>
              <h3 className="text-base font-semibold text-slate-900">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Built for Field Researchers */}
      <section className="py-16 px-8 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-6">
            Built for Field Researchers
          </h2>
          <p className="text-slate-500 leading-relaxed mb-8">
            Whether you're an environmental scientist, ecologist, conservation specialist,
            or land management professional, Open Sample gives you publication-ready
            sampling designs and hands-free field navigation — right from your browser.
          </p>
          <button
            onClick={() => navigate('/plan')}
            className="bg-brand text-white rounded-2xl px-8 py-3.5 text-lg font-semibold hover:bg-brand-hover shadow-lg shadow-brand-glow transition-all duration-200 cursor-pointer"
          >
            Start Planning
          </button>
        </div>
      </section>

      {/* Open Source */}
      <section className="py-16 px-8 bg-brand-light">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-6">
            Free, Open Source, Forever
          </h2>
          <p className="text-slate-500 leading-relaxed mb-8">
            Open Sample is MIT licensed and completely free to use. No accounts, no
            paywalls, no data collection. Your sampling plans stay in your browser.
            Contributions are welcome.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-700 hover:text-brand transition-colors font-medium text-sm"
            >
              <svg className="w-5 h-5"><use href="/icons.svg#github-icon" /></svg>
              View Source
            </a>
            <a
              href={`${GITHUB_URL}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-700 hover:text-brand transition-colors font-medium text-sm"
            >
              <svg className="w-5 h-5"><use href="/icons.svg#github-icon" /></svg>
              Report an Issue
            </a>
            <a
              href={`${GITHUB_URL}#contributing`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-700 hover:text-brand transition-colors font-medium text-sm"
            >
              <svg className="w-5 h-5"><use href="/icons.svg#github-icon" /></svg>
              Contribute
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 bg-white border-t border-slate-200 text-center">
        <div className="flex justify-center gap-5 mb-4">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-700 transition-colors">
            <svg className="w-5 h-5"><use href="/icons.svg#github-icon" /></svg>
          </a>
          <a href="https://discord.gg/open-sample" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-700 transition-colors">
            <svg className="w-5 h-5"><use href="/icons.svg#discord-icon" /></svg>
          </a>
          <a href="https://bsky.app/profile/open-sample" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-700 transition-colors">
            <svg className="w-5 h-5"><use href="/icons.svg#bluesky-icon" /></svg>
          </a>
          <a href="https://x.com/open_sample" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-700 transition-colors">
            <svg className="w-5 h-5"><use href="/icons.svg#x-icon" /></svg>
          </a>
        </div>
        <p className="text-sm text-slate-400">
          Open Sample — Open source geosampling for environmental research
        </p>
        <p className="text-xs text-slate-300 mt-2">
          Have a shared link? Open it directly on your mobile device to start navigating.
        </p>
      </footer>
    </div>
  );
}
