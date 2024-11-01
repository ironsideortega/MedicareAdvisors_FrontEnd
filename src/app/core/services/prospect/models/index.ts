export interface ContactDataResponse {
  status: string;
  code: number;
  message: string;
  data: ContactData;
}

export interface ContactData {
  ContactID: number;
  FirstName: string;
  LastName: string;
  NickName: string | null;
  MiddleName: string | null;
  DOB: string | null;
  Ocupation: string | null;
  SpouseFirstName: string | null;
  SpouseLastName: string | null;
  FunFacts: string | null;
  GenderValue: string | null;
  TitleValue: string | null;
  ContactStatusID: string | null;
  ContactStatusValue: string | null;
  SourceID: string | null;
  ReferredBy: string | null;
  suffixValue: string | null;
  specialDesignationValue: string | null;
  MaritalStatusID: string | null;
  GenderID: string | null;
  TitleID: string | null;
  suffixID: string | null;
  preferredLanguageID: string | null;
  specialDesignationID: string | null;
  Email: { emailAddress: string }[]; // arreglo de correos electrónicos
  Phone: {
    PhoneNumber: string;
    phoneTypeValue: string;
    isPreferredPhone: boolean;
  }[]; // arreglo de números de teléfono
  Address: {
    street: string;
    zip: string;
    city: string;
    state: string;
    country: string;
    addressTypeId: number;
    addressTypeValue: string;
    isPreferredAddress: boolean;
  }[]; // arreglo de direcciones
}


export interface PhoneDataResponse {
  status: string;
  code: number;
  message: string;
  data: Phone[];
}

export interface Phone {
  PhoneID: number;
  PhoneTypeID: number;
  IsPreferredPhone: boolean
  PhoneNumber: string;
  PhoneTypeValue: string;
}

export interface EmailDataResponse {
  status: string;
  code: number;
  message: string;
  data: Email[];
}

export interface Email {
  EmailID: number;
  EmailTypeID: number;
  EmailTypeValue: string;
  IsPreferredEmail: boolean
  EmailAddressValue: string;
}

export interface Address {
  Street: string;
  City: string;
  Country: string;
  IsPreferredAddress: boolean;
  StateAbbreviation: string;
  AddressTypeValue: string;
  AddressTypeID: number;
  ContactID: number;
  stateID: number;
  stateNameVAlue: string;
  Zip: string;
  ContactAddressID: number;
}
