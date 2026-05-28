import { describe, it, expect } from "vitest";
import {
  validateImageFile,
  MAX_IMAGE_BYTES,
  ALLOWED_IMAGE_MIME_TYPES,
} from "../app/lib/listings/image-validation";

/**
 * Build a fake File. The body content doesn't matter — only `size` and `type`
 * matter to the validator. We pad with a Uint8Array of the requested size.
 */
function makeFile(
  sizeBytes: number,
  mimeType: string,
  name = "photo.jpg",
): File {
  const padding = new Uint8Array(sizeBytes);
  return new File([padding], name, { type: mimeType });
}

describe("validateImageFile — empty input", () => {
  it("returns null for null", () => {
    expect(validateImageFile(null)).toBeNull();
  });

  it("returns null for undefined", () => {
    expect(validateImageFile(undefined)).toBeNull();
  });

  it("returns null for a zero-byte file (no upload selected)", () => {
    expect(validateImageFile(makeFile(0, "image/jpeg"))).toBeNull();
  });
});

describe("validateImageFile — MIME check", () => {
  it.each(ALLOWED_IMAGE_MIME_TYPES)("accepts %s", (mime) => {
    expect(validateImageFile(makeFile(1024, mime))).toBeNull();
  });

  it("rejects image/svg+xml", () => {
    const err = validateImageFile(makeFile(1024, "image/svg+xml"));
    expect(err).not.toBeNull();
    expect(err).toContain("Unsupported");
  });

  it("rejects application/pdf", () => {
    expect(validateImageFile(makeFile(1024, "application/pdf"))).toContain(
      "Unsupported",
    );
  });

  it("rejects an empty MIME type", () => {
    expect(validateImageFile(makeFile(1024, ""))).toContain("Unsupported");
  });
});

describe("validateImageFile — size check", () => {
  it("accepts a file exactly at the limit", () => {
    expect(
      validateImageFile(makeFile(MAX_IMAGE_BYTES, "image/jpeg")),
    ).toBeNull();
  });

  it("rejects a file 1 byte over the limit", () => {
    const err = validateImageFile(makeFile(MAX_IMAGE_BYTES + 1, "image/jpeg"));
    expect(err).not.toBeNull();
    expect(err).toContain("too large");
  });
});

describe("validateImageFile — error precedence", () => {
  it("reports MIME first when both are wrong", () => {
    // 50 MB SVG — fails both checks. The MIME message is more actionable,
    // so it should win.
    const err = validateImageFile(
      makeFile(MAX_IMAGE_BYTES + 1, "image/svg+xml"),
    );
    expect(err).toContain("Unsupported");
    expect(err).not.toContain("too large");
  });
});
