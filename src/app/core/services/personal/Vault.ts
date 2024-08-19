export interface PDVaultModel {
  status:  string;
  code:    number;
  message: string;
  data:    PDVaultModelData;
}

export interface PDVaultModelData {
  VAULT_ID:   number;
  Notes:      string;
  CreateDate: null;
  ContactID:  number;
}
