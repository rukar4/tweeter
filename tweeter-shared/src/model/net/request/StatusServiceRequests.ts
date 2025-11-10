import { AuthenticatedRequest } from "./TweeterRequests";
import { StatusDto } from "../../dto/StatusDto";

export interface PostStatusRequest extends AuthenticatedRequest {
  readonly newStatus: StatusDto
}