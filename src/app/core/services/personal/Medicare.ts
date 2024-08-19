export interface MedicareModel {
  status:  string;
  code:    number;
  message: string;
  data:    MedicareData;
}

export interface MedicareData {
  Medicare_ID:          number;
  MedicareNumber:       string;
  PartAEffective:       Date;
  CreateDate:           null;
  PartBEffective:       Date;
  MedicareGov_UserName: string;
  ContactID:            number;
  MedicareGov_Password: string;
  MedicareGov_Answer:   string;
}
