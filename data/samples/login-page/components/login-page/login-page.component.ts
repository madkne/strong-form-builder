import { Component, OnInit } from '@angular/core';
import { StrongFBBase } from 'src/app/StrongFB/common/StrongFB-base';
import { LoginPageForm } from 'src/app/StrongFB/forms/pages/login-page.form';
import { StrongFBService } from '../../StrongFB/services/StrongFB.service';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {


  form: StrongFBBase;

  constructor(public strongfb: StrongFBService) { }


  ngOnInit(): void {
    this.form = new LoginPageForm();
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.


  }

}
