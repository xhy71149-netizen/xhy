export interface FileWithPreview {
  file: File;
  previewUrl: string;
  base64?: string;
}

export interface ClipResult {
  originalName: string;
  suggestedName: string;
  reasoning: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  PREPARING = 'PREPARING',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface AnalysisError {
  message: string;
}
