import React, { useState, useEffect } from 'react';
import { StepProps, PlanType } from '../types';
import { FormInput } from './FormInput';
import { Camera, X, CheckCircle, AlertCircle, FileText, Upload } from 'lucide-react';

export const Step2_Personal: React.FC<StepProps> = ({ data, updateData, nextStep, prevStep }) => {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Estados para feedback do upload da Foto 3x4
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Validate Profile Picture for Efetivo
    if (data.plan === PlanType.EFETIVO && !data.profilePicture) {
      newErrors.profilePicture = "Foto 3x4 é obrigatória para associados Efetivos.";
    }

    // Validate Full Name
    if (!data.fullName.trim()) {
      newErrors.fullName = "Nome Completo é obrigatório.";
    } else if (data.fullName.trim().split(/\s+/).length < 2) {
      newErrors.fullName = "Informe o nome e sobrenome.";
    }

    // Validate CPF
    const cleanCPF = data.cpf.replace(/\D/g, '');
    if (!data.cpf.trim()) {
      newErrors.cpf = "CPF é obrigatório.";
    } else if (cleanCPF.length !== 11) {
      newErrors.cpf = "CPF inválido (11 dígitos).";
    }

    // Validate other required fields
    if (!data.dob) newErrors.dob = "Data de nascimento é obrigatória.";
    if (!data.gender) newErrors.gender = "Gênero é obrigatório.";
    if (!data.maritalStatus) newErrors.maritalStatus = "Estado civil é obrigatório.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    validate();
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateData({ [e.target.name]: e.target.value });
    
    // Limpar documento de casamento se mudar estado civil
    if (e.target.name === 'maritalStatus' && e.target.value !== 'CASADO') {
       updateData({ marriageDocument: null });
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    updateData({ cpf: value });
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
          const MAX_WIDTH = 800; // Um pouco maior para documentos
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Comprime para JPEG qualidade 0.6
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
          resolve(compressedDataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof typeof data) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validação de tipo
      if (!file.type.startsWith('image/')) {
         alert('Formato inválido. Apenas imagens são permitidas.');
         return;
      }

      if (fieldName === 'profilePicture') setUploadStatus('idle');

      try {
        const compressedImage = await compressImage(file);
        updateData({ [fieldName]: compressedImage });
        
        if (fieldName === 'profilePicture') {
            setUploadStatus('success');
            setUploadMessage('Foto carregada!');
            if (errors.profilePicture) {
                setErrors(prev => {
                    const newErrors = {...prev};
                    delete newErrors.profilePicture;
                    return newErrors;
                });
            }
        }
      } catch (error) {
        console.error("Erro ao processar imagem", error);
        if (fieldName === 'profilePicture') {
            setUploadStatus('error');
            setUploadMessage('Erro ao processar.');
        } else {
            alert('Erro ao processar documento.');
        }
      }
    }
  };

  const removePhoto = (e: React.MouseEvent, fieldName: keyof typeof data) => {
    e.preventDefault();
    updateData({ [fieldName]: null });
    if (fieldName === 'profilePicture') {
        setUploadStatus('idle');
        setUploadMessage('');
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const isFormValid = Object.keys(errors).length === 0;

  // Componente Auxiliar para Upload de Documentos
  const DocumentUpload = ({ label, field, value }: { label: string, field: keyof typeof data, value: string | null }) => (
     <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
        {value ? (
           <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 overflow-hidden">
                 <FileText size={18} className="flex-shrink-0" />
                 <span className="text-xs truncate font-medium">Documento anexado</span>
              </div>
              <button 
                 onClick={(e) => removePhoto(e, field)}
                 className="text-red-500 hover:text-red-700 p-1"
                 title="Remover"
              >
                 <X size={16} />
              </button>
           </div>
        ) : (
           <label className="flex items-center justify-center gap-2 w-full p-3 bg-white border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-700">
              <Upload size={18} />
              <span className="text-xs font-medium">Toque para anexar foto</span>
              <input 
                 type="file" 
                 accept="image/*" 
                 onChange={(e) => handleFileChange(e, field)} 
                 className="hidden" 
              />
           </label>
        )}
     </div>
  );

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-aabb-dark mb-2">Dados Pessoais</h2>
      <p className="text-gray-500 mb-6">Preencha seus dados conforme documento de identificação.</p>

      {/* Profile Picture Upload */}
      <div className="flex flex-col items-center mb-8">
        <label className="text-sm font-medium text-gray-700 mb-2">
           Foto 3x4 {data.plan === PlanType.EFETIVO && <span className="text-red-500">*</span>}
        </label>
        
        <div className={`relative w-32 h-40 bg-gray-50 border-2 border-dashed rounded-lg flex flex-col items-center justify-center overflow-hidden hover:bg-gray-100 transition-colors group 
          ${uploadStatus === 'error' ? 'border-red-400 bg-red-50' : (uploadStatus === 'success' ? 'border-green-400' : (errors.profilePicture ? 'border-red-400' : 'border-gray-300'))}
        `}>
          {data.profilePicture ? (
            <>
              <img src={data.profilePicture} alt="Preview" className="w-full h-full object-cover" />
              <button 
                onClick={(e) => removePhoto(e, 'profilePicture')}
                className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 hover:bg-white transition-colors shadow-sm"
                title="Remover foto"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <div className="text-center p-2 text-gray-400 flex flex-col items-center">
               <Camera size={32} className="mb-2" />
               <span className="text-xs font-medium">Carregar Foto</span>
            </div>
          )}
          
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => handleFileChange(e, 'profilePicture')} 
            className="absolute inset-0 opacity-0 cursor-pointer" 
          />
        </div>

        {uploadStatus === 'success' && (
           <div className="flex items-center gap-1.5 mt-2 text-xs text-green-600 font-medium animate-fade-in">
              <CheckCircle size={14} /> <span>{uploadMessage}</span>
           </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <FormInput
            label="Nome Completo *"
            name="fullName"
            value={data.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ex: João da Silva"
            error={touched.fullName && errors.fullName ? errors.fullName : undefined}
          />
        </div>

        <FormInput
          label="CPF *"
          name="cpf"
          value={data.cpf}
          onChange={handleCPFChange}
          onBlur={handleBlur}
          placeholder="000.000.000-00"
          error={touched.cpf && errors.cpf ? errors.cpf : undefined}
          maxLength={14}
        />

        <FormInput
          label="RG / Órgão Emissor"
          name="rg"
          value={data.rg}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="00000000 SSP/SE"
        />

        <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
           <DocumentUpload 
              label="Foto do Documento (CNH ou RG)" 
              field="personalDocument" 
              value={data.personalDocument} 
           />
           <p className="text-[10px] text-gray-500 mt-1">Anexe uma foto legível do seu documento.</p>
        </div>

        <FormInput
          label="Data de Nascimento *"
          name="dob"
          type="date"
          value={data.dob}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.dob && errors.dob ? errors.dob : undefined}
        />

        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-medium text-gray-700">Gênero *</label>
          <select
            name="gender"
            value={data.gender}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-aabb-blue/50 bg-white ${touched.gender && errors.gender ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Selecione</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
            <option value="O">Outro</option>
          </select>
          {touched.gender && errors.gender && <span className="text-xs text-red-500">{errors.gender}</span>}
        </div>

        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-medium text-gray-700">Estado Civil *</label>
          <select
            name="maritalStatus"
            value={data.maritalStatus}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-aabb-blue/50 bg-white ${touched.maritalStatus && errors.maritalStatus ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Selecione</option>
            <option value="SOLTEIRO">Solteiro(a)</option>
            <option value="CASADO">Casado(a)</option>
            <option value="DIVORCIADO">Divorciado(a)</option>
            <option value="VIUVO">Viúvo(a)</option>
            <option value="UNIAO_ESTAVEL">União Estável</option>
          </select>
          {touched.maritalStatus && errors.maritalStatus && <span className="text-xs text-red-500">{errors.maritalStatus}</span>}
        </div>

        {data.maritalStatus === 'CASADO' && (
           <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200 animate-fade-in">
              <DocumentUpload 
                 label="Certidão de Casamento" 
                 field="marriageDocument" 
                 value={data.marriageDocument} 
              />
              <p className="text-[10px] text-gray-500 mt-1">Obrigatório para inclusão de cônjuge.</p>
           </div>
        )}
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
