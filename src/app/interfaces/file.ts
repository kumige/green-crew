export interface IPic {
  file_id: number;
  filename: string;
  filesize: number;
  title: string;
  description: string;
  user_id: number;
  media_type: string;
  mime_type: string;
  time_added: string;
  screenshot?: string;
  thumbnails?: IThumbnail;
  favourited?: Boolean;
}

export interface IThumbnail {
  w160: string;
  w320?: string;
  w640?: string;
}

export interface IDesc {
  name: string;
  ingredients: IIng;
  instructions: string;
}

export interface IIng {
  name: string;
  amount: string;
}
