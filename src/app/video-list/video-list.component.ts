import { Component, OnInit } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorage, AngularFireStorageReference} from '@angular/fire/storage';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css']
})


export class VideoListComponent implements OnInit {
  files: string[];
  videoUrl: string;
  isVideoAvailable: boolean;

  constructor(private storage: AngularFireStorage) {
    this.files = [];
    this.videoUrl = '';
    this.isVideoAvailable = false;

    // TODO remove
    this.files.push('first');
   }

  getVideoList() {
    const ref = this.storage.ref('');
    ref.listAll().subscribe((res) => {
      // console.log(res)
      this.files.forEach(file => console.log(file));

      this.files = [];
      res.items.forEach(item => this.files.push(item.name));
      console.log('first:', this.files[0]);
      console.log('last:', this.files[this.files.length-1]);
    });
  }

  ngOnInit(): void {
    console.log('onInit');
    this.getVideoList();
  }

  onGetFiles() {
    console.log('onGetFiles');
    this.getVideoList();
  }

  onShowUrl() {
    console.log("URL", this.videoUrl);
    this.isVideoAvailable = true;
  }

  onSetVideo() {
    if (this.files.length > 0) {
      console.log(this.files[0]);
      this.storage.ref(this.files[0]).getDownloadURL().subscribe((res) => {
        console.log(res);
        this.videoUrl = res;
        console.log(this.videoUrl);
      });
    } else {
      console.log("no video available")
    }
  }

}
