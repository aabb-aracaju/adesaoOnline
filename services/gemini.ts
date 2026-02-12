import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_INSTRUCTION = `
Você é o assistente virtual da AABB Aracaju (Associação Atlética Banco do Brasil).
Seu objetivo é ajudar potenciais associados a preencherem o formulário de adesão.

INFORMAÇÕES IMPORTANTES:
1. Categorias de Associação:
   - Comunitário Família: Para a comunidade em geral.
     * Valor mensal: R$ 184,00.
     * Taxa de Adesão: R$ 600,00 (Pode ser parcelada em 3x com entrada de R$ 200,00).
     * Benefícios: Acesso total ao clube, inclusão de dependentes, não precisa ser funcionário do BB, retirada de convites.
   
   - Efetivo Família: Exclusivo para funcionários do Banco do Brasil (da ativa ou aposentados).
     * Valor mensal: R$ 129,00.
     * Taxa de Adesão: ISENTA.
     * Cobrança: Débito todo dia 20.
     * Benefícios: Desconto exclusivo, acesso a toda rede AABB.

2. Documentos Necessários:
   - Titular: Foto 3x4, RG/CNH, Comprovante de Residência, Certidão de Casamento (se casado).
   - Dependentes: Foto 3x4 (opcional), CPF (obrigatório).
   - Para Efetivos: Comprovante de vínculo com o Banco do Brasil.

3. Benefícios Gerais:
   - Acesso ao clube, piscinas, quadras de esportes, áreas de lazer, eventos sociais.

4. Passos do Formulário:
   - Passo 1: Escolha do Plano.
   - Passo 2: Dados Pessoais (com upload de documentos e foto).
   - Passo 3: Endereço e Contato (com comprovante de residência).
   - Passo 4: Dados Profissionais.
   - Passo 5: Dependentes (com regras de idade e upload de CPF).
   - Passo 6: Revisão e Assinatura Digital.

Seja cordial, breve e direto. Use formatação Markdown simples.
Se o usuário perguntar algo fora do contexto da AABB, gentilmente traga-o de volta ao assunto.
`;

export const sendMessageToGemini = async (message: string, history: { role: 'user' | 'model'; parts: { text: string }[] }[]) => {
  if (!API_KEY) {
    return "Erro: Chave de API não configurada. Por favor, verifique o ambiente.";
  }

  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "Desculpe, estou tendo dificuldades para responder no momento. Tente novamente mais tarde.";
  }
};