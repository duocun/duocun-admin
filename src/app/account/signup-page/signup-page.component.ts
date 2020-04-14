import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';
import { Account, IAccount } from '../../account/account.model';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {

  errMsg: string;
  form: FormGroup;

  constructor(private fb: FormBuilder,
    private accountSvc: AccountService,
    // private cookieSvc: CookieService,
    private router: Router,
    // private rx: NgRedux<IAppState>,
  ) {

    this.form = this.fb.group({
      username: ['', Validators.required],
      // email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {

  }

  validate(s) {
    const format = /[()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    if (format.test(s)) {
      return false;
    } else {
      return true;
    }
  }

  onSignup() {
    const v = this.form.value;
    const account = new Account({
      username: v.username,
      email: '', // v.email,
      password: v.password,
      type: 'user'
    });
    // this.cookieSvc.removeCookies();

    if (this.form.invalid) {
      this.errMsg = 'FieldEmpty';
    } else if (this.validate(v.username)) {
      this.errMsg = 'InvalidChar';
    } else {
      this.accountSvc.signup(account).subscribe((user: IAccount) => {
        if (user && user._id) {
          if (user.type === 'user') {
            this.router.navigate(['main/home']);
          } else if (user.type === 'worker') {
            this.router.navigate(['order/list-worker']);
          }
        } else {
          this.errMsg = 'UserExist';
        }
      },
      err => {
        console.log(err.message);
        this.errMsg = 'UserExist';
      });
    }
  }

  onFocusUsername(e) {
    this.errMsg = '';
  }

  onFocusPassword(e) {
    this.errMsg = '';
  }

}
