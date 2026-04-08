export interface CreateCompanyDTO {
  name: string;
  code: string;
  cnpj: string;
  email: string;
  phone: string;
  plano: 'trial' | 'basico' | 'profissional' | 'enterprise';
  active?: boolean;
}

// O que você recebe do Backend nas listagens e buscas
export interface CompanyResponseDTO extends CreateCompanyDTO {
  id: string;
  data_cadastro: string | Date;
  usuarios_count: number | null;
  consulta_mes: number | null;
  custo_mes: number | null;
  created_at: string | Date;
  updated_at: string | Date;
}