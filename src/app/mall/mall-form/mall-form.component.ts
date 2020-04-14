import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormBuilder, Validators } from '../../../../node_modules/@angular/forms';

@Component({
  selector: 'app-mall-form',
  templateUrl: './mall-form.component.html',
  styleUrls: ['./mall-form.component.scss']
})
export class MallFormComponent implements OnInit, OnChanges {
  mallForm;

  @Input() mall;

  constructor(
    private fb: FormBuilder
  ) {
    this.mallForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', Validators.required],
      lat: ['', Validators.required],
      lng: ['', Validators.required],
      radius: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  ngOnChanges(v) {
    if (v.mall.currentValue) {
      this.mallForm.patchValue(v.mall.currentValue);
    }
  }
}
