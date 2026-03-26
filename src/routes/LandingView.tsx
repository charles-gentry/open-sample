import { useNavigate } from 'react-router-dom';

export default function LandingView() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-8 text-center bg-surface">
      <h1 className="text-4xl font-black text-slate-900 tracking-tight">Open Sample</h1>
      <p className="text-slate-500 max-w-md leading-relaxed">
        Generate robust sampling locations for environmental studies, then
        navigate to them in the field using your phone's GPS and compass.
      </p>
      <button
        onClick={() => navigate('/plan')}
        className="bg-brand text-white rounded-2xl px-8 py-3.5 text-lg font-semibold hover:bg-brand-hover shadow-lg shadow-brand-glow transition-all duration-200"
      >
        Start Planning
      </button>
      <p className="text-sm text-slate-400 mt-4">
        Have a shared link? Open it directly on your mobile device to start
        navigating.
      </p>
    </div>
  );
}
