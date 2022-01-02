import { Component, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
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

export class VideoListComponent implements OnInit, AfterViewInit {
  @ViewChild('vidPlayer', {static: true}) player: ElementRef;
  activeVideo: number;
  nowPlaying: string;
  videoList: Video[];
  isVideoAvailable: boolean;

  constructor(private storage: AngularFireStorage, private elRef: ElementRef) {
    this.nowPlaying = '';
    this.isVideoAvailable = false;
  }

  getVideoList() {
    this.videoList = [];
    const ref = this.storage.ref('');
    ref.listAll().subscribe((res) => {

      // populate videoList array, sorted by name
      res.items.forEach(item =>  {
        let video: Video = {
          name: item.name,
          date: '',
          time: '',
          downloadUrl: ''
        };
        this.videoList.push(video);
      });

      // add downloadUrl
      for (let i = 0; i < this.videoList.length; i++) {
        this.storage.ref(this.videoList[i].name).getDownloadURL().subscribe((url) => {
          this.videoList[i].downloadUrl = url;

          // first video ready -> highlight entry and start playing video
          if  (i === 0) {
            this.nowPlaying = this.videoList[i].downloadUrl;
            this.activeVideo = i;
            this.isVideoAvailable = true;
            console.log('first', i, this.videoList[i].name, this.videoList[i].downloadUrl);
            this.player.nativeElement.load();
          }

          // last video ready
          if  (i === this.videoList.length-1) {
            console.log('last', i, this.videoList[i].name, this.videoList[i].downloadUrl);
          }
        });
      };
/*       this.videoList.forEach(video =>  {
        this.storage.ref(video.name).getDownloadURL().subscribe((url) => {
          video.downloadUrl = url;
          if  (video)
          console.log(video.name, video.downloadUrl);
        }); // forEach fileName
      }; */
    }); // listAll subscribe
  }  // getVideoList

  ngOnInit(): void {
    console.log('onInit');
    this.getVideoList();
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    console.log(this.player.nativeElement);
    //console.log(this.player.nativeElement.currentSrc);
  }

  onEnded(vidPlayer: HTMLVideoElement) {
    console.log('onEnded()');
    console.log(vidPlayer);
    // TODO emit event select next video
    this.activeVideo++;
    if (this.activeVideo >= this.videoList.length) {
      this.activeVideo = 0;
    }
    this.nowPlaying = this.videoList[this.activeVideo].downloadUrl;
    this.player.nativeElement.load();
  }

  onGetFiles() {
    console.log('onGetFiles');
    this.getVideoList();
  }

  onShowUrl() {
    for (let i = 0; i < 11; i++) {
      console.log(i, this.videoList[i].name, this.videoList[i].downloadUrl);
    }
  }

  onSelectVideo(index: number) {
    this.isVideoAvailable = false;
    this.activeVideo = index;
    this.nowPlaying = this.videoList[index].downloadUrl;
    console.log(index, this.videoList[index].name);
    this.player.nativeElement.load();
  }

  onSetVideo() {

  }

}
