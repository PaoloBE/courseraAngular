import { Component, OnInit, Input,ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish'
import { Comment } from '../shared/comment'
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators'

import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Feedback, ContactType } from '../shared/feedback'
import { visibility, expand } from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    visibility(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;

  dish: Dish;
  dishIds: string[];
  dishcopy: Dish;

  prev: string;
  next: string;  
  errMess: string;

  visibility = 'shown';

  //ANGULAR 8
    @ViewChild('fform',{static:false}) feedbackFormDirective;
  //ANGULAR 7
  //@ViewChild('fform') feedbackFormDirective;

  comment: Comment;

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
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
              private fb: FormBuilder,
              @Inject('baseURL') private baseURL) { this.createForm() }

  createForm(){
    this.feedbackForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)] ],
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
    this.comment = this.feedbackForm.value;
    this.comment.date = new Date().toISOString();
    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },errmess => {this.dish = null; this.dishcopy = null;this.errMess = <any>errmess})
    this.feedbackForm.reset({
      author: '',
      rating: 5,
      comment: ''
    });
    this.feedbackFormDirective.resetForm();
  }

  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds,errMess=>this.errMess=<any>this.errMess);
    this.route.params
    .pipe(switchMap((params: Params) => { this.visibility = 'hidden';return this.dishService.getDish(params['id']);}))
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility='shown'}, errmess => this.errMess = <any>errmess);
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {this.location.back();}
}
