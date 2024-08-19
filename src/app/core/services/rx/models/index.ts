export interface RxModel {
  drugGroup: DrugGroup;
}

export interface DrugGroup {
  name:         null;
  conceptGroup: ConceptGroup[];
}

export interface ConceptGroup {
  tty:                string;
  conceptProperties?: ConceptProperty[];
}

export interface ConceptProperty {
  rxcui:    string;
  name:     string;
  synonym:  string;
  tty:      string;
  language: string;
  suppress: string;
  umlscui:  string;
}

export interface RxPackageModel {
  ndcPropertyList: NdcPropertyList;
}

export interface NdcPropertyList {
  ndcProperty: NdcProperty[];
}

export interface NdcProperty {
  ndcItem:             string;
  ndc9:                string;
  ndc10:               string;
  rxcui:               string;
  splSetIdItem:        string;
  packagingList:       PackagingList;
  propertyConceptList: PropertyConceptList;
  source:              string;
}

export interface PackagingList {
  packaging: string[];
}

export interface PropertyConceptList {
  propertyConcept: PropertyConcept[];
}

export interface PropertyConcept {
  propName:  string;
  propValue: string;
}

export interface DrugFrequencyModel {
  status:  string;
  code:    number;
  message: string;
  data:    DrugFrequencyData[];
}

export interface DrugFrequencyData {
  FrequencyID:   number;
  FrequencyName: string;
  CreatedDate:   null;
}


export interface PrescriptionsModel {
  status:  string;
  code:    number;
  message: string;
  data:    PrescriptionsData[];
}

export interface PrescriptionsData {
  PrescriptionsID: number;
  CreatedDate:     null;
  DrugName:        string;
  Dosage:          string;
  Package:         string;
  Quantity:        number;
  FrequencyID:     number;
  Note:            string;
  ContactID:       number;
}

export interface HealthInfoModel {
  status:  string;
  code:    number;
  message: string;
  data:    HealthInfoData;
}

export interface HealthInfoData {
  ContactID:        number;
  HealthFeet:           number;
  HealthInches:          number;
  HealthWeight:           number;
  HealthDNR:         boolean;
  HealthNotes:          string;
  CreatedDate?:      null;
}


