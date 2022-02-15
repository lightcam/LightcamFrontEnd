import { HttpParams, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Platform, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  contactForm: FormGroup;

  constructor(
    public platform: Platform,
    private http: HttpClient,
    private toastController: ToastController,
  ) { }

  ngOnInit() {

    this.contactForm = new FormGroup({

      personName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(100)]
      }),
      email: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(320), Validators.email]
      }),
      subject: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(200)]
      }),
      message: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(10000)]
      }),
    });
  }

  onSubmitContactForm() {

    if (this.contactForm.valid) {

      this.submitForm(this.contactForm);
      this.presentFormSubmittedToast();
    }
    else {
      this.presentFormInvalidToast();
    }
  }

  async presentFormInvalidToast() {

    const toast = await this.toastController.create({
      message: 'Form is invalid.',
      duration: 2500,
      color: 'danger'
    });
    toast.present();
  }

  async presentFormSubmittedToast() {

    const toast = await this.toastController.create({
      message: 'Thank you for your feedback!',
      duration: 2500,
      color: 'success'
    });
    toast.present();
  }

  private submitForm(form: FormGroup) {
    const url = 'https://lightcam.fbk.eu/api/';
    const params = new HttpParams()
    .set('resource', 'email')
    .set('name', form.value.personName)
    .set('subject', form.value.subject)
    .set('email', form.value.email)
    .set('message', form.value.message);
    this.http.get(url, {params, responseType: 'text'}).subscribe();
  }
}
