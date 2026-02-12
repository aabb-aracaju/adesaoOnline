
export enum PlanType {
  COMUNITARIO = 'COMUNITARIO',
  EFETIVO = 'EFETIVO'
}

export interface Dependent {
  id: string;
  name: string;
  dob: string;
  relationship: string;
  profilePicture?: string | null;
  cpfDocument?: string | null; // Novo campo
}

export interface FormData {
  plan: PlanType | null;
  // Personal
  profilePicture: string | null;
  fullName: string;
  cpf: string;
  rg: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  personalDocument: string | null; // CNH ou RG (Frente/Verso ou apenas frente)
  marriageDocument: string | null; // Certidão de Casamento
  
  // Contact & Address
  email: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  residenceDocument: string | null; // Comprovante de Residência

  // Professional
  employer: string;
  profession: string;
  admissionDate: string;
  // Dependents
  dependents: Dependent[];
  // Signature
  signature: string | null;
}

export interface Submission extends FormData {
  id: string;
  createdAt: string; // ISO Date
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
}

export const INITIAL_DATA: FormData = {
  plan: null,
  profilePicture: null,
  fullName: '',
  cpf: '',
  rg: '',
  dob: '',
  gender: '',
  maritalStatus: '',
  personalDocument: null,
  marriageDocument: null,
  email: '',
  phone: '',
  cep: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  residenceDocument: null,
  employer: '',
  profession: '',
  admissionDate: '',
  dependents: [],
  signature: null
};

export type StepProps = {
  data: FormData;
  updateData: (fields: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
};
