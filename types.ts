
export type Mode = 'generate' | 'edit';

export interface GeneratedImage {
  id: string;
  src: string;
  prompt: string;
}
