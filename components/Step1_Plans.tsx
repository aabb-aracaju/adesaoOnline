import React from 'react';
import { StepProps, PlanType } from '../types';
import { Users, Briefcase } from 'lucide-react';

export const Step1_Plans: React.FC<StepProps> = ({ data, updateData, nextStep }) => {
  
  const handleSelect = (plan: PlanType) => {
    updateData({ plan });
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-aabb-dark mb-2">Escolha sua Categoria</h2>
      <p className="text-gray-500 mb-8">Selecione o plano que melhor se adequa ao seu perfil.</p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Comunitário */}
        <div 
          onClick={() => handleSelect(PlanType.COMUNITARIO)}
          className={`cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300 hover:shadow-xl relative overflow-hidden group
            ${data.plan === PlanType.COMUNITARIO ? 'border-aabb-blue bg-blue-50 ring-2 ring-aabb-blue ring-offset-2' : 'border-gray-200 bg-white hover:border-blue-300'}
          `}
        >
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users size={100} className="text-aabb-blue" />
          </div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-aabb-blue flex items-center justify-center mb-4">
               <Users size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Comunitário Família</h3>
            <p className="text-sm text-gray-500 mb-4 min-h-[40px]">Para a comunidade em geral que deseja desfrutar de toda a estrutura.</p>
            
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-sm text-gray-500">R$</span>
              <span className="text-4xl font-bold text-aabb-dark">184</span>
              <span className="text-sm text-gray-500">/mês</span>
            </div>

            <div className="mb-6 bg-white/60 p-3 rounded-lg border border-gray-200">
               <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Taxa de Adesão</p>
               <div className="flex items-end gap-2">
                 <span className="text-lg font-bold text-gray-800">R$ 600,00</span>
               </div>
               <p className="text-xs text-gray-500 mt-1">Parcelado em 3x (1ª de R$ 200,00)</p>
            </div>

            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Acesso total ao clube</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Inclusão de dependentes</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Não precisa ser funcionário do BB</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Retirada de Convites</li>
            </ul>

            <button className={`w-full py-2 rounded-lg font-medium transition-colors ${data.plan === PlanType.COMUNITARIO ? 'bg-aabb-blue text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-blue-50'}`}>
              {data.plan === PlanType.COMUNITARIO ? 'Selecionado' : 'Selecionar'}
            </button>
          </div>
        </div>

        {/* Efetivo */}
        <div 
          onClick={() => handleSelect(PlanType.EFETIVO)}
          className={`cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300 hover:shadow-xl relative overflow-hidden group
            ${data.plan === PlanType.EFETIVO ? 'border-aabb-yellow bg-yellow-50 ring-2 ring-aabb-yellow ring-offset-2' : 'border-gray-200 bg-white hover:border-yellow-200'}
          `}
        >
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Briefcase size={100} className="text-aabb-yellow" />
          </div>

          <div className="relative z-10">
             <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center mb-4">
               <Briefcase size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Efetivo Família</h3>
            <p className="text-sm text-gray-500 mb-4 min-h-[40px]">Exclusivo para funcionários do Banco do Brasil (Ativa ou Aposentados).</p>
            
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-sm text-gray-500">R$</span>
              <span className="text-4xl font-bold text-aabb-dark">129</span>
              <span className="text-sm text-gray-500">/mês</span>
            </div>

            <div className="mb-6 bg-green-50 p-3 rounded-lg border border-green-200">
               <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Taxa de Adesão</p>
               <div className="flex items-end gap-2">
                 <span className="text-lg font-bold text-green-700">ISENTA</span>
               </div>
               <p className="text-xs text-green-600 mt-1">Benefício exclusivo p/ funcionários BB</p>
            </div>

            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Desconto exclusivo</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Débito todo dia 20</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Acesso a toda rede AABB</li>
            </ul>

             <button className={`w-full py-2 rounded-lg font-medium transition-colors ${data.plan === PlanType.EFETIVO ? 'bg-aabb-yellow text-aabb-dark' : 'bg-gray-100 text-gray-600 group-hover:bg-yellow-50'}`}>
              {data.plan === PlanType.EFETIVO ? 'Selecionado' : 'Selecionar'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button 
          onClick={nextStep} 
          disabled={!data.plan}
          className="px-8 py-3 bg-aabb-blue text-white rounded-lg font-semibold shadow-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};