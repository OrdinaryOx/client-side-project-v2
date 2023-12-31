import { Id } from './id.type';
import { IUser } from './user.interface';

export enum ArtworkType {
    painting = "Painting",
    sculpture = "Sculpture",
    photograph = "Photograph",
}

export interface IArtwork {
    _id: Id;
    title: string;
    description: string;
    type: ArtworkType;
    creationDate: Date;
    image: string;
    userId: Id;
    galleryId: Id;
}

export type ICreateArtwork = Pick<
    IArtwork,
    "title" | "description" | "type" | "userId" | "image" | "galleryId" 
>;
export type IUpdateArtwork = Partial<Omit<IArtwork, 'id'>>;
export type IUpsertArtwork = IArtwork;
