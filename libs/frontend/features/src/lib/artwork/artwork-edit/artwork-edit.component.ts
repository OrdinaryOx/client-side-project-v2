import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtworkService } from '../artwork.service';
import { ArtworkType, IArtwork, IGallery } from '@client-side-project/shared/api';
import { IUser } from '@client-side-project/shared/api';
import { GalleryService } from '../../gallery/gallery.service';
import { Types } from 'mongoose';

@Component({
  selector: 'client-side-project-artwork-edit',
  templateUrl: './artwork-edit.component.html',
  styleUrls: ['./artwork-edit.component.css'],
})
export class ArtworkEditComponent implements OnInit {
  
  userString = localStorage.getItem('user');
  user = this.userString ? JSON.parse(this.userString) : undefined;
  id = this.user._id;

  
 
  title = '';
  description = '';
  type = 'undefined';
  creationDate = '';
  image = '';




// userString = localStorage.getItem('user');
// user = this.userString ? JSON.parse(this.userString) : undefined;


  isEditing = false; // Add a flag to track if editing or creating


  //add galleryId to artwork?
  galleryid = '';

 // galleryId = this.route.snapshot.paramMap.get('id');
  constructor(
    private route: ActivatedRoute,
    private artworkService: ArtworkService,
    private galleryService: GalleryService,
    private router: Router,
  ) { }

  // gallery = this.galleryService.read(this.galleryId).subscribe((gallery: any) => {});

  private artwork!: IArtwork;
galleryId = '';
  ngOnInit() {
    const artworkId = this.route.snapshot.paramMap.get('id');
    const url = window.location.protocol + '//' + window.location.host + window.location.pathname;

    if (url.includes("artwork") && artworkId) {


      this.isEditing = true;
      this.artworkService.read(artworkId).subscribe((artwork: IArtwork) => {
        this.artwork = artwork;
        this.title = artwork.title;
        this.description = artwork.description;
        this.type = artwork.type;
        this.creationDate = artwork.creationDate.toString();
        this.image = artwork.image;
      });
    }
  }
  
  saveArtwork() {
    console.log("Save artwork clicked", "tag");
    console.log(this.isEditing, "tag");
    if (this.isEditing) {
      this.updateArtwork();
    } else {
      this.createArtwork();
    }
  }

  createArtwork() {
    console.log("creating artwork clicked in artwork-edit.component.ts", "TAG");

    // Get the gallery ID from the route parameter
    const galleryId = this.route.snapshot.paramMap.get('id');
this.galleryId = galleryId!;
    // Create a new artwork object
    const newArtwork: IArtwork = {
      _id: new Types.ObjectId().toString(),
      title: this.title,
      description: this.description,
      type: this.type as ArtworkType,
      creationDate: new Date(),
      image: this.image,
      userId: this.id,
      galleryId: this.galleryId
    };

    // Add the artwork to the database
    this.artworkService.createArtwork(newArtwork).subscribe((result: any) => {

      console.log(result, "result");
      //pak de gallery
      this.galleryService.read(galleryId).subscribe((gallery: IGallery) => {
        //add artwork to gallery
        gallery.artworks!.push(result); 
        //update gallery
        this.galleryService.updateGallery(gallery).subscribe(() => {
          this.router.navigate(['/gallery', galleryId]);
        });
      });
    });
  }

    


  updateArtwork() {
    console.log("updating artwork clicked in artwork-edit.component.ts", "TAG");

    console.log(this.title, "title");

    const updatedArtwork: IArtwork = {
      _id: this.artwork._id,
      title: this.title,
      description: this.description,
      type: this.type as ArtworkType,
      creationDate: this.artwork.creationDate,
      image: this.image,
      userId: this.artwork.userId,
      galleryId: this.artwork.galleryId
    };

    console.log(updatedArtwork, "UPDATED ARTWORK")
    this.artworkService.updateArtwork(updatedArtwork).subscribe(() => {
      this.router.navigate(['/gallery']);
    });

    this.galleryService.read(this.artwork.galleryId).subscribe((gallery: IGallery) => {
      // Update the artwork in the gallery
    
      const artworkIndex = gallery.artworks!.findIndex((artwork: IArtwork) => artwork._id === updatedArtwork._id);
      if (artworkIndex !== -1) {
        gallery.artworks![artworkIndex] = updatedArtwork;
      }
      console.log(artworkIndex, "artworkIndex");
      console.log(gallery.artworks, "gallery.artworks");

      // Update the gallery
      this.galleryService.updateGallery(gallery).subscribe(() => {
        this.router.navigate(['/gallery', this.artwork.galleryId]);
      });
    });
  }

}