import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  connectSpotify() {
    const clientId = "jouwClientID";
    location.href = "https://accounts.spotify.com/authorize?response_type=token&redirect_uri=http://localhost:4200&client_id=" + clientId;
  }
}
