import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http, RequestOptionsArgs, Headers } from '@angular/http';
import 'rxjs/add/operator/map'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private accessToken: string;
  public name: string;
  public imgSrc: string;

  constructor(
    private route: ActivatedRoute,
    private http: Http
  ) {}
  
  ngOnInit() {
    this.route.fragment.subscribe((fragment: string) => {
      if (fragment != null && fragment.startsWith("access_token=")) {
        let fragmentJson = this.getJsonFromFragmentParams(fragment);
        this.accessToken = fragmentJson.access_token;
        this.getUserData();
      }
    })
  }

  getUserData() {
    let options: RequestOptionsArgs = {
      headers: new Headers({
        "Authorization": "Bearer " + this.accessToken,
      })
    };
    this.http.get("https://api.spotify.com/v1/me", options)
      .map((resp) => resp.json())
      .subscribe((me: any) => {
        this.name = me.display_name;
        if(me.images[0] != null) {
          this.imgSrc = me.images[0].url;
        }
      }, () => delete this.accessToken);
  }

  private getJsonFromFragmentParams(fragment: string): any {
    let result = {};
    fragment.split("&").forEach((part) => {
      let item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
  }

  connectSpotify() {
    const clientId = "jouwClientID";
    location.href = "https://accounts.spotify.com/authorize?response_type=token&redirect_uri=http://localhost:4200&client_id=" + clientId;
  }

  isConnectedToSpotify() {
    return this.accessToken != null;
  }
}
