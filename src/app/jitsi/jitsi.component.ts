import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
declare var JitsiMeetExternalAPI: any;

@Component({
    selector: 'app-jitsi',
    templateUrl: './jitsi.component.html',
    styleUrls: ['./jitsi.component.scss']
})

export class JitsiComponent implements OnInit, AfterViewInit {
  domain: string = "meet.jit.si"; 
  room: any;
  options: any;
  api: any;
  user: any;

  constructor(
      private router: Router
  ) { }

  ngOnInit(): void {
      this.room = 'NotSoBoredGames';
      this.user = {
          name: 'Placeholder'
      }
  }

  ngAfterViewInit(): void {
      this.options = {
          roomName: this.room,
          width: 416,
          height: 416,
          configOverwrite: { prejoinPageEnabled: false },
          interfaceConfigOverwrite: {
              // overwrite interface properties
          },
          parentNode: document.querySelector('#jitsi-iframe'),
          userInfo: {
              displayName: this.user.name
          }
      }

      this.api = new JitsiMeetExternalAPI(this.domain, this.options);

       // Event handlers
      this.api.addEventListeners({
          readyToClose: this.handleClose,
          participantLeft: this.handleParticipantLeft,
          participantJoined: this.handleParticipantJoined,
          videoConferenceJoined: this.handleVideoConferenceJoined,
          videoConferenceLeft: this.handleVideoConferenceLeft,
          audioMuteStatusChanged: this.handleMuteStatus,
          videoMuteStatusChanged: this.handleVideoStatus
      });
  }
  handleClose = () => {
    console.log("handleClose");
}

handleParticipantLeft = async (participant) => {
    console.log("handleParticipantLeft", participant);
    const data = await this.getParticipants();
}

handleParticipantJoined = async (participant) => {
    console.log("handleParticipantJoined", participant);
}

handleVideoConferenceJoined = async (participant) => {
    console.log("handleVideoConferenceJoined", participant);
    const data = await this.getParticipants();
}

handleVideoConferenceLeft = () => {
    console.log("handleVideoConferenceLeft");
    this.router.navigate(['/thank-you']);
}

handleMuteStatus = (audio) => {
    console.log("handleMuteStatus", audio);
}

handleVideoStatus = (video) => {
    console.log("handleVideoStatus", video);
}

getParticipants() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(this.api.getParticipantsInfo());
        }, 500)
    });
}
}