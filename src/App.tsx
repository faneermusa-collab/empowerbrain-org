import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import CoursesPage from '@/pages/CoursesPage';
import CourseDetailPage from '@/pages/CourseDetailPage';
import DashboardPage from '@/pages/DashboardPage';
import NetworkPage from '@/pages/NetworkPage';
import AboutPage from '@/pages/AboutPage';
import ProgramsPage from '@/pages/ProgramsPage';
import ContactPage from '@/pages/ContactPage';
import FranchisePage from '@/pages/FranchisePage';
import CalculatorPage from '@/pages/CalculatorPage';
import CertificatesPage from '@/pages/CertificatesPage';
import CountryPortalPage from '@/pages/CountryPortalPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/franchise" element={<FranchisePage />} />
            <Route path="/countries" element={<CountryPortalPage />} />
            <Route path="/countries/:code" element={<CountryPortalPage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:slug" element={<CourseDetailPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/network"
              element={
                <ProtectedRoute>
                  <NetworkPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/certificates"
              element={
                <ProtectedRoute>
                  <CertificatesPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
