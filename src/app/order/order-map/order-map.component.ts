import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { AssignmentService } from '../../assignment/assignment.service';
import { Subject } from '../../../../node_modules/rxjs';
import { IAssignment } from '../../assignment/assignment.model';
import { takeUntil } from '../../../../node_modules/rxjs/operators';

declare let google: any;
declare let MarkerClusterer: any;

@Component({
  selector: 'app-order-map',
  templateUrl: './order-map.component.html',
  styleUrls: ['./order-map.component.scss']
})
export class OrderMapComponent implements OnInit, OnDestroy, OnChanges {

  @Input() center: any;
  @Input() zoom: any;
  @Input() places: any[];
  @Input() deliveryDate;
  onDestroy$ = new Subject();
  // regions: IRegion[];
  assignments: IAssignment[];
  constructor(private assignmentSvc: AssignmentService) {
    // const deliveryDate = moment(this.orders[0].delivered);
    this.assignmentSvc.remove({delivered: this.deliveryDate}).pipe(
      takeUntil(this.onDestroy$)
    ).subscribe(r => {});
  }

  ngOnInit() {
    this.initMap();
  }
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
  ngOnChanges() {
    this.initMap();
  }

  initMap() {
      const self = this;
      if (typeof google !== 'undefined') {
          const map = new google.maps.Map(document.getElementById('map'), {
              zoom: self.zoom,
              center: self.center,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false
          });

          const marker = new google.maps.Marker({
              position: self.center,
              map: map,
              label: ''
          });


          if (this.places && this.places.length) {
              // var infowindow = new google.maps.InfoWindow({
              //   content: contentString
              // });

              // var marker = new google.maps.Marker({
              //   position: uluru,
              //   map: map,
              //   title: 'Uluru (Ayers Rock)'
              // });
              // marker.addListener('click', function() {
              //   infowindow.open(map, marker);
              // });

              const markers = this.places.map((location, i) => {
                  return new google.maps.Marker({
                      position: location,
                      label: {
                        text: self.places[i].name,
                        fontSize: '11px'
                      }
                  });
              });

              const markerCluster = new MarkerClusterer(map, markers,
                  { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });

          }// end of this.places

      }
  }

}
