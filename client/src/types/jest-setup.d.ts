interface MockTextEncoder {
  encode(input: string): Uint8Array;
}

interface MockTextDecoder {
  decode(input?: BufferSource): string;
}

declare global {
  var TextEncoder: {
    new (): MockTextEncoder;
    prototype: MockTextEncoder;
  };
  var TextDecoder: {
    new (): MockTextDecoder;
    prototype: MockTextDecoder;
  };
}

export {};
