import type { ApiMessageEnvelope } from "../api/types";

export interface Serializer {
  serialize(message: ApiMessageEnvelope): Uint8Array;
  deserialize(data: Uint8Array): ApiMessageEnvelope;
}
