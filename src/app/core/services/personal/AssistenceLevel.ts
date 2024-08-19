export interface PDAssistenceLevelModel {
  status:  string;
  code:    number;
  message: string;
  data:    PDAssistenceLevelModelData[];
}

export interface PDAssistenceLevelModelData {
  Assistance_Level_ID:    number;
  Assistance_Level_Value: string;
  CreatedDate:            null;
}
