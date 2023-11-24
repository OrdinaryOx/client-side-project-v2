import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtworkService } from '../artwork.service';
import { ArtworkType, IArtwork } from '@client-side-project/shared/api';
import { IUser } from '@client-side-project/shared/api';
import { GalleryService } from '../../gallery/gallery.service';

@Component({
  selector: 'client-side-project-artwork-edit',
  templateUrl: './artwork-edit.component.html',
  styleUrls: ['./artwork-edit.component.css'],
})
export class ArtworkEditComponent implements OnInit {
  id = '';
  title = '';
  description = '';
  type = 'undefined';
  creationDate = '';
  image = '';

  isEditing = false; // Add a flag to track if editing or creating

  constructor(
    private route: ActivatedRoute,
    private artworkService: ArtworkService,
    private galleryService: GalleryService,
    private router: Router,
  ) { }

  private artwork!: IArtwork;

  ngOnInit() {
    const galleryId = this.route.snapshot.paramMap.get('id');
    console.log(galleryId, "galleryId");
    
    const url = window.location.protocol + '//' + window.location.host + window.location.pathname;
    
    if (url.includes("artwork")) {
      this.isEditing = true;
      // this.artworkService.read(artworkId).subscribe((artwork: IArtwork) => {
      //   this.artwork = artwork;
      //   this.title = artwork.title;
      //   this.description = artwork.description;
      //   this.type = artwork.type;
      //   this.creationDate = artwork.creationDate.toString();
      //   this.image = artwork.image;
      // });
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
    
    const newArtwork: IArtwork = {
      id: 'undefined',
      title: this.title,
      description: this.description,
      type: this.type as ArtworkType,
      creationDate: new Date(),
      image: this.image,
      user: null,
    };
    
    this.artworkService.createArtwork(newArtwork).subscribe(() => {
      const galleryId = this.route.snapshot.paramMap.get('id');
      if (galleryId) {
        //get gallery by id? 
        
        // this.galleryService.updateGallery(newArtwork.id, galleryId).subscribe(() => {
          this.router.navigate(['/gallery', galleryId]);
        // });
      }
    });
  }

  updateArtwork() {
    console.log("updating artwork clicked in artwork-edit.component.ts", "TAG");

    console.log(this.title, "title");
    const updatedArtwork: IArtwork = {
      id: this.artwork.id,
      title: '',
      description: '',
      type: ArtworkType.painting,
      creationDate: new Date(),
      image: '',
      user: null
    };

    console.log(updatedArtwork)
    this.artworkService.updateArtwork(updatedArtwork).subscribe(() => {
      this.router.navigate(['/gallery']);
    });
  }

}