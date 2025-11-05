import { MediaCategory } from "../enums/MediaCategory";

export interface UpdateMediaDTO {
  title?: string;
  description?: string;
  category?: MediaCategory;
  thumbnail_url?: string;
  content_url?: string;
}
