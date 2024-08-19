export interface SocialModel {
  status:  string;
  code:    number;
  message: string;
  data:    SocialData[];
}

export interface SocialData {
  SSN_DL_ID:        number;
  SSN:              string;
  DL:               string;
  CreateDate:       null;
  Household_Income: string;
  IRMAA:            boolean;
  Notes:            string;
  ContactID:        number;
}
