import type {
  Media,
  MediaList,
  MediaListOptions,
  MediaStore,
  MediaUploadOptions,
} from "tinacms";

export class LocalMediaStore implements MediaStore {
  accept = "image/*";

  parse(media: Media): string {
    return media.src || `/${media.directory}/${media.filename}`;
  }

  async persist(files: MediaUploadOptions[]): Promise<Media[]> {
    const uploaded: Media[] = [];

    for (const { directory, file } of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("directory", directory);

      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
      uploaded.push(await res.json());
    }

    return uploaded;
  }

  async delete(media: Media): Promise<void> {
    const params = new URLSearchParams({
      directory: media.directory,
      filename: media.filename,
    });
    const res = await fetch(`/api/media?${params}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
  }

  async list(options?: MediaListOptions): Promise<MediaList> {
    const params = new URLSearchParams();
    if (options?.directory) params.set("directory", options.directory);
    if (options?.limit) params.set("limit", String(options.limit));
    if (options?.offset !== undefined) params.set("offset", String(options.offset));

    const res = await fetch(`/api/media?${params}`);
    if (!res.ok) throw new Error(`List failed: ${res.statusText}`);
    return res.json();
  }
}
