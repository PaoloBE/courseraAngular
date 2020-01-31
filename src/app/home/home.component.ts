import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { Promotion } from '../shared/promotion';
import { Leader } from '../shared/leader';
import { DishService } from '../services/dish.service';
import { PromotionService } from '../services/promotion.service';
import { LeaderService } from '../services/leader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  dish: Dish;
  promotion: Promotion;
  leader:Leader;
  errMess:String;

  constructor(private dishService: DishService,
              private promotionService:PromotionService,
              private leaderService:LeaderService,
              @Inject('baseURL') private baseURL) { }

  ngOnInit() {
    this.dishService.getFeactureDish().subscribe(fd => this.dish = fd,errMess=>this.errMess=<any>this.errMess);
    this.promotionService.getFeaturedPromotion().subscribe(fp => this.promotion = fp);
    this.leaderService.getFeactureLeader().subscribe(fl => this.leader = fl);
  }

}
