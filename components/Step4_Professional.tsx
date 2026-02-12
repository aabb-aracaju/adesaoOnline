import React from 'react';
import { StepProps, PlanType } from '../types';
import { FormInput } from './FormInput';

export const Step4_Professional: React.FC<StepProps> = ({ data, updateData, nextStep, prevStep }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ [e.target.name]: e.target.value });
  };

  const isEfetivo = data.plan === PlanType.EFETIVO;
  // For 'Efetivo', employer is likely Banco do Brasil, but we leave it editable or pre-fill.
  // We'll require all fields if Efetivo.
  const isFormValid = isEfetivo 
    ? (data.employer && data.profession && data.admissionDate)
    : true; // Optional for Comunitário? Let's make it optional but good to have.

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-aabb-dark mb-2">Dados Profissionais</h2>
      <p className="text-gray-500 mb-6">
        {isEfetivo 
          ? "Como associado EFETIVO, precisamos dos dados do seu vínculo com o Banco do Brasil."
          : "Informações sobre sua ocupação atual."}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Empresa / Órgão"
          name="employer"
          value={data.employer}
          onChange={handleChange}
          placeholder={isEfetivo ? "Banco do Brasil" : "Nome da empresa"}
        />

        <FormInput
          label="Profissão / Cargo"
          name="profession"
          value={data.profession}
          onChange={handleChange}
          placeholder="Ex: Gerente, Analista..."
        />

        <FormInput
          label="Data de Admissão"
          name="admissionDate"
          type="date"
          value={data.admissionDate}
          onChange={handleChange}
        />
      </div>

      {isEfetivo && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          <strong>Atenção:</strong> Será necessário apresentar contracheque ou documento comprovando o vínculo com o Banco do Brasil na secretaria do clube para validar a categoria Efetivo.
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button 
          onClick={prevStep}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
          Voltar
        </button>
        <button 
          onClick={nextStep} 
          disabled={!isFormValid}
          className="px-8 py-3 bg-aabb-blue text-white rounded-lg font-semibold shadow-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Próximo
        </button>
      </div>
    </div>
  );
};