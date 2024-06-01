import { UserInterface } from "../users/userTypes";

export interface BookInterface {
  _id: string;
  title: string;
  author: UserInterface;
  genre: string;
  coverImage: string;
  file: string;
  createdAt: Date;
  updatedAt: Date;
}
