import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Feedback, ContactType } from '../shared/feedback'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {


  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;

  //ANGULAR 8
  @ViewChild('fform',{static:false}) feedbackFormDirective;
  //ANGULAR 7
  //@ViewChild('fform',{static:false}) feedbackFormDirective;
  
  constructor(private fb: FormBuilder) { this.createForm() }

  ngOnInit() {
  }

  createForm(){
    this.feedbackForm =this.fb.group({
      firstname: ['',Validators.required],
      lastname: ['',Validators.required],
      telnum: [0,Validators.required],
      email: ['',Validators.required],
      agree: false,
      contacttype: 'None',
      message: ''
    })
  }

  onSubmit(){
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback)
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackFormDirective.resetForm();
  }

}
