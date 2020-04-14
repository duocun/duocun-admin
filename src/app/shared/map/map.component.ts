import { Component, Input, Output, EventEmitter, OnChanges, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';

declare let google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnChanges, AfterViewInit {
  @Input() center: any;
  @Input() zoom: any;
  @Input() places: any[];
  @Input() ranges: any[];
  @Input() bShowCenter;
  @Input() regions;
  @Input() points;
  @Input() polygons;
  @Input() polylines;
  @Input() mapId;

  @Output() afterClick: EventEmitter<any> = new EventEmitter();

  @ViewChild('map', { static: true }) input: ElementRef;

  initialized = false;
  map;
  markers = [];
  circles = [];
  dots = [];
  polygonList = [];
  polylineList = [];

  bShiftPressed = false;
  gribBoundingBox;
  bonds;

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event) {
    if (event.which === 16) {
      this.bShiftPressed = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event) {
    if (event.which === 16) {
      this.bShiftPressed = false;
    }
  }

  constructor() {

  }

  ngAfterViewInit() {
    // if (!this.initialized) {
    //   this.initMap();
    //   this.initialized = true;
    // }
  }

  // ngOnInit() {
  //   // if (this.mapId) {
  //   //   this.initMap();
  //   // }
  //   if (!this.initialized) {
  //     this.initMap();
  //     this.initialized = true;
  //   }
  // }

  ngOnChanges(v) {
    const self = this;
    for (let i = 0; i < this.dots.length; i++) {
      this.dots[i].setMap(null);
    }
    for (let i = 0; i < this.circles.length; i++) {
      this.circles[i].setMap(null);
    }
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    for (let i = 0; i < this.polygonList.length; i++) {
      this.polygonList[i].setMap(null);
    }
    for (let i = 0; i < this.polylineList.length; i++) {
      this.polylineList[i].setMap(null);
    }
    if (this.initialized && v && v.regions && v.regions.currentValue) {
      this.regions = v.regions.currentValue;
      // for (let i = 0; i < this.circles.length; i++) {
      //   this.circles[i].setMap(null);
      // }
      this.addRegions(this.map, this.regions);
    }
    if (this.initialized && v && v.places && v.places.currentValue) {
      this.places = v.places.currentValue;
      // for (let i = 0; i < this.markers.length; i++) {
      //   this.markers[i].setMap(null);
      // }
      this.addPlaces(this.map);
    }

    if (this.initialized && v && v.points && v.points.currentValue) {
      this.points = v.points.currentValue;
      this.addPoints(this.map, this.points);
    }
    if (this.initialized && this.polygons) {
      this.addPolygons(this.map, this.polygons);
    }
    if (this.initialized && this.polylines) {
      this.addPolylines(this.map, this.polylines);
    }
    if (!this.initialized) {
      this.initMap();
      this.initialized = true;
    }
  }
  // ngOnChanges() {
  //   this.initMap();
  // }
  addRegions(map, regions) {
    if (regions && regions.length > 0) {
      this.regions.map(r => {
        const cityCircle = new google.maps.Circle({
          strokeColor: r.color ? r.color : 'red',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: r.color ? r.color : 'red',
          fillOpacity: 0.25,
          map: map,
          center: { lat: +r.lat, lng: +r.lng },
          radius: r.radius * 30
        });
        cityCircle.setMap(map);
        this.circles.push(cityCircle);
      });
    }
  }

  addPoints(map, points) {
    if (points && points.length > 0) {
      this.points.map(r => {
        const cityCircle = new google.maps.Circle({
          strokeColor: r.color ? r.color : 'red',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: r.color ? r.color : 'red',
          fillOpacity: 0.25,
          map: map,
          center: { lat: +r.lat, lng: +r.lng },
          radius: 60
        });
        cityCircle.setMap(map);
        this.dots.push(cityCircle);
      });
    }
  }

  addPolygons(map, paths) {
    if (paths && paths.length > 0) {
      paths.map(r => {
        const polygon = new google.maps.Polygon({
          paths: r,
          strokeColor: '#FF0000', // r.color ? r.color : 'red',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000', // r.color ? r.color : 'red',
          fillOpacity: 0.25
        });
        polygon.setMap(map);
        this.polygonList.push(polygon);
      });
    }
  }


  addPolylines(map, paths) {
    if (paths && paths.length > 0) {
      paths.map(r => {
        const polyline = new google.maps.Polyline({
          path: r,
          geodesic: true,
          strokeColor: '#FF0000', // r.color ? r.color : 'red',
          strokeOpacity: 0.8,
          strokeWeight: 2,
        });
        polyline.setMap(map);
        this.polylineList.push(polyline);
      });
    }
  }

  addRanges(map) {
    if (this.ranges && this.ranges.length > 0) {
      this.ranges.map(r => {
        const cityCircle = new google.maps.Circle({
          strokeColor: '#188038',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#188038',
          fillOpacity: 0.35,
          map: map,
          center: { lat: +r.lat, lng: +r.lng },
          radius: r.radius * 1000
        });
      });
    }
  }

  addPlaces(map) {
    const self = this;
    if (this.places && this.places.length) {
      this.places.map((p, i) => {
        const iconUrl = p.icon ? p.icon : 'http://labs.google.com/ridefinder/images/mm_20_red.png';
        const marker1 = new google.maps.Marker({
          position: p,
          label: {
            text: self.places[i].name,
            fontSize: '11px'
          },
          icon: {
            url: iconUrl
          }
        });
        marker1.setMap(map);
        this.markers.push(marker1);
      });
    }// end of this.places
  }

  initMap() {
    const self = this;
    // const mapDom = document.getElementById(this.mapId);
    const mapDom = this.input.nativeElement;
    if (mapDom) {
      const map = new google.maps.Map(mapDom, {
        zoom: self.zoom,
        center: self.center,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      });

      google.maps.event.addListener(map, 'click', (event) => {
        this.afterClick.emit({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      });

      if (self.bShowCenter) {
        const marker = new google.maps.Marker({
          position: self.center,
          map: map,
          label: ''
        });
        marker.setMap(map);
      }
      this.map = map;
      this.addPlaces(map);
      this.addRegions(map, this.regions);
      this.addPoints(map, this.points);
      this.addPolygons(map, this.polygons);
      this.setupMouse(map);
    }

  }


  setupMouse(themap) {
    google.maps.event.addListener(themap, 'mousemove', function (e) {
      console.log('mouse move');
      if (this.mouseIsDown && this.shiftPressed) {
        e.stopPropagation();
        console.log('get boundray');
        if (this.gribBoundingBox !== null) { // box exists
          this.bounds.extend(e.latLng);
          this.gribBoundingBox.setBounds(this.bounds); // If this statement is enabled, I lose mouseUp events
        } else { // create bounding box
          this.bounds = new google.maps.LatLngBounds();
          this.bounds.extend(e.latLng);
          this.gribBoundingBox = new google.maps.Rectangle({
            map: themap,
            bounds: this.bounds,
            fillOpacity: 0.15,
            strokeWeight: 0.9,
            clickable: false
          });
        }
      }
    });

    google.maps.event.addListener(themap, 'mousedown', function (e) {
      if (this.shiftPressed) {
        this.mouseIsDown = 1;
        this.mouseDownPos = e.latLng;
        themap.setOptions({
          draggable: false
        });
      }
    });

    google.maps.event.addListener(themap, 'mouseup', function (e) {
      if (this.mouseIsDown && this.shiftPressed) {
        this.mouseIsDown = 0;
        if (this.gribBoundingBox !== null) { // box exists
          const boundsSelectionArea = new google.maps.LatLngBounds(
            this.gribBoundingBox.getBounds().getSouthWest(),
            this.gribBoundingBox.getBounds().getNorthEast()
          );

          this.points.map( p => {
            //                    if (boundsSelectionArea.contains(markers[key].marker.getPosition()))
            const point = new google.maps.LatLng(p.lat, p.lng);
            if (this.gribBoundingBox.getBounds().contains(point)) {
              // if(flashMovie !== null && flashMovie !== undefined) {
              // markers[key].marker.setIcon("http://maps.google.com/mapfiles/ms/icons/blue.png")
              // document.getElementById('info').innerHTML += "key:" + key + " posn:" + markers[key].marker.getPosition() 
              // + " in bnds:" + gribBoundingBox.getBounds() + "<br>";
              // console.log("User selected:" + key + ", id:" + markers[key]._id);
              // }
            } else {
              // if(flashMovie !== null && flashMovie !== undefined) {
              // markers[key].marker.setIcon("http://maps.google.com/mapfiles/ms/icons/red.png")
              // document.getElementById('info').innerHTML += "key:" + key + " posn:" + markers[key].marker.getPosition() +
              // " out of bnds:" + gribBoundingBox.getBounds() + "<br>";
              // console.log("User NOT selected:" + key + ", id:" + markers[key]._id);
              // }
            }
          });

          this.gribBoundingBox.setMap(null); // remove the rectangle
        }
        this.gribBoundingBox = null;
      }

      themap.setOptions({
        draggable: true
      });
    });
  }
}
