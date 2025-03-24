
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  LibraryBig, 
  Beaker, 
  BarChart3, 
  MessageSquare, 
  HelpCircle, 
  Settings, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  HelpingHand,
  BookmarkPlus,
  Brain,
  Users,
  ChevronRight
} from 'lucide-react';
import DashboardCard from '../components/dashboard/DashboardCard';
import { toast } from '@/hooks/use-toast';

const StudentDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    document.title = 'Student Dashboard - Aagami';
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    // In a real app, we would handle actual logout here
    // For now, we'll just redirect to the home page
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-serif font-bold bg-gradient-to-r from-aagami-sage to-aagami-blue bg-clip-text text-transparent">
                Aagami
              </span>
            </Link>
            <button 
              className="md:hidden text-gray-500 hover:text-gray-700"
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex-grow py-4 overflow-y-auto">
            <ul className="space-y-1">
              <li>
                <Link 
                  to="/student-dashboard/practice" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary"
                >
                  <BookOpen className="h-5 w-5 mr-3" />
                  Practice
                </Link>
              </li>
              <li>
                <Link 
                  to="/student-dashboard/library" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary"
                >
                  <LibraryBig className="h-5 w-5 mr-3" />
                  Library
                </Link>
              </li>
              <li>
                <Link 
                  to="/student-dashboard/virtual-lab" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary"
                >
                  <Flask className="h-5 w-5 mr-3" />
                  Virtual Lab
                </Link>
              </li>
              <li>
                <Link 
                  to="/student-dashboard/analysis" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary"
                >
                  <BarChart3 className="h-5 w-5 mr-3" />
                  Analysis
                </Link>
              </li>
              <li>
                <Link 
                  to="/student-dashboard/chat" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary"
                >
                  <MessageSquare className="h-5 w-5 mr-3" />
                  Chat Box
                </Link>
              </li>
              <li>
                <Link 
                  to="/student-dashboard/help" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary"
                >
                  <HelpCircle className="h-5 w-5 mr-3" />
                  Help
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="p-4 border-t">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-aagami-sage/20 flex items-center justify-center text-aagami-sage text-sm font-medium">
                RP
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Raj Patel</p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ml-0 md:ml-64`}>
        {/* Top navigation */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between py-4 px-6">
            <div className="flex items-center">
              <button 
                className="md:hidden text-gray-500 hover:text-gray-700 mr-4"
                onClick={toggleSidebar}
                aria-label="Open sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-medium">Student Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/student-dashboard/settings" 
                className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </Link>
              
              <Link 
                to="/student-dashboard/notifications" 
                className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block w-2 h-2 bg-aagami-terracotta rounded-full"></span>
              </Link>
              
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>
        
        {/* Dashboard content */}
        <main className="p-6">
          <div className="glass-card rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-medium mb-1">Welcome back, Raj!</h2>
                <p className="text-gray-600">Track your progress and continue learning</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Your coins:</span>
                <div className="bg-aagami-gold/20 text-aagami-gold px-3 py-1.5 rounded-full font-medium flex items-center">
                  <span className="mr-1">250</span>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14.5 9C14.5 7.61929 13.3807 6.5 12 6.5C10.6193 6.5 9.5 7.61929 9.5 9C9.5 10.1046 10.1716 11.0634 11.1518 11.3799C11.3298 11.4351 11.4932 11.5139 11.6382 11.6139C11.8757 11.7849 12 12.0611 12 12.35V12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <Link 
                  to="/student-dashboard/leaderboard" 
                  className="bg-white border border-gray-200 px-3 py-1.5 rounded-full font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  View Leaderboard
                </Link>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Request a Service"
              description="Request devices, funding for fees, school books, and more"
              icon={<HelpingHand className="h-6 w-6 text-aagami-terracotta" />}
              to="/student-dashboard/request-service"
              color="bg-aagami-terracotta"
            />
            
            <DashboardCard
              title="Learn and Earn"
              description="Become a certified mentor, help juniors, and earn rewards"
              icon={<BookmarkPlus className="h-6 w-6 text-aagami-blue" />}
              to="/student-dashboard/learn-earn"
              color="bg-aagami-blue"
            />
            
            <DashboardCard
              title="Library"
              description="Access categorized learning resources, books, and videos"
              icon={<LibraryBig className="h-6 w-6 text-aagami-sage" />}
              to="/student-dashboard/library"
              color="bg-aagami-sage"
            />
            
            <DashboardCard
              title="Practice"
              description="Take quizzes, solve problems, and earn points"
              icon={<BookOpen className="h-6 w-6 text-aagami-gold" />}
              to="/student-dashboard/practice"
              color="bg-aagami-gold"
            />
            
            <DashboardCard
              title="AI Mentor"
              description="Get personalized guidance and answers to your questions"
              icon={<Brain className="h-6 w-6 text-primary" />}
              to="/student-dashboard/ai-mentor"
              color="bg-primary"
            />
            
            <DashboardCard
              title="Connect with Mentor"
              description="Schedule sessions with experienced mentors"
              icon={<Users className="h-6 w-6 text-aagami-blue" />}
              to="/student-dashboard/connect-mentor"
              color="bg-aagami-blue"
            />
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-xl overflow-hidden md:col-span-2">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Your Learning Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Mathematics</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-aagami-sage h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Science</span>
                      <span>60%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-aagami-blue h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>English</span>
                      <span>90%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-aagami-gold h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Computer Science</span>
                      <span>45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-aagami-terracotta h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link 
                    to="/student-dashboard/analysis" 
                    className="text-primary hover:text-primary/80 font-medium inline-flex items-center"
                  >
                    View detailed analysis
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Upcoming Sessions</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Chemistry Tutoring</h4>
                        <p className="text-sm text-gray-600">with Anita Sharma</p>
                      </div>
                      <span className="bg-aagami-sage/10 text-aagami-sage text-xs px-2 py-1 rounded-full">
                        Today
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      4:00 PM - 5:00 PM
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Math Problem Solving</h4>
                        <p className="text-sm text-gray-600">with Vikram Mehta</p>
                      </div>
                      <span className="bg-aagami-blue/10 text-aagami-blue text-xs px-2 py-1 rounded-full">
                        Tomorrow
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      2:30 PM - 3:30 PM
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link 
                    to="/student-dashboard/sessions" 
                    className="text-primary hover:text-primary/80 font-medium inline-flex items-center"
                  >
                    View all sessions
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
