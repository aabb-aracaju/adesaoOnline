import React, { useState, useEffect } from 'react';
import { StepProps } from '../types';
import { FormInput } from './FormInput';
import { Upload, FileText, X } from 'lucide-react';

export const Step3_Address: React.FC<StepProps> = ({ data, updateData, nextStep, prevStep }) => {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
      newErrors.email = "E-mail é obrigatório.";
    } else if (!emailRegex.test(data.email)) {
      newErrors.email = "E-mail inválido.";
    }

    // Validate Phone
    const cleanPhone = data.phone.replace(/\D/g, '');
    if (!data.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório.";
    } else if (cleanPhone.length < 10) {
      newErrors.phone = "Telefone incompleto (mínimo 10 dígitos).";
    }

    // Validate CEP
    const cleanCEP = data.cep.replace(/\D/g, '');
    if (!data.cep) {
      newErrors.cep = "CEP é obrigatório.";
    } else if (cleanCEP.length !== 8) {
      newErrors.cep = "CEP inválido (8 dígitos).";
    }

    // Validate Address
    if (!data.street) newErrors.street = "Logradouro é obrigatório.";
    if (!data.number) newErrors.number = "Número é obrigatório.";
    if (!data.neighborhood) newErrors.neighborhood = "Bairro é obrigatório.";
    if (!data.city) newErrors.city = "Cidade é obrigatória.";
    if (!data.state) newErrors.state = "Estado é obrigatório.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    validate();
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ [e.target.name]: e.target.value });
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);
    value = value.replace(/^(\d{5})(\d)/, "$1-$2");
    updateData({ cep: value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    updateData({ phone: value });
  };

  // Função utilitária para comprimir imagem
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
          resolve(compressedDataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
         alert('Formato inválido. Apenas imagens são permitidas.');
         return;
      }
      try {
        const compressed = await compressImage(file);
        updateData({ residenceDocument: compressed });
      } catch (e) {
        alert('Erro ao processar documento.');
      }
    }
  };

  const removeDoc = () => {
    updateData({ residenceDocument: null });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const isFormValid = Object.keys(errors).length === 0;

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-aabb-dark mb-2">Contatos e Endereço</h2>
      <p className="text-gray-500 mb-6">Como podemos entrar em contato com você?</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
           <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-2">Contato</h3>
        </div>
        
        <FormInput
          label="E-mail *"
          name="email"
          type="email"
          value={data.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="exemplo@email.com"
          error={touched.email && errors.email ? errors.email : undefined}
        />

        <FormInput
          label="Celular / WhatsApp *"
          name="phone"
          value={data.phone}
          onChange={handlePhoneChange}
          onBlur={handleBlur}
          placeholder="(00) 90000-0000"
          error={touched.phone && errors.phone ? errors.phone : undefined}
          maxLength={15}
        />

        <div className="md:col-span-2">
           <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4">Endereço</h3>
        </div>

        <FormInput
          label="CEP *"
          name="cep"
          value={data.cep}
          onChange={handleCEPChange}
          onBlur={handleBlur}
          placeholder="00000-000"
          maxLength={9}
          error={touched.cep && errors.cep ? errors.cep : undefined}
        />

        <FormInput
          label="Logradouro *"
          name="street"
          value={data.street}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Rua, Avenida..."
          error={touched.street && errors.street ? errors.street : undefined}
        />

        <div className="grid grid-cols-2 gap-4">
           <FormInput
            label="Número *"
            name="number"
            value={data.number}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.number && errors.number ? errors.number : undefined}
          />
           <FormInput
            label="Complemento"
            name="complement"
            value={data.complement}
            onChange={handleChange}
            placeholder="Ap, Bloco..."
          />
        </div>

        <FormInput
          label="Bairro *"
          name="neighborhood"
          value={data.neighborhood}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.neighborhood && errors.neighborhood ? errors.neighborhood : undefined}
        />

        <FormInput
          label="Cidade *"
          name="city"
          value={data.city}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.city && errors.city ? errors.city : undefined}
        />

        <FormInput
          label="Estado (UF) *"
          name="state"
          value={data.state}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="SE"
          maxLength={2}
          error={touched.state && errors.state ? errors.state : undefined}
        />

        {/* Upload Comprovante Residência */}
        <div className="md:col-span-2 mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
           <label className="text-sm font-medium text-gray-700 mb-2 block">Comprovante de Residência</label>
           
           {data.residenceDocument ? (
               <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 overflow-hidden">
                     <FileText size={18} className="flex-shrink-0" />
                     <span className="text-xs truncate font-medium">Comprovante anexado</span>
                  </div>
                  <button onClick={removeDoc} className="text-red-500 hover:text-red-700 p-1">
                     <X size={16} />
                  </button>
               </div>
           ) : (
               <label className="flex items-center justify-center gap-2 w-full p-4 bg-white border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-700">
                  <Upload size={18} />
                  <span className="text-sm font-medium">Anexar Comprovante (Conta de Luz, Água, etc)</span>
                  <input 
                     type="file" 
                     accept="image/*" 
                     onChange={handleFileChange} 
                     className="hidden" 
                  />
               </label>
           )}
        </div>
      </div>

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