import React, { useState } from 'react';
import { Stepper } from './components/Stepper';
import { Step1_Plans } from './components/Step1_Plans';
import { Step2_Personal } from './components/Step2_Personal';
import { Step3_Address } from './components/Step3_Address';
import { Step4_Professional } from './components/Step4_Professional';
import { Step5_Dependents } from './components/Step5_Dependents';
import { Step6_Review } from './components/Step6_Review';
import { ChatAssistant } from './components/ChatAssistant';
import { AdminDashboard } from './components/AdminDashboard';
import { FormData, INITIAL_DATA } from './types';
import { Lock } from 'lucide-react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const updateData = (fields: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 6));
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const renderStep = () => {
    const props = { data: formData, updateData, nextStep, prevStep };
    
    switch (currentStep) {
      case 1: return <Step1_Plans {...props} />;
      case 2: return <Step2_Personal {...props} />;
      case 3: return <Step3_Address {...props} />;
      case 4: return <Step4_Professional {...props} />;
      case 5: return <Step5_Dependents {...props} />;
      case 6: return <Step6_Review {...props} />;
      default: return <Step1_Plans {...props} />;
    }
  };

  const steps = [
    "Planos",
    "Pessoal",
    "Endereço",
    "Profissão",
    "Família",
    "Revisão"
  ];

  if (isAdminMode) {
      return <AdminDashboard onBackToHome={() => setIsAdminMode(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-aabb-dark to-aabb-blue text-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
           {/* Simple Logo Placeholder */}
           <div className="w-10 h-10 bg-aabb-yellow rounded-lg flex items-center justify-center text-aabb-blue font-bold text-xl">
             A
           </div>
           <div>
             <h1 className="text-xl font-bold tracking-tight">AABB Aracaju</h1>
             <p className="text-xs text-blue-200">Portal de Adesão</p>
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 pb-24">
        
        <Stepper currentStep={currentStep} totalSteps={6} steps={steps} />

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 min-h-[500px] relative mt-6">
            {renderStep()}
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-gray-500 text-sm">
         <p className="mb-2">© {new Date().getFullYear()} AABB Aracaju. Todos os direitos reservados.</p>
         <button 
           onClick={() => setIsAdminMode(true)}
           className="text-xs text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1 mx-auto transition-colors"
         >
            <Lock size={12} /> Acesso Administrativo
         </button>
      </footer>

      {/* Chat Assistant */}
      <ChatAssistant />

    </div>
  );
};

export default App;