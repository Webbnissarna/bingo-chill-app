import protobuf from "protobufjs";
import type { Serializer } from "./types";
import type { ApiMessageEnvelope } from "../api/types";

export default class ProtobufSerializer implements Serializer {
  private protoRoot: protobuf.Root | null;

  constructor() {
    this.protoRoot = null;
  }

  load(protoFileContents: string): void {
    const parsed = protobuf.parse(protoFileContents);
    this.protoRoot = parsed.root;
  }

  serialize(message: ApiMessageEnvelope): Uint8Array {
    if (!this.protoRoot) throw new Error("not loaded");

    const envelopeType = this.protoRoot.lookupType("ApiMessageEnvelope");
    const envelope = envelopeType.create(message);
    return envelopeType.encode(envelope).finish();
  }

  deserialize(data: Uint8Array): ApiMessageEnvelope {
    if (!this.protoRoot) throw new Error("not loaded");

    const envelopeType = this.protoRoot.lookupType("ApiMessageEnvelope");
    const envelope = envelopeType.decode(data);
    return envelopeType.toObject(envelope) as ApiMessageEnvelope;
  }
}
