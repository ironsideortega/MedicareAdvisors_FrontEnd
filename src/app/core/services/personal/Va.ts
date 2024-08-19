export interface PDVAModel {
  status:  string;
  code:    number;
  message: string;
  data:    PDVAModelData;
}

export interface PDVAModelData {
  VA_ID:      number;
  ID:         string;
  VaGroup:    string;
  Notes:      string;
  ContactID:  number;
  CreateDate: null;
}
