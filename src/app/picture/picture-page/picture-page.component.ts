import { Component, OnInit, OnDestroy } from '@angular/core';
import { PictureService } from '../picture.service';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject, identity } from '../../../../node_modules/rxjs';
import { environment } from '../../../environments/environment';
// import { FormBuilder, Validators } from '../../../../node_modules/@angular/forms';


const MEDIA_URL = environment.MEDIA_URL;

export interface IDriverSchedule {
  _id?: string;
  name: string;
  url: string;
  created: Date;
  modified: Date;
}

@Component({
  selector: 'app-picture-page',
  templateUrl: './picture-page.component.html',
  styleUrls: ['./picture-page.component.scss']
})
export class PicturePageComponent implements OnInit, OnDestroy {
  onDestroy$ = new Subject();

  pictures;
  mediaUrl;
  form;
  urls;
  pictureName;
  uploadUrl: string = environment.API_URL + 'files/upload';



  constructor(
    private pictureSvc: PictureService,
    // private fb: FormBuilder
  ) {
    this.mediaUrl = environment.MEDIA_URL;
    this.pictureSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe(ps => {
      this.pictures = ps.filter(x => x !== '.DS_Store');
    });
    // this.form = this.createForm();
  }

  ngOnInit() {

  }

  // createForm() {
  //   return this.fb.group({
  //     name: ['', [Validators.required, Validators.minLength(3)]],
  //   });
  // }
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onAfterPictureUpload(e: any) {
    // this.product.pictures = [{ fname: e.fname, url: e.fname }];
    // this.file = e.file;
    this.urls = [MEDIA_URL + e.fname]; // show image in uploader
    // this.afterUpload.emit();
    this.pictureName = e.fname;
    // const doc =
    // this.pictureSvc.save({name: e.fname, url: this.urls[0]}).pipe(takeUntil(this.onDestroy$)).subscribe((r) => {

    // });
  }

  onRemoved(event) {
    // this.product.pictures.splice(this.product.pictures.findIndex(pic => pic.url === event.file.src));
  }
}
