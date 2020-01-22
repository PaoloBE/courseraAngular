import { Component, OnInit } from '@angular/core';
import { Dish } from 'src/app/shared/dish'
import { DishService } from '../services/dish.service'


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})


export class MenuComponent implements OnInit {

  
  dishes : Dish[];

  selectedDish : Dish;

  constructor(private dishService: DishService) { }

  onSelect(dish: Dish){
    this.selectedDish = dish
    console.log(dish.name)
  }

  ngOnInit() {
    this.dishService.getDishes()
                      .then(dishes => this.dishes = dishes);
  }

}
