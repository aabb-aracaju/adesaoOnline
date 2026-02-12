import { FormData, Submission } from '../types';

const STORAGE_KEY = 'aabb_submissions_db';

export const saveSubmission = (data: FormData): Submission => {
  try {
    const submissions = getSubmissions();
    
    const newSubmission: Submission = {
      ...data,
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      createdAt: new Date().toISOString(),
      status: 'PENDENTE'
    };

    submissions.unshift(newSubmission); // Adiciona no início
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    
    return newSubmission;
  } catch (error) {
    console.error("Erro ao salvar no LocalStorage:", error);
    if (error instanceof DOMException && 
        (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
       throw new Error("Limite de armazenamento do navegador excedido. Tente usar fotos menores.");
    }
    throw error;
  }
};

export const getSubmissions = (): Submission[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Erro ao ler dados:", e);
    return [];
  }
};

export const deleteSubmission = (id: string) => {
  const submissions = getSubmissions().filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
};

export const updateSubmissionStatus = (id: string, status: 'APROVADO' | 'REJEITADO') => {
    const submissions = getSubmissions().map(s => 
        s.id === id ? { ...s, status } : s
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
};