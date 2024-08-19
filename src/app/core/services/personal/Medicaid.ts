export interface PDMedicaidModel {
  status:  string;
  code:    number;
  message: string;
  data:    PDMedicaidModelData;
}

export interface PDMedicaidModelData {
  Medicaid_ID:         number;
  Medicaid_No:         string;
  Medicaid_Plan:       string;
  CreateDate:          null;
  Renewal:             Date;
  Note:                string;
  ContactID:           number;
  Assistance_Level_ID: number;
}
