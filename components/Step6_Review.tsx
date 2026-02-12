import React, { useState } from 'react';
import { StepProps, PlanType } from '../types';
import { CheckCircle, User, Loader2, Send, AlertTriangle } from 'lucide-react';
import { SignaturePad } from './SignaturePad';
import { saveSubmission } from '../services/storage';

export const Step6_Review: React.FC<StepProps> = ({ data, updateData, prevStep }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [signatureError, setSignatureError] = useState(false);
  
  const handleSignatureSave = (signature: string | null) => {
    updateData({ signature });
    if (signature) {
      setSignatureError(false);
    }
  };

  const handleSubmit = async () => {
    // 1. Validação de Assinatura
    if (!data.signature) {
      setSignatureError(true);
      // Rola a tela até a área de assinatura
      const signatureElement = document.getElementById('signature-area');
      signatureElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Adiciona um alerta visual extra caso o scroll não seja percebido
      alert("É necessário assinar digitalmente antes de finalizar.");
      return;
    }

    // 2. Inicia envio
    setIsSubmitting(true);

    try {
      // Simula delay de rede para feedback visual
      await new Promise(resolve => setTimeout(resolve, 800));

      // 3. Salva no LocalStorage
      console.log("Tentando salvar proposta..."); 
      saveSubmission(data);
      console.log("Proposta salva com sucesso!");

      // 4. Sucesso
      setIsSuccess(true);
      
    } catch (error: any) {
      console.error("Erro fatal ao salvar:", error);
      // Exibe mensagem de erro específica (ex: Cota excedida)
      alert(error.message || "Houve um erro técnico ao salvar a proposta. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  const getRelationshipLabel = (value: string) => {
    const labels: Record<string, string> = {
      'CONJUGE': 'Cônjuge',
      'FILHO': 'Filho(a)',
      'ENTEADO': 'Enteado(a)',
      'PAI_MAE': 'Pai/Mãe',
      'AVO': 'Avô/Avó',
      'SOGRO': 'Sogro/Sogra'
    };
    return labels[value] || value;
  };

  if (isSuccess) {
      return (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 shadow-lg">
                  <CheckCircle size={40} />
              </div>
              <h2 className="text-3xl font-bold text-aabb-dark mb-2">Proposta Enviada!</h2>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                  Sua proposta de adesão foi registrada com sucesso no sistema da Secretaria da AABB Aracaju.
                  <br/><br/>
                  <span className="text-sm bg-blue-50 text-blue-800 py-1 px-3 rounded-full">
                    Aguarde o contato da nossa equipe.
                  </span>
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-aabb-blue text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors shadow-lg"
              >
                  Iniciar Novo Cadastro
              </button>
          </div>
      )
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-aabb-dark mb-2">Revisão e Assinatura</h2>
      <p className="text-gray-500 mb-6">Confirme os dados e assine digitalmente para finalizar.</p>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6 shadow-sm">
        <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
           <span className="font-bold text-gray-700">Plano Selecionado</span>
           <span className={`px-3 py-1 rounded-full text-xs font-bold ${data.plan === PlanType.COMUNITARIO ? 'bg-blue-100 text-aabb-blue' : 'bg-yellow-100 text-yellow-800'}`}>
              {data.plan === PlanType.COMUNITARIO ? 'COMUNITÁRIO FAMÍLIA' : 'EFETIVO FAMÍLIA'}
           </span>
        </div>
        
        <div className="p-4 flex flex-col md:flex-row gap-6">
           {/* Photo Preview */}
           <div className="flex-shrink-0 flex justify-center md:justify-start">
             <div className="w-24 h-32 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center">
                {data.profilePicture ? (
                  <img src={data.profilePicture} alt="Foto 3x4" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-300 flex flex-col items-center">
                     <User size={32} />
                     <span className="text-[10px] mt-1">Sem foto</span>
                  </div>
                )}
             </div>
           </div>

           <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div>
                 <p className="text-gray-500 mb-1">Nome Completo</p>
                 <p className="font-medium text-gray-800">{data.fullName}</p>
              </div>
              <div>
                 <p className="text-gray-500 mb-1">CPF</p>
                 <p className="font-medium text-gray-800">{data.cpf}</p>
              </div>
              <div>
                 <p className="text-gray-500 mb-1">E-mail</p>
                 <p className="font-medium text-gray-800">{data.email}</p>
              </div>
              <div>
                 <p className="text-gray-500 mb-1">Celular</p>
                 <p className="font-medium text-gray-800">{data.phone}</p>
              </div>
              <div className="md:col-span-2">
                 <p className="text-gray-500 mb-1">Endereço</p>
                 <div className="font-medium text-gray-800">
                   <p>{data.street}, {data.number} {data.complement && `- ${data.complement}`}</p>
                   <p>{data.neighborhood} - {data.city}/{data.state}</p>
                   <p>CEP: {data.cep}</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {data.dependents.length > 0 && (
         <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6 shadow-sm">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
               <span className="font-bold text-gray-700">Dependentes ({data.dependents.length})</span>
            </div>
            <div className="divide-y divide-gray-100">
               {data.dependents.map(dep => (
                  <div key={dep.id} className="p-3 px-4 flex justify-between items-center text-sm">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-10 bg-gray-100 rounded border border-gray-200 overflow-hidden flex-shrink-0">
                           {dep.profilePicture ? (
                              <img src={dep.profilePicture} alt={dep.name} className="w-full h-full object-cover" />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                 <User size={12} />
                              </div>
                           )}
                        </div>
                        <span className="font-medium text-gray-800">{dep.name}</span>
                     </div>
                     <span className="text-gray-500">{getRelationshipLabel(dep.relationship)}</span>
                  </div>
               ))}
            </div>
         </div>
      )}

      {/* Termos e Assinatura */}
      <div 
        id="signature-area"
        className={`bg-blue-50 border rounded-xl p-5 mb-8 transition-colors duration-300 
          ${signatureError ? 'border-red-400 bg-red-50 ring-2 ring-red-200' : 'border-blue-100'}
        `}
      >
         <div className="flex items-start gap-3 mb-6">
            <CheckCircle className={`flex-shrink-0 mt-0.5 ${signatureError ? 'text-red-500' : 'text-aabb-blue'}`} />
            <div className={`text-sm ${signatureError ? 'text-red-800' : 'text-aabb-blue'}`}>
               <p className="font-bold mb-1">Termo de Adesão</p>
               <p>Declaro serem verdadeiras as informações prestadas e concordo com os termos do estatuto social da AABB Aracaju. Autorizo o débito das mensalidades conforme plano selecionado.</p>
            </div>
         </div>

         <div className={`bg-white rounded-lg p-4 border ${signatureError ? 'border-red-300' : 'border-blue-200'}`}>
            <SignaturePad 
               onSave={handleSignatureSave} 
               initialSignature={data.signature}
            />
         </div>
         
         {signatureError && (
            <div className="mt-2 flex items-center gap-2 text-red-600 text-sm font-bold animate-pulse">
               <AlertTriangle size={16} />
               Assinatura obrigatória para finalizar.
            </div>
         )}
      </div>

      <div className="flex justify-between items-center">
        <button 
          onClick={prevStep}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          disabled={isSubmitting}
        >
          Voltar
        </button>
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold shadow-lg transition-all transform hover:-translate-y-0.5 
            ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}
          `}
        >
          {isSubmitting ? (
             <>
               <Loader2 size={20} className="animate-spin" /> Processando...
             </>
          ) : (
             <>
               <Send size={20} /> Finalizar Inscrição
             </>
          )}
        </button>
      </div>
    </div>
  );
};