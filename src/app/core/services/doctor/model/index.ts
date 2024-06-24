export interface ProviderModel {
  result_count: number;
  results:      Result[];
}

export interface Result {
  created_epoch:      string;
  enumeration_type:   string;
  last_updated_epoch: string;
  number:             string;
  addresses:          Address[];
  practiceLocations:  any[];
  basic:              Basic;
  taxonomies:         Taxonomy[];
  identifiers:        any[];
  endpoints:          any[];
  other_names:        OtherName[];
}

export interface Address {
  country_code:      string;
  country_name:      string;
  address_purpose:   string;
  address_type:      string;
  address_1:         string;
  city:              string;
  state:             string;
  postal_code:       string;
  telephone_number?: string;
  address_2?:        string;
}

export interface Basic {
  first_name:       string;
  last_name:        string;
  middle_name:      string;
  sole_proprietor:  string;
  gender:           string;
  enumeration_date: Date;
  last_updated:     Date;
  status:           string;
  name_prefix:      string;
  credential?:      string;
  name_suffix?:     string;
}

export interface OtherName {
  type:        string;
  code:        string;
  first_name:  string;
  last_name:   string;
  middle_name: string;
  prefix?:     string;
  suffix?:     string;
}

export interface Taxonomy {
  code:           string;
  taxonomy_group: string;
  desc:           string;
  state:          null | string;
  license:        null;
  primary:        boolean;
}

export interface DoctorModel {
  status:  string;
  code:    number;
  message: string;
  data:    DoctorData[];
}

export interface DoctorData {
  ProviderID:              number;
  LastName:                string;
  FirstName:               string;
  PracticeFacilityName:    string;
  ProviderPhone:           string;
  FacilityAddress:         string;
  Notes:                   string;
  Networks:                string;
  ProviderSpecialtyAPI:    string;
  ProviderSpecialtyID:     null;
  ProviderStatusID:        null;
  ProviderImportanceID:    null;
  ContactID:               number;
  Source:                  boolean;
  ProviderImportanceValue: null;
  ProviderSpecialtyValue:  null;
  ProviderStatusValue:     null;
}


export interface DoctorStatusModel {
  status:  string;
  code:    number;
  message: string;
  data:    DataStatus[];
}

export interface DataStatus {
  ProviderStatusID:    number;
  ProviderStatusValue: string;
  CreatedDate:         Date;
}

export interface DoctorImportanceModel {
  status:  string;
  code:    number;
  message: string;
  data:    DataImportance[];
}

export interface DataImportance {
  ProviderImportanceID:    number;
  ProviderImportanceValue: string;
  CreatedDate:             Date;
}

export interface DoctorSpecialtyModel {
  status:  string;
  code:    number;
  message: string;
  data:    DataSpecialty[];
}

export interface DataSpecialty {
  ProviderSpecialtyID:    number;
  ProviderSpecialtyValue: string;
  CreatedDate:            Date;
}




