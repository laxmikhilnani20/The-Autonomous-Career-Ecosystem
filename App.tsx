import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Garden from './components/Garden';
import Milestone from './components/Milestone';
import Insights from './components/Insights';
import Onboarding from './components/Onboarding';
import Roadmap from './components/Roadmap';
import Auth from './components/Auth';
import ActionModal from './components/ActionModal';
import { Insight, InsightStatus, UploadType, User } from './types';
import { analyzeUploadAndGenerateInsight, generateActionPlan, generateInitialRoadmap, analyzeResumeMetrics } from './services/auraService';
import { authService } from './services/authService';
import { LayoutList, Activity } from 'lucide-react';

const App: React.FC = () => {
  // Application State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Dashboard State
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'roadmap'>('feed');
  
  // Modal State (Lifted Up)
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);

  // Initialize: Always show login screen (no auto-login)
  useEffect(() => {
    console.log('🚀 App initialized - login required');
    setIsLoading(false);
  }, []);

  // Helper to sync state and DB
  const updateInsights = async (newInsights: Insight[]) => {
    setInsights(newInsights);
    await authService.saveInsights(newInsights);
  };

  // Auth Handlers
  const handleLogin = async (u: string, p: string) => {
    const user = await authService.login(u, p);
    if (user) {
      setCurrentUser(user);
      const savedInsights = await authService.getUserInsights();
      setInsights(savedInsights);
      return true;
    }
    return false;
  };

  const handleSignup = async (u: string, p: string) => {
    const user = await authService.signup(u, p);
    if (user) {
      setCurrentUser(user);
      setInsights([]); // New user has empty feed
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setInsights([]);
    setSelectedInsight(null);
  };

  const updateUserData = async (updates: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    await authService.updateProgress(
      updatedUser.growthLevel,
      updatedUser.readiness,
      updatedUser.hasOnboarded,
      updatedUser.targetRole
    );
  };

  // Logic to handle status changes (Complete / Undo)
  const handleUpdateInsightStatus = async (id: string, status: InsightStatus) => {
    const updatedList = insights.map(insight => 
      insight.id === id ? { ...insight, status } : insight
    );
    await updateInsights(updatedList);
    await authService.updateInsightStatus(id, status);
    
    // Logic for growth boost or penalty (undo)
    if (currentUser) {
      if (status === 'completed') {
          const newReadiness = Math.min(currentUser.readiness + 5, 100);
          await updateUserData({ readiness: newReadiness });
      } else if (status === 'active') {
          // If undoing, decrease slightly (but maybe not full penalty to be nice)
          const newReadiness = Math.max(currentUser.readiness - 5, 0);
          await updateUserData({ readiness: newReadiness });
      }
    }
  };

  // Onboarding: Generate Roadmap and Save IMMEDIATELY
  const handleOnboardingComplete = async (file: File, goal: string) => {
    try {
      console.log('🚀 Starting onboarding:', file.name, goal);
      
      // 1. Analyze resume to get personalized metrics
      const metrics = await analyzeResumeMetrics(file.name, goal);
      console.log('📊 Metrics analyzed:', metrics);
      
      await updateUserData({
        hasOnboarded: true,
        growthLevel: metrics.growthLevel,
        readiness: metrics.readiness,
        targetRole: goal
      });
      
      console.log('💾 User data updated. Current user:', currentUser);
      console.log('💾 localStorage aura_user:', localStorage.getItem('aura_user'));
      
      // 2. Generate specific roadmap based on file + goal
      const initialChecklist = await generateInitialRoadmap(file.name, goal);
      
      // 3. Persist immediately
      await updateInsights(initialChecklist);
      
      console.log('✅ Onboarding complete');
      
      // 4. Switch to Roadmap tab to show the "pointers" immediately
      setActiveTab('roadmap');
    } catch (error) {
      console.error('❌ Onboarding failed:', error);
      alert(`Onboarding failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    }
  };

  const handleFileUpload = async (type: UploadType, file: File) => {
    if (!currentUser) return;
    setIsProcessing(true);
    
    try {
      console.log('📤 Processing upload:', file.name);
      
      // Simulate scanning
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newInsight = await analyzeUploadAndGenerateInsight(type, file.name);
      
      // Prepend new insight and save (FIX: define before using)
      const updatedList = [newInsight, ...insights];
      await updateInsights(updatedList);
    
      if (type === UploadType.RESUME) {
          const newGrowth = Math.min(currentUser.growthLevel + 10, 60);
          const newReadiness = Math.min(currentUser.readiness + 5, 60);
          await updateUserData({ growthLevel: newGrowth, readiness: newReadiness });
          setActiveTab('roadmap'); // Switch to roadmap to show new gaps
      } else {
          const newGrowth = Math.min(currentUser.growthLevel + 15, 100);
          const newReadiness = Math.min(currentUser.readiness + 12, 100);
          await updateUserData({ growthLevel: newGrowth, readiness: newReadiness });
          setActiveTab('feed'); // Show success in feed
      }
      
      console.log('✅ Upload processed successfully');
    } catch (error) {
      console.error('❌ Upload failed:', error);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSetGoal = async (goal: string) => {
    if (!currentUser) return;
    setIsProcessing(true);
    const planInsight = await generateActionPlan(goal);
    
    const updatedList = [planInsight, ...insights];
    await updateInsights(updatedList);
    
    const newReadiness = Math.max(currentUser.readiness - 10, 20);
    await updateUserData({ readiness: newReadiness, targetRole: goal });
    
    setIsProcessing(false);
    setActiveTab('roadmap');
  };

  if (isLoading) return null; 

  if (!currentUser) {
    return <Auth onLogin={handleLogin} onSignup={handleSignup} />;
  }

  if (!currentUser.hasOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex h-screen w-full bg-[#0B1120] overflow-hidden text-slate-200 font-sans selection:bg-emerald-500/30">
      
      {/* Sidebar (Left) */}
      <Sidebar 
        user={currentUser}
        onFileUpload={handleFileUpload} 
        isProcessing={isProcessing} 
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-hidden relative flex flex-col">
        
        {/* Background Mesh */}
        <div className="fixed inset-0 pointer-events-none">
             <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-indigo-600/10 blur-[150px]" />
             <div className="absolute bottom-[-10%] right-[30%] w-[600px] h-[600px] bg-teal-600/5 blur-[120px]" />
        </div>

        {/* Center: Dashboard */}
        <div className="flex-1 h-full overflow-y-auto overflow-x-hidden p-6 md:p-10 space-y-8 relative z-10 custom-scrollbar">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {/* Garden (Visual) */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Garden growthLevel={currentUser.growthLevel} />
            </section>
            
            {/* Milestone (Goal) */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 flex flex-col h-full justify-center">
                <Milestone onSetGoal={handleSetGoal} readiness={currentUser.readiness} />
            </section>
          </div>

          {/* Bottom Section: Tabs for Feed / Roadmap */}
          <section className="flex-1 min-h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 flex flex-col">
            
            {/* Tab Headers */}
            <div className="flex items-center gap-6 mb-4 border-b border-white/5 pb-2">
                <button 
                  onClick={() => setActiveTab('feed')}
                  className={`flex items-center gap-2 pb-2 text-sm font-medium transition-all relative ${activeTab === 'feed' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <Activity className="w-4 h-4" />
                    Live Feed
                    {activeTab === 'feed' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 rounded-t-full" />}
                </button>
                <button 
                  onClick={() => setActiveTab('roadmap')}
                  className={`flex items-center gap-2 pb-2 text-sm font-medium transition-all relative ${activeTab === 'roadmap' ? 'text-purple-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <LayoutList className="w-4 h-4" />
                    Strategy Checklist
                    {activeTab === 'roadmap' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-400 rounded-t-full" />}
                </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 relative">
                <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'feed' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                     <Insights 
                        insights={insights} 
                        onSelectInsight={setSelectedInsight}
                    />
                </div>
                <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'roadmap' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                     <Roadmap 
                        insights={insights} 
                        targetRole={currentUser.targetRole}
                        readiness={currentUser.readiness}
                        onSelectInsight={setSelectedInsight}
                    />
                </div>
            </div>

          </section>
        </div>
      </main>

      {/* Global Action Modal */}
      <ActionModal 
        isOpen={!!selectedInsight}
        onClose={() => setSelectedInsight(null)}
        insight={selectedInsight}
        onUpdateStatus={handleUpdateInsightStatus}
      />
    </div>
  );
};

export default App;
