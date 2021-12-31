import { Component, OnInit } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorage, AngularFireStorageReference} from '@angular/fire/storage';

type Video = {
  name: string;
  date: string;
  time: string;
  downloadUrl: string;
};

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css']
})

export class VideoListComponent implements OnInit {
  files: string[]; // TODO replace with videoList
  videoUrl: string;
  videoList: Video[];
  isVideoAvailable: boolean;

  constructor(private storage: AngularFireStorage) {
    this.files = [];
    this.videoUrl = '';
    this.isVideoAvailable = false;

    // TODO remove
    this.files.push('first');
   }

  getVideoList() {
    this.videoList = [];
    const ref = this.storage.ref('');
    ref.listAll().subscribe((res) => {
      res.items.forEach(item =>  {
        let video: Video = {
          name: item.name,
          date: '',
          time: '',
          downloadUrl: ''
        };
        //console.log(video);
        this.storage.ref(video.name).getDownloadURL().subscribe((url) => {
          video.downloadUrl = url;
          this.videoList.push(video);
          //console.log(this.videoList.length);
        }, error => {
          console.log(error);
        }, () => {
          //console.log('completed');
          //console.log('last', this.videoList.length);
          if (this.videoList.length === 1) {
            console.log(this.videoList.length);
            this.videoUrl = this.videoList[0].downloadUrl;
            console.log('URL', this.videoUrl);
            this.isVideoAvailable = true;
          }
        });
      });
    }, error => {
      console.log(error);
    }, () => {
      //console.log('completed');
      //console.log('last', this.videoList.length);
    });

  }  // getVideoList

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
    console.log('first:', this.videoList[0]);
    console.log('last:', this.videoList[this.videoList.length-1]);
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
