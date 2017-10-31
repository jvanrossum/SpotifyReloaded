import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private accessToken: string;

  constructor(private route: ActivatedRoute) {}
  
  ngOnInit() {
    this.route.fragment.subscribe((fragment: string) => {
      if (fragment.startsWith("access_token=")) {
        let fragmentJson = this.getJsonFromFragmentParams(fragment);
        this.accessToken = fragmentJson.access_token;
      }
    })
  }

  private getJsonFromFragmentParams(fragment: string): any {
    var result = {};
    fragment.split("&").forEach(function(part) {
      var item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
  }

  connectSpotify() {
    const clientId = "jouwClientID";
    location.href = "https://accounts.spotify.com/authorize?response_type=token&redirect_uri=http://localhost:4200&client_id=" + clientId;
  }
}
