import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountService } from '../account.service';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { IAccount } from '../account.model';
import { Subject } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit, OnDestroy {
  accounts;
  account;
  onDestroy$ = new Subject();

  constructor(
    private accountSvc: AccountService
  ) {

  }

  ngOnInit() {
    this.accountSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe((account: IAccount) => {

    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
