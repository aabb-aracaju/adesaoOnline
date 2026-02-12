import React from 'react';
import { Submission, PlanType } from '../types';

interface PrintTemplateProps {
  data: Submission;
  onClose: () => void;
}

export const PrintTemplate: React.FC<PrintTemplateProps> = ({ data, onClose }) => {
  
  const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR');
  
  return (
    <div className="fixed inset-0 bg-gray-800/90 z-50 overflow-y-auto print:bg-white print:overflow-visible print:absolute print:inset-0">
      
      {/* Botões de controle (ocultos na impressão) */}
      <div className="fixed top-4 right-4 flex gap-4 print:hidden">
        <button 
          onClick={() => window.print()} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg"
        >
          🖨️ Imprimir Ficha
        </button>
        <button 
          onClick={onClose}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg"
        >
          Fechar
        </button>
      </div>

      {/* Folha A4 */}
      <div className="bg-white max-w-[210mm] mx-auto min-h-[297mm] p-[15mm] my-8 shadow-2xl print:shadow-none print:m-0 print:w-full print:max-w-none">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b-2 border-gray-800 pb-4 mb-6">
           <div className="flex items-center gap-4">
              {/* Logo Simulado */}
              <div className="w-16 h-16 bg-blue-800 text-yellow-400 flex items-center justify-center font-bold text-2xl rounded">
                 A
              </div>
              <div>
                 <h1 className="text-2xl font-bold text-gray-900 uppercase">AABB Aracaju</h1>
                 <p className="text-sm text-gray-600">Associação Atlética Banco do Brasil</p>
                 <p className="text-xs text-gray-500">Rod. José Sarney, s/n - Robalo, Aracaju - SE</p>
              </div>
           </div>
           <div className="text-right">
              <h2 className="text-xl font-bold text-gray-800">FICHA DE ADESÃO</h2>
              <p className="text-sm font-mono text-gray-500">Nº PROPOSTA: {data.id}</p>
              <p className="text-sm text-gray-500">Data: {formatDate(data.createdAt)}</p>
           </div>
        </div>

        {/* Dados Principais */}
        <div className="grid grid-cols-4 gap-4 mb-6 text-sm">
           <div className="col-span-3 border border-gray-300 p-2 rounded">
              <span className="block text-xs font-bold text-gray-500 uppercase">Nome Completo</span>
              <span className="font-medium text-gray-900 uppercase">{data.fullName}</span>
           </div>
           <div className="col-span-1 border border-gray-300 p-2 rounded flex flex-col justify-center items-center bg-gray-50">
               <span className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria</span>
               <span className="font-bold text-gray-900 text-center text-xs">
                 {data.plan === PlanType.COMUNITARIO ? 'COMUNITÁRIO' : 'EFETIVO'}
               </span>
           </div>
           
           <div className="col-span-1 border border-gray-300 p-2 rounded">
              <span className="block text-xs font-bold text-gray-500 uppercase">CPF</span>
              <span className="font-medium text-gray-900">{data.cpf}</span>
           </div>
           <div className="col-span-1 border border-gray-300 p-2 rounded">
              <span className="block text-xs font-bold text-gray-500 uppercase">RG</span>
              <span className="font-medium text-gray-900">{data.rg}</span>
           </div>
           <div className="col-span-1 border border-gray-300 p-2 rounded">
              <span className="block text-xs font-bold text-gray-500 uppercase">Nascimento</span>
              <span className="font-medium text-gray-900">{formatDate(data.dob)}</span>
           </div>
           <div className="col-span-1 border border-gray-300 p-2 rounded">
              <span className="block text-xs font-bold text-gray-500 uppercase">Estado Civil</span>
              <span className="font-medium text-gray-900">{data.maritalStatus}</span>
           </div>
        </div>

        {/* Endereço e Contato */}
        <h3 className="text-xs font-bold bg-gray-100 p-1 mb-2 uppercase border-l-4 border-blue-800">Endereço e Contato</h3>
        <div className="grid grid-cols-4 gap-2 mb-6 text-sm">
           <div className="col-span-3 border-b border-gray-200 pb-1">
              <span className="text-gray-500 text-xs mr-2">LOGRADOURO:</span>
              <span className="uppercase">{data.street}, {data.number} {data.complement}</span>
           </div>
           <div className="col-span-1 border-b border-gray-200 pb-1">
              <span className="text-gray-500 text-xs mr-2">BAIRRO:</span>
              <span className="uppercase">{data.neighborhood}</span>
           </div>
           <div className="col-span-2 border-b border-gray-200 pb-1">
              <span className="text-gray-500 text-xs mr-2">CIDADE/UF:</span>
              <span className="uppercase">{data.city} / {data.state}</span>
           </div>
           <div className="col-span-1 border-b border-gray-200 pb-1">
              <span className="text-gray-500 text-xs mr-2">CEP:</span>
              <span>{data.cep}</span>
           </div>
           <div className="col-span-2 border-b border-gray-200 pb-1">
              <span className="text-gray-500 text-xs mr-2">EMAIL:</span>
              <span>{data.email}</span>
           </div>
           <div className="col-span-2 border-b border-gray-200 pb-1">
              <span className="text-gray-500 text-xs mr-2">TELEFONE:</span>
              <span>{data.phone}</span>
           </div>
        </div>

        {/* Profissional */}
        <h3 className="text-xs font-bold bg-gray-100 p-1 mb-2 uppercase border-l-4 border-blue-800">Dados Profissionais</h3>
        <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
           <div className="border border-gray-300 p-2 rounded">
              <span className="block text-xs font-bold text-gray-500 uppercase">Empresa</span>
              <span className="uppercase">{data.employer}</span>
           </div>
           <div className="border border-gray-300 p-2 rounded">
              <span className="block text-xs font-bold text-gray-500 uppercase">Profissão</span>
              <span className="uppercase">{data.profession}</span>
           </div>
           <div className="border border-gray-300 p-2 rounded">
              <span className="block text-xs font-bold text-gray-500 uppercase">Admissão</span>
              <span>{data.admissionDate ? formatDate(data.admissionDate) : '-'}</span>
           </div>
        </div>

        {/* Dependentes */}
        <h3 className="text-xs font-bold bg-gray-100 p-1 mb-2 uppercase border-l-4 border-blue-800">Dependentes</h3>
        <table className="w-full text-sm mb-6 border-collapse border border-gray-300">
          <thead>
             <tr className="bg-gray-50">
                <th className="border border-gray-300 p-1 text-left">Nome</th>
                <th className="border border-gray-300 p-1 text-left w-32">Nascimento</th>
                <th className="border border-gray-300 p-1 text-left w-32">Parentesco</th>
             </tr>
          </thead>
          <tbody>
             {data.dependents.length > 0 ? data.dependents.map(dep => (
                <tr key={dep.id}>
                   <td className="border border-gray-300 p-1 uppercase">{dep.name}</td>
                   <td className="border border-gray-300 p-1">{formatDate(dep.dob)}</td>
                   <td className="border border-gray-300 p-1 uppercase">{dep.relationship}</td>
                </tr>
             )) : (
                <tr>
                   <td colSpan={3} className="border border-gray-300 p-2 text-center text-gray-500 italic">Nenhum dependente declarado.</td>
                </tr>
             )}
          </tbody>
        </table>

        {/* Assinatura */}
        <div className="mt-12 mb-8 flex gap-8">
           <div className="flex-1 flex flex-col items-center">
              {data.signature ? (
                 <img src={data.signature} className="h-16 object-contain mb-1" alt="Assinatura" />
              ) : (
                 <div className="h-16 w-full"></div>
              )}
              <div className="border-t border-gray-800 w-full text-center pt-1">
                 <span className="text-xs uppercase font-bold">{data.fullName}</span>
                 <br />
                 <span className="text-[10px] text-gray-500">Assinatura do Proponente</span>
              </div>
           </div>
           
           <div className="flex-1 flex flex-col items-center justify-end">
              <div className="border-t border-gray-800 w-full text-center pt-1">
                 <span className="text-xs uppercase font-bold">AABB Aracaju</span>
                 <br />
                 <span className="text-[10px] text-gray-500">Visto da Secretaria</span>
              </div>
           </div>
        </div>

        {/* Rodapé Interno */}
        <div className="border-t-2 border-dotted border-gray-300 pt-4 text-[10px] text-gray-400 text-center">
           <p>Este documento foi gerado eletronicamente em {new Date().toLocaleString('pt-BR')}.</p>
           <p>A aprovação desta proposta está sujeita à análise da diretoria da AABB Aracaju.</p>
        </div>
        
        {/* Anexos (Quebra de página) */}
        <div className="break-before-page mt-8 print:block hidden">
           <h3 className="text-lg font-bold uppercase mb-6 border-b pb-2">Anexos - Documentação</h3>
           
           <div className="grid grid-cols-2 gap-6">
               {/* Titular */}
               {data.profilePicture && (
                   <div className="border border-gray-300 p-2">
                       <p className="text-xs font-bold text-center mb-2 bg-gray-100 p-1">FOTO 3x4 TITULAR</p>
                       <img src={data.profilePicture} className="w-full h-64 object-contain" alt="Titular" />
                   </div>
               )}

               {data.personalDocument && (
                   <div className="border border-gray-300 p-2">
                       <p className="text-xs font-bold text-center mb-2 bg-gray-100 p-1">DOCUMENTO (RG/CNH)</p>
                       <img src={data.personalDocument} className="w-full h-64 object-contain" alt="Doc Pessoal" />
                   </div>
               )}

               {data.residenceDocument && (
                   <div className="border border-gray-300 p-2">
                       <p className="text-xs font-bold text-center mb-2 bg-gray-100 p-1">COMPROVANTE RESIDÊNCIA</p>
                       <img src={data.residenceDocument} className="w-full h-64 object-contain" alt="Residência" />
                   </div>
               )}

               {data.marriageDocument && (
                   <div className="border border-gray-300 p-2">
                       <p className="text-xs font-bold text-center mb-2 bg-gray-100 p-1">CERTIDÃO DE CASAMENTO</p>
                       <img src={data.marriageDocument} className="w-full h-64 object-contain" alt="Casamento" />
                   </div>
               )}

               {/* Dependentes */}
               {data.dependents.map((dep, idx) => (
                   <React.Fragment key={dep.id}>
                       {dep.profilePicture && (
                           <div className="border border-gray-300 p-2">
                               <p className="text-xs font-bold text-center mb-2 bg-gray-100 p-1">DEP {idx+1}: {dep.name} (FOTO)</p>
                               <img src={dep.profilePicture} className="w-full h-64 object-contain" alt={`Foto ${dep.name}`} />
                           </div>
                       )}
                       {dep.cpfDocument && (
                           <div className="border border-gray-300 p-2">
                               <p className="text-xs font-bold text-center mb-2 bg-gray-100 p-1">DEP {idx+1}: {dep.name} (CPF)</p>
                               <img src={dep.cpfDocument} className="w-full h-64 object-contain" alt={`CPF ${dep.name}`} />
                           </div>
                       )}
                   </React.Fragment>
               ))}
           </div>
        </div>

      </div>
    </div>
  );
};