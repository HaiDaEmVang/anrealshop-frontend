export interface ItemError {
  field: string;
  message: string;
}

export interface ErrorResponseDto {
  code: string;
  message: string;
  timestamp: string;
  traceId?: string;
  details?: Array<ItemError>;
}