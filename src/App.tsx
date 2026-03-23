import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import LandingView from './routes/LandingView';
import PlanView from './routes/PlanView';
import NavigateView from './routes/NavigateView';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingView />} />
        <Route path="/plan" element={<PlanView />} />
        <Route path="/navigate/:data" element={<NavigateView />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}
