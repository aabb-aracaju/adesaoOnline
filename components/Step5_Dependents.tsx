import React, { useState } from 'react';
import { StepProps, Dependent } from '../types';
import { FormInput } from './FormInput';
import { Plus, Trash2, UserPlus, AlertCircle, Camera, X, FileText, Upload } from 'lucide-react';

export const Step5_Dependents: React.FC<StepProps> = ({ data, updateData, nextStep, prevStep }) => {
  const [newDependent, setNewDependent] = useState<Partial<Dependent>>({
    name: '',
    dob: '',
    relationship: '',
    profilePicture: null,
    cpfDocument: null
  });
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const relationshipOptions = [
    { value: 'CONJUGE', label: 'Cônjuge' },
    { value: 'FILHO', label: 'Filho(a)' },
    { value: 'ENTEADO', label: 'Enteado(a)' },
    { value: 'PAI_MAE', label: 'Pai/Mãe' },
    { value: 'AVO', label: 'Avô/Avó' },
    { value: 'SOGRO', label: 'Sogro/Sogra' }
  ];

  const calculateAge = (dateString: string) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleAdd = () => {
    setError(null);

    if (newDependent.name && newDependent.dob && newDependent.relationship) {
      
      const age = calculateAge(newDependent.dob);

      // Regras de Validação de Idade
      if (newDependent.relationship === 'FILHO' && age > 24) {
        setError('Para a categoria "Filho(a)", o dependente deve ter até 24 anos.');
        return;
      }

      const elderlyTypes = ['AVO', 'SOGRO'];
      if (elderlyTypes.includes(newDependent.relationship) && age < 65) {
        setError('Para "Avô/Avó" ou "Sogro/Sogra", o dependente deve ter no mínimo 65 anos.');
        return;
      }

      const dependent: Dependent = {
        id: Math.random().toString(36).substr(2, 9),
        name: newDependent.name,
        dob: newDependent.dob,
        relationship: newDependent.relationship,
        profilePicture: newDependent.profilePicture,
        cpfDocument: newDependent.cpfDocument
      };
      
      updateData({ dependents: [...data.dependents, dependent] });
      setNewDependent({ name: '', dob: '', relationship: '', profilePicture: null, cpfDocument: null });
      setIsAdding(false);
    }
  };

  const handleRemove = (id: string) => {
    updateData({ dependents: data.dependents.filter(d => d.id !== id) });
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
          resolve(canvas.toDataURL('image/jpeg', 0.6));
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'cpf') => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
         setError('Apenas imagens são permitidas.');
         return;
      }
      try {
        const compressed = await compressImage(file);
        if (type === 'photo') {
           setNewDependent(prev => ({ ...prev, profilePicture: compressed }));
        } else {
           setNewDependent(prev => ({ ...prev, cpfDocument: compressed }));
        }
        setError(null);
      } catch (e) {
        setError('Erro ao processar imagem.');
      }
    }
  };

  const removeFile = (e: React.MouseEvent, type: 'photo' | 'cpf') => {
    e.preventDefault();
    if (type === 'photo') {
       setNewDependent(prev => ({ ...prev, profilePicture: null }));
    } else {
       setNewDependent(prev => ({ ...prev, cpfDocument: null }));
    }
  };

  const getRelationshipLabel = (value: string) => {
    const option = relationshipOptions.find(o => o.value === value);
    return option ? option.label : value;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-start mb-2">
         <div>
            <h2 className="text-2xl font-bold text-aabb-dark">Dependentes</h2>
            <p className="text-gray-500 mb-6">Adicione cônjuge e filhos, se houver.</p>
         </div>
         <button 
            onClick={() => { setIsAdding(true); setError(null); }}
            className="flex items-center gap-2 text-sm text-aabb-blue font-semibold hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
            disabled={isAdding}
         >
            <Plus size={16} /> Adicionar
         </button>
      </div>

      {/* Lista de Dependentes Existentes */}
      <div className="space-y-3 mb-6">
        {data.dependents.length === 0 && !isAdding && (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
             <div className="flex justify-center mb-2 text-gray-300">
                <UserPlus size={48} />
             </div>
             <p className="text-gray-400">Nenhum dependente adicionado.</p>
          </div>
        )}

        {data.dependents.map((dep) => (
          <div key={dep.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                 {dep.profilePicture ? (
                    <img src={dep.profilePicture} alt={dep.name} className="w-full h-full object-cover" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                       <UserPlus size={16} />
                    </div>
                 )}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{dep.name}</p>
                <div className="text-sm text-gray-500 flex gap-2 sm:gap-4 flex-wrap items-center">
                  <span className="bg-blue-50 text-aabb-blue px-2 py-0.5 rounded text-xs font-semibold">{getRelationshipLabel(dep.relationship)}</span>
                  <span>{new Date(dep.dob).toLocaleDateString('pt-BR')}</span>
                  {dep.cpfDocument && (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                          <FileText size={10} /> CPF Anexado
                      </span>
                  )}
                </div>
              </div>
            </div>
            <button 
              onClick={() => handleRemove(dep.id)}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Formulário para adicionar novo dependente */}
      {isAdding && (
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 animate-fade-in-up">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Novo Dependente</h3>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-sm">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
                {/* Upload de Foto */}
                <div className="flex-shrink-0">
                    <div className={`relative w-20 h-24 bg-white border-2 border-dashed rounded-lg flex flex-col items-center justify-center overflow-hidden hover:bg-gray-50 transition-colors group border-gray-300`}>
                    {newDependent.profilePicture ? (
                        <>
                        <img src={newDependent.profilePicture} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                            onClick={(e) => removeFile(e, 'photo')}
                            className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 hover:bg-white transition-colors"
                            title="Remover foto"
                        >
                            <X size={10} />
                        </button>
                        </>
                    ) : (
                        <div className="text-center p-1 text-gray-400 flex flex-col items-center">
                            <Camera size={20} className="mb-1" />
                            <span className="text-[9px] font-medium leading-tight">Foto 3x4</span>
                        </div>
                    )}
                    
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileChange(e, 'photo')} 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                    </div>
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                        <FormInput 
                            label="Nome Completo" 
                            value={newDependent.name} 
                            onChange={(e) => setNewDependent({...newDependent, name: e.target.value})}
                            className="bg-white"
                            placeholder="Ex: Maria da Silva"
                        />
                    </div>
                    <FormInput 
                        label="Data de Nascimento" 
                        type="date"
                        value={newDependent.dob} 
                        onChange={(e) => setNewDependent({...newDependent, dob: e.target.value})}
                        className="bg-white"
                    />
                    <div className="flex flex-col gap-1 mb-4">
                        <label className="text-sm font-medium text-gray-700">Vínculo</label>
                        <select
                            value={newDependent.relationship}
                            onChange={(e) => setNewDependent({...newDependent, relationship: e.target.value})}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-aabb-blue/50 bg-white"
                        >
                            <option value="">Selecione</option>
                            {relationshipOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Upload CPF */}
            <div className="bg-white p-3 border border-dashed border-gray-300 rounded-lg">
                 <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Documento CPF do Dependente</label>
                 {newDependent.cpfDocument ? (
                     <div className="flex items-center justify-between p-2 bg-green-50 border border-green-100 rounded">
                        <div className="flex items-center gap-2 text-green-700 text-xs font-medium">
                            <FileText size={14} /> CPF Anexado
                        </div>
                        <button onClick={(e) => removeFile(e, 'cpf')} className="text-red-500">
                            <X size={14} />
                        </button>
                     </div>
                 ) : (
                     <label className="flex items-center gap-2 cursor-pointer text-aabb-blue hover:text-blue-800 transition-colors">
                        <Upload size={16} />
                        <span className="text-xs font-medium underline">Carregar foto do CPF</span>
                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'cpf')} className="hidden" />
                     </label>
                 )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
             <button 
                onClick={() => { setIsAdding(false); setError(null); setNewDependent({ name: '', dob: '', relationship: '', profilePicture: null, cpfDocument: null }); }}
                className="px-4 py-2 text-gray-500 font-medium hover:text-gray-700"
             >
                Cancelar
             </button>
             <button 
                onClick={handleAdd}
                className="px-4 py-2 bg-aabb-blue text-white rounded-lg font-medium hover:bg-blue-800"
                disabled={!newDependent.name || !newDependent.dob || !newDependent.relationship}
             >
                Salvar
             </button>
          </div>
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
          className="px-8 py-3 bg-aabb-blue text-white rounded-lg font-semibold shadow-lg hover:bg-blue-800 transition-all"
        >
          Próximo
        </button>
      </div>
    </div>
  );
};