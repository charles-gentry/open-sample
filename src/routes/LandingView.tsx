import { useNavigate } from 'react-router-dom';

export default function LandingView() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-8 text-center">
      <h1 className="text-4xl font-bold text-gray-800">Open Sample</h1>
      <p className="text-gray-600 max-w-md">
        Generate robust sampling locations for environmental studies, then
        navigate to them in the field using your phone's GPS and compass.
      </p>
      <button
        onClick={() => navigate('/plan')}
        className="bg-blue-600 text-white rounded-lg px-6 py-3 text-lg font-medium hover:bg-blue-700"
      >
        Start Planning
      </button>
      <p className="text-sm text-gray-400 mt-4">
        Have a shared link? Open it directly on your mobile device to start
        navigating.
      </p>
    </div>
  );
}
