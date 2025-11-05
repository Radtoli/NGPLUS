import { MediaCategory } from "../enums/MediaCategory";

export interface CreateMediaDTO {
  title: string;
  description: string;
  category: MediaCategory;
  thumbnail_url: string;
  content_url: string;
}
