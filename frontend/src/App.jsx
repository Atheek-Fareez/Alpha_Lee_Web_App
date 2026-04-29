import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Force reload for feedback integration
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminProgramManager from './pages/admin/AdminProgramManager';
import AdminExerciseLibrary from './pages/admin/AdminExerciseLibrary';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import UserDashboard from './pages/UserDashboard';
import Locker from './pages/Locker';
import Quiz from './pages/Quiz';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import AdminBlogManager from './pages/admin/AdminBlogManager';
import EditBlog from './pages/admin/EditBlog';
import Consultations from './pages/Consultations';
import MyProfile from './pages/MyProfile';
import AdminPackageManager from './pages/admin/AdminPackageManager';
import AboutPage from './pages/AboutPage';
import ProcessDetail from './pages/ProcessDetail';
import SupportPage from './pages/SupportPage';
import RecruitmentManager from './pages/admin/RecruitmentManager';
import AdminConsultationManager from './pages/admin/AdminConsultationManager';
import AICoach from './pages/AICoach';
import AdminIntro from './pages/AdminIntro';
import AdminFeedbackManager from './pages/admin/AdminFeedbackManager';
import AdminSupportTerminal from './pages/admin/AdminSupportTerminal';
import FeedbackPage from './pages/FeedbackPage';
import FloatingFeedbackButton from './Components/FloatingFeedbackButton';
import { AuthProvider } from './context/AuthContext';
import './App.css';

const ProtectedAdminRoute = ({ children }) => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    if (!token || role !== 'admin') {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        {/* Alpha Admin Management Routes */}
        <Route path="/alpha-admin/programs" element={<ProtectedAdminRoute><AdminProgramManager /></ProtectedAdminRoute>} />
        <Route path="/alpha-admin/blogs" element={<ProtectedAdminRoute><AdminBlogManager /></ProtectedAdminRoute>} />
        <Route path="/alpha-admin/support-hub" element={<ProtectedAdminRoute><AdminSupportTerminal /></ProtectedAdminRoute>} />
        <Route path="/alpha-admin/consultation-packages" element={<ProtectedAdminRoute><AdminConsultationManager /></ProtectedAdminRoute>} />
        <Route path="/alpha-admin/coaching-leads" element={<ProtectedAdminRoute><div>Coaching Leads Management Area</div></ProtectedAdminRoute>} />
        <Route path="/alpha-admin/exercises" element={<ProtectedAdminRoute><AdminExerciseLibrary /></ProtectedAdminRoute>} />
        <Route path="/alpha-admin/blogs/new" element={<ProtectedAdminRoute><EditBlog /></ProtectedAdminRoute>} />
        <Route path="/alpha-admin/blogs/edit/:slug" element={<ProtectedAdminRoute><EditBlog /></ProtectedAdminRoute>} />
        <Route path="/alpha-admin/feedback" element={<ProtectedAdminRoute><AdminFeedbackManager /></ProtectedAdminRoute>} />
        <Route path="/alpha-admin/recruitment" element={<ProtectedAdminRoute><RecruitmentManager /></ProtectedAdminRoute>} />
        
        {/* ADMIN DASHBOARD */}
        <Route path="/alpha-admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
        <Route path="/admin-intro" element={<ProtectedAdminRoute><AdminIntro /></ProtectedAdminRoute>} />

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/programs/:id" element={<ProgramDetail />} />
        <Route path="/consultations" element={<Consultations />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/process" element={<ProcessDetail />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/ai-coach" element={<AICoach />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        
        {/* USER ROUTES */}
        <Route path="/user-dashboard" element={<MyProfile />} />
        <Route path="/dashboard/:id" element={<UserDashboard />} />
        <Route path="/locker" element={<Locker />} />
        <Route path="/my-profile" element={<MyProfile />} />
        
        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <FloatingFeedbackButton />
    </Router>
    </AuthProvider>
  );
}

export default App;
