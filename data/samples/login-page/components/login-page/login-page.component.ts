import { Component, OnInit } from '@angular/core';
import { StrongFBFormClass } from 'src/app/StrongFB/common/StrongFB-base';
import { LoginPageForm } from 'src/app/StrongFB/forms/pages/login-page.form';
import { StrongFBService } from '../../StrongFB/services/StrongFB.service';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {


  form: StrongFBFormClass;

  constructor(public strongfb: StrongFBService) { }


  async ngOnInit() {
    this.form = await this.strongfb.loadFormClass(LoginPageForm);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.


  }

}
