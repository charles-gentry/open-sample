import { useNavigate } from 'react-router-dom';

export default function LandingView() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-8 text-center bg-retro-bg">
      <h1 className="text-4xl font-bold text-retro-green uppercase tracking-widest">
        Open Sample
      </h1>
      <p className="text-retro-text max-w-md">
        Generate robust sampling locations for environmental studies, then
        navigate to them in the field using your phone&apos;s GPS and compass.
      </p>
      <button
        onClick={() => navigate('/plan')}
        className="border-2 border-retro-green text-retro-green bg-retro-bg px-6 py-3 text-lg font-bold uppercase tracking-wider hover:bg-retro-green hover:text-retro-bg transition-colors"
      >
        Start Planning
      </button>
      <p className="text-sm text-retro-green-dim mt-4">
        Have a shared link? Open it directly on your mobile device to start
        navigating.
      </p>
    </div>
  );
}
