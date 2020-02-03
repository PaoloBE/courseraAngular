import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from 'src/app/shared/dish'
import { DishService } from '../services/dish.service'
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  host: {
  '[@flyInOut]': 'true',
  'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})


export class MenuComponent implements OnInit {

  
  dishes : Dish[];
  selectedDish : Dish;
  errMess: string;

  constructor(private dishService: DishService, @Inject('baseURL') private baseURL) { }

  onSelect(dish: Dish){
    this.selectedDish = dish
    console.log(dish.name)
  }

  ngOnInit() {
    this.dishService.getDishes()
    .subscribe(dishes => this.dishes = dishes, errMess => this.errMess = <any>errMess)

  }
}
