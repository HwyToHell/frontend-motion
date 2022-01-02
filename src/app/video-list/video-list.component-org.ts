import { Component, OnInit } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorage, AngularFireStorageReference} from '@angular/fire/storage';

type Video = {
  name: string;
  date: string;
  time: string;
  downloadUrl: string;
};

function cmpByName(a: any, b: any): number {
  let cmp: number = 0;
  if (a.name > b.name) {
    cmp = 1;
  } else if (a.name < b.name) {
    cmp = -1;
  }
  return cmp;
}

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css']
})

export class VideoListComponent implements OnInit {
  activeVideo: number;
  files: string[]; // TODO replace with videoList
  nowPlaying: string;
  videoList: Video[];
  isVideoAvailable: boolean;

  constructor(private storage: AngularFireStorage) {
    this.files = [];
    this.nowPlaying = '';
    this.isVideoAvailable = false;

    // TODO remove
    this.files.push('first');
  }



  getVideoList() {
    this.videoList = [];
    const ref = this.storage.ref('');
    ref.listAll().subscribe((res) => {
      //console.log(res.items[0].name);
      // TODO slice and compare
      let fileNames: string[] = [];
      res.items.forEach(item =>  {
        fileNames.push(item.name);
      });
      fileNames.sort();
      for (let i = 0; i < 10; i++) {
        console.log(i, fileNames[i]);
      }

      fileNames.forEach(fileName =>  {
        let video: Video = {
          name: fileName,
          date: '',
          time: '',
          downloadUrl: ''
        };
        //console.log(video);
        this.storage.ref(video.name).getDownloadURL().subscribe((url) => {
          video.downloadUrl = url;
          this.videoList.push(video);

          if (this.videoList.length === 1) {
            console.log(this.videoList.length);
            this.nowPlaying = this.videoList[0].downloadUrl;
            console.log('URL', this.nowPlaying);
            this.isVideoAvailable = true;
            this.activeVideo = 0;
          }

          if (this.videoList.length === 10) {
            for (let i = 0; i < 10; i++) {
              console.log(i, this.videoList[i].name, this.videoList[i].downloadUrl);
            }
          }
        });
      }); // forEach fileName
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
    console.log("URL", this.nowPlaying);
    console.log('first:', this.videoList[0]);
    console.log('last:', this.videoList[this.videoList.length-1]);
    this.isVideoAvailable = true;
  }

  onSelectVideo(index: number) {
    this.activeVideo = index;
    this.nowPlaying = this.videoList[index].name;
    console.log(index, this.videoList[index].name);
  }

  onSetVideo() {
    if (this.files.length > 0) {
      console.log(this.files[0]);
      this.storage.ref(this.files[0]).getDownloadURL().subscribe((res) => {
        console.log(res);
        this.nowPlaying = res;
        console.log(this.nowPlaying);
      });
    } else {
      console.log("no video available")
    }
  }

}
