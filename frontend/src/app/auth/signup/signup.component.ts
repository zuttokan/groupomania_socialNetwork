import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  errorMsg!: string;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
      username: [null, Validators.required],
    });
  }

  onSignup() {
    const email = this.signupForm.get('email')!.value;
    const password = this.signupForm.get('password')!.value;
    const username = this.signupForm.get('username')!.value;
    this.auth
      .createUser(email, password, username)
      .pipe(
        switchMap(() => this.auth.loginUser(email, password)),
        tap(() => {
          this.router.navigate(['/posts']);
        }),
        catchError((error) => {
          this.errorMsg = error.message;
          return EMPTY;
        })
      )
      .subscribe();
  }
}
