export interface SPAPModel {
  status:  string;
  code:    number;
  message: string;
  data:    SPapModelData;
}

export interface SPapModelData {
  SPAP_ID:    number;
  SpapName:   string;
  MemberID:   number;
  GroupID:    number;
  RxBin:      string;
  Notes:      string;
  ContactID:  number;
  CreateDate: null;
}
