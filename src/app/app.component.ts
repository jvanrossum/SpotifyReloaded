import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http, RequestOptionsArgs, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private accessToken: string;
  public name: string;
  public imgSrc: string;
  private searchTerms = new Subject<string>();
  public artists: Observable<any[]>;

  constructor(
    private route: ActivatedRoute,
    private http: Http
  ) {}
  
  ngOnInit() {
    this.setAccessToken();
    this.artists = this.searchTerms
      .debounceTime(300)
      .distinctUntilChanged()  
      .switchMap(searchTerm => this.search(searchTerm));
  }

  private setAccessToken() {
    this.route.fragment.subscribe((fragment: string) => {
      if (fragment != null && fragment.startsWith("access_token=")) {
        let fragmentJson = this.getJsonFromFragmentParams(fragment);
        this.accessToken = fragmentJson.access_token;
        this.getUserData();
      }
    })
  }

  triggerSearch(searchTerm: string) {
    this.searchTerms.next(searchTerm);
  }

  search(searchTerm: string): Observable<any> {
    return this.http.get("https://api.spotify.com/v1/search?type=artist&q=" + searchTerm, this.getRequestionOptions())
      .map((resp) => resp.json().artists.items);
  }

  getUserData() {
    this.http.get("https://api.spotify.com/v1/me", this.getRequestionOptions())
      .map((resp) => resp.json())
      .subscribe((me: any) => {
        this.name = me.display_name;
        if(me.images[0] != null) {
          this.imgSrc = me.images[0].url;
        }
      }, () => delete this.accessToken);
  }

  private getRequestionOptions(): RequestOptionsArgs {
    let options: RequestOptionsArgs = {
      headers: new Headers({
        "Authorization": "Bearer " + this.accessToken,
      })
    };
    return options;
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
