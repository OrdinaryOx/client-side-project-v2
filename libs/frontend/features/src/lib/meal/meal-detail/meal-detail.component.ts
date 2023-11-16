import { Component } from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core';
import { IMeal } from '@client-side-project/shared/api';
import { MealService } from '../meal.service';
import { Subscription, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'client-side-project-meal-detail',
  templateUrl: './meal-detail.component.html',
  styleUrls: ['./meal-detail.component.css'],
})
export class MealDetailComponent implements OnInit, OnDestroy {
  meals: IMeal | null = null;
  subscription: Subscription | undefined = undefined;

  constructor(private route: ActivatedRoute, private mealService: MealService) { }



  ngOnInit(): void {
    console.log("INIT")
    this.subscription = this.route.params.pipe(
      switchMap(params => {
        console.log(`switchMap params: ${JSON.stringify(params)}`);
        return this.mealService.read(params['id']);
      })
    ).subscribe((results) => {
      console.log(`results: ${JSON.stringify(results)}`);
      this.meals = results;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}