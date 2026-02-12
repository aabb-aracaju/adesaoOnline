import React, { useState, useEffect } from 'react';
import { getSubmissions, deleteSubmission, updateSubmissionStatus } from '../services/storage';
import { Submission, PlanType } from '../types';
import { Printer, Trash2, Search, Check, X, Eye } from 'lucide-react';
import { PrintTemplate } from './PrintTemplate';

interface AdminDashboardProps {
  onBackToHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToHome }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setSubmissions(getSubmissions());
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta proposta?')) {
      deleteSubmission(id);
      loadData();
    }
  };

  const handleStatus = (id: string, status: 'APROVADO' | 'REJEITADO') => {
     updateSubmissionStatus(id, status);
     loadData();
  };

  const filteredSubmissions = submissions.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.cpf.includes(searchTerm) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedSubmission) {
    return <PrintTemplate data={selectedSubmission} onClose={() => setSelectedSubmission(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-aabb-dark">Painel da Secretaria</h1>
            <p className="text-gray-500">Gerencie as propostas de adesão recebidas.</p>
          </div>
          <button 
             onClick={onBackToHome}
             className="text-sm text-gray-600 hover:text-aabb-blue underline"
          >
             Voltar ao Formulário
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
           <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
              <span className="text-gray-500 text-sm font-medium">Total de Propostas</span>
              <p className="text-3xl font-bold text-gray-800">{submissions.length}</p>
           </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
              <span className="text-gray-500 text-sm font-medium">Pendentes</span>
              <p className="text-3xl font-bold text-gray-800">{submissions.filter(s => s.status === 'PENDENTE').length}</p>
           </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
              <span className="text-gray-500 text-sm font-medium">Aprovados</span>
              <p className="text-3xl font-bold text-gray-800">{submissions.filter(s => s.status === 'APROVADO').length}</p>
           </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
           <div className="p-4 border-b border-gray-200 flex items-center gap-3">
              <Search className="text-gray-400" />
              <input 
                 type="text" 
                 placeholder="Buscar por nome, CPF ou Nº da proposta..." 
                 className="flex-1 outline-none text-gray-700"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                    <tr>
                       <th className="p-4">Data</th>
                       <th className="p-4">Proponente</th>
                       <th className="p-4">Plano</th>
                       <th className="p-4">Status</th>
                       <th className="p-4 text-center">Ações</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {filteredSubmissions.length > 0 ? filteredSubmissions.map(sub => (
                       <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 text-sm text-gray-500">
                             <div className="font-medium text-gray-900">{new Date(sub.createdAt).toLocaleDateString('pt-BR')}</div>
                             <div className="text-xs">#{sub.id}</div>
                          </td>
                          <td className="p-4">
                             <div className="font-medium text-gray-900">{sub.fullName}</div>
                             <div className="text-xs text-gray-500">{sub.email}</div>
                          </td>
                          <td className="p-4">
                             <span className={`px-2 py-1 rounded text-xs font-bold ${sub.plan === PlanType.COMUNITARIO ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {sub.plan === PlanType.COMUNITARIO ? 'COMUNITÁRIO' : 'EFETIVO'}
                             </span>
                          </td>
                          <td className="p-4">
                             <span className={`px-2 py-1 rounded text-xs font-bold 
                                ${sub.status === 'PENDENTE' ? 'bg-gray-100 text-gray-600' : ''}
                                ${sub.status === 'APROVADO' ? 'bg-green-100 text-green-600' : ''}
                                ${sub.status === 'REJEITADO' ? 'bg-red-100 text-red-600' : ''}
                             `}>
                                {sub.status}
                             </span>
                          </td>
                          <td className="p-4 flex justify-center gap-2">
                             <button 
                                onClick={() => setSelectedSubmission(sub)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg tooltip"
                                title="Visualizar / Imprimir"
                             >
                                <Printer size={18} />
                             </button>
                             
                             {sub.status === 'PENDENTE' && (
                                <>
                                   <button onClick={() => handleStatus(sub.id, 'APROVADO')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Aprovar">
                                      <Check size={18} />
                                   </button>
                                   <button onClick={() => handleStatus(sub.id, 'REJEITADO')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Rejeitar">
                                      <X size={18} />
                                   </button>
                                </>
                             )}
                             
                             <button 
                                onClick={() => handleDelete(sub.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                title="Excluir"
                             >
                                <Trash2 size={18} />
                             </button>
                          </td>
                       </tr>
                    )) : (
                       <tr>
                          <td colSpan={5} className="p-8 text-center text-gray-500">
                             Nenhuma proposta encontrada.
                          </td>
                       </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
};
