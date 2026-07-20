import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import HowWeWork from './pages/HowWeWork';
import WhatToExpect from './pages/WhatToExpect';
import About from './pages/About';
import Contact from './pages/Contact';
import Insights from './pages/Insights';
import Article from './pages/Article';
import AdminLogin from './admin/Login';
import AdminDashboard from './admin/Dashboard';
import AdminEditor from './admin/Editor';
import PageEditor from './admin/PageEditor';
import WorkGallery from './admin/WorkGallery';
import RequireAuth from './admin/RequireAuth';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin routes render without the public Navbar/Footer, since the
            writing area is a separate tool rather than a page of the site. */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/new"
          element={
            <RequireAuth>
              <AdminEditor />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/edit/:id"
          element={
            <RequireAuth>
              <AdminEditor />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/pages"
          element={
            <RequireAuth>
              <PageEditor />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/work"
          element={
            <RequireAuth>
              <WorkGallery />
            </RequireAuth>
          }
        />

        {/* Public site */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/how-we-work" element={<HowWeWork />} />
                  <Route path="/what-to-expect" element={<WhatToExpect />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/insights" element={<Insights />} />
                  <Route path="/insights/:slug" element={<Article />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
