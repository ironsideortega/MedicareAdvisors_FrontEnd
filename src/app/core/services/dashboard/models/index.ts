export interface KPIContactModel {
  status:  string;
  code:    number;
  message: string;
  data:    DataKPIContact[];
}

export interface DataKPIContact {
  ContactStatusVAlue: string;
  CNT:                number;
}

export interface KPIGenderModel {
  status:  string;
  code:    number;
  message: string;
  data:    DataKPIGender[];
}

export interface DataKPIGender {
  GenderValue: string;
  CNT:         number;
}

