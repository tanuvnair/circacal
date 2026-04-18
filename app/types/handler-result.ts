// Shared type for loader/action return values
export type HandlerStatus = "success" | "error";

export interface HandlerResult {
  status: HandlerStatus;
  message?: string;
  data?: any;
}

export interface LoaderResult extends HandlerResult {}

export interface ActionResult extends HandlerResult {}
