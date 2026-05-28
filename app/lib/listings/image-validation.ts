// Centralized image-upload guard.
//
// Lives in `app/lib/` (not under `server-only`) so it can be reused on the
// client for "as you type" feedback if desired. The server still re-runs it
// because client validation is never trustworthy.

/** Max upload size in bytes. 5 MB is plenty for a listing photo. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Friendly version of MAX_IMAGE_BYTES — used in error messages and UI hints. */
export const MAX_IMAGE_LABEL = "5 MB";

/**
 * Allowed MIME types. Keep this list short and explicit — `image/*` would
 * accept SVG, AVIF, BMP, ICO, etc., which we don't want to render or store.
 *
 * - JPEG / PNG / WebP: standard photo formats
 * - GIF: harmless if someone uploads one; renders fine
 */
export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export type AllowedImageMimeType = (typeof ALLOWED_IMAGE_MIME_TYPES)[number];

/** Comma-separated value for `<input accept="...">`. */
export const ALLOWED_IMAGE_ACCEPT_ATTR = ALLOWED_IMAGE_MIME_TYPES.join(",");

/**
 * Validate a File against the size + MIME guard.
 *
 * Returns an error message if the file is invalid, or `null` if it's fine.
 * Treats "no file selected" (null/undefined or 0 bytes) as valid — the upload
 * itself is optional. Callers should still skip the upload when `file` is empty.
 */
export function validateImageFile(
  file: File | null | undefined,
): string | null {
  // No file at all: not an error — upload is optional.
  if (!file || file.size === 0) {
    return null;
  }

  // 1) MIME check. Some browsers send empty `type` for unknown formats;
  //    treat that as a rejection rather than a pass.
  if (
    !file.type ||
    !ALLOWED_IMAGE_MIME_TYPES.includes(file.type as AllowedImageMimeType)
  ) {
    return `Unsupported image format. Allowed: JPEG, PNG, WebP, GIF.`;
  }

  // 2) Size check. The MIME check runs first so the user gets the more
  //    actionable error if they uploaded e.g. a 50 MB SVG.
  if (file.size > MAX_IMAGE_BYTES) {
    return `Image is too large. Maximum size is ${MAX_IMAGE_LABEL}.`;
  }

  return null;
}
