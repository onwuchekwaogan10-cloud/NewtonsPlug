/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Terms from "./pages/Terms";
import FAQ from "./pages/FAQ";
import Status from "./pages/Status";
import Complaint from "./pages/Complaint";
import ReferralHandler from "./pages/ReferralHandler";
import { ErrorBoundary } from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="login" element={<Login />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="terms" element={<Terms />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="status" element={<Status />} />
            <Route path="complaint" element={<Complaint />} />
            <Route path="ref/:refId" element={<ReferralHandler />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
