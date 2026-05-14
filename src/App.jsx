import { Routes, Route } from 'react-router-dom';
import AppTopNav from './components/AppTopNav';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import InvestorTestPage from './pages/InvestorTestPage';
import PrinciplesPage from './pages/PrinciplesPage';
import ReportDashboardPage from './report/ReportDashboardPage';
import { RequireInvestorTest, RequireTradingTools } from './journey/RouteGates';

export default function App() {
  return (
    <>
      <AppTopNav />
      <div className="app-route-shell">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={
              <RequireTradingTools>
                <DashboardPage />
              </RequireTradingTools>
            }
          />
          <Route path="/investor-test" element={<InvestorTestPage />} />
          <Route
            path="/principles"
            element={
              <RequireInvestorTest>
                <PrinciplesPage />
              </RequireInvestorTest>
            }
          />
          <Route
            path="/report"
            element={
              <RequireTradingTools>
                <ReportDashboardPage />
              </RequireTradingTools>
            }
          />
        </Routes>
      </div>
    </>
  );
}
