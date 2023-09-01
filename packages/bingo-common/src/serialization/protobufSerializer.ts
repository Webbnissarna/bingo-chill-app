import protobuf from "protobufjs";
import type { MessageEnvelope, Serializer } from "./types";

export default class ProtobufSerializer implements Serializer {
  private protoRoot: protobuf.Root | null;

  constructor() {
    this.protoRoot = null;
  }

  load(protoFileContents: string): void {
    const parsed = protobuf.parse(protoFileContents);
    this.protoRoot = parsed.root;
  }

  serialize(message: MessageEnvelope): Uint8Array {
    if (!this.protoRoot) throw new Error("not loaded");

    const envelopeType = this.protoRoot.lookupType("MessageEnvelope");
    const envelope = envelopeType.create(message);
    return envelopeType.encode(envelope).finish();
  }

  deserialize(data: Uint8Array): MessageEnvelope {
    if (!this.protoRoot) throw new Error("not loaded");

    const envelopeType = this.protoRoot.lookupType("MessageEnvelope");
    const envelope = envelopeType.decode(data);
    return envelopeType.toObject(envelope) as MessageEnvelope;
  }
}
