import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { Promotion } from '../shared/promotion';
import { Leader } from '../shared/leader';
import { DishService } from '../services/dish.service';
import { PromotionService } from '../services/promotion.service';
import { LeaderService } from '../services/leader.service';
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
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
    this.promotionService.getFeaturedPromotion().subscribe(fp => this.promotion = fp,errMess=>this.errMess=<any>this.errMess);
    this.leaderService.getFeactureLeader().subscribe(fl => this.leader = fl,errMess=>this.errMess=<any>this.errMess);
  }

}
