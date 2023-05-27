import { Component, ViewChild } from '@angular/core';
import { AppService } from './app.service';
import { Location, LocationsResponse, Coordinates } from './location';
import { Cartesian } from './cartesian';
import { ModelViewerElement } from '@google/model-viewer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(private service: AppService) {
    
  }
  @ViewChild('mv') viewer!: ModelViewerElement;
  data: Location[] = [];
  self_address: string = "";
  status: string = "";

  position(item: Location): string {
    var c = toCartesian(item.location);
    return (500*c.x) + " " + (500*c.y) + " " + (500*c.z);
  }

  normal(item: Location): string {
    var c = toCartesian(item.location);
    return c.x + " " + c.y + " " + c.z;
  }

  init(mv: ModelViewerElement) {
    this.service.getLocations().subscribe((res: LocationsResponse) => {
      this.data = res.list;
      this.self_address = res.self_address;
      this.status = res.status;

      for (let item of this.data) {
        if (item.address == this.self_address) {
          let orbit_lon = item.location.lon + 180;
          let orbit_lat = 90 - item.location.lat;
          mv.cameraOrbit = orbit_lon + "deg " + orbit_lat + "deg 1111m";
        }
      }
    });
  }

  getDate(unix: number) {
    return new Date(unix * 1000);
  }
}

function rad(n: number): number {
  return n * Math.PI / 180;
}

function toCartesian(c: Coordinates): Cartesian {
  return {
    x: Math.cos(rad(c.lat)) * Math.cos(rad(-c.lon - 90)),
    y: Math.sin(rad(c.lat)),
    z: Math.cos(rad(c.lat)) * Math.sin(rad(-c.lon - 90))
  };
}