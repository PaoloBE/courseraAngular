import { Component, OnInit, Input,ViewChild } from '@angular/core';
import { Dish } from '../shared/dish'
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators'

import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Feedback, ContactType } from '../shared/feedback'

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;

  dish: Dish;

  dishIds: string[];
  prev: string;
  next: string;

  //ANGULAR 8
  @ViewChild('fform',{static:false}) feedbackFormDirective;
  //ANGULAR 7
  //@ViewChild('fform') feedbackFormDirective;


  formErrors = {
    'name': '',
    'comment': ''
  };

  validationMessages = {
    'name': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.'
    },
    'comment': {
      'required':      'Comment is required.'
    },
  };

  constructor(private dishService: DishService,
              private route: ActivatedRoute,
              private location: Location,
              private fb: FormBuilder) { this.createForm() }

  createForm(){
    this.feedbackForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)] ],
      rating: [5, [Validators.required]],
      comment: ['', [Validators.required] ],
    });
    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }

    const form = this.feedbackForm;

    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        
        // clear previous error message (if any)
        this.formErrors[field] = '';

        const control = form.get(field);

        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit(){
    this.feedback = this.feedbackForm.value;
    
    this.dish.comments.push({
      rating: this.feedbackForm.value.rating,
      comment: this.feedbackForm.value.comment,
      author: this.feedbackForm.value.name,
      date: new Date().toISOString()
    })

    console.log(this.feedback)
    this.feedbackForm.reset({
      name: '',
      rating: 5,
      comment: ''
    });
    this.feedbackFormDirective.resetForm();
  }

  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
    .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }
}
