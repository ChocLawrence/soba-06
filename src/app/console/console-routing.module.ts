import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CategoriesComponent } from "./categories/categories.component";
import { ConsoleComponent } from "./console.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { MembersComponent } from "./members/members.component";
import { StatusesComponent } from "./statuses/statuses.component";
import { EventsComponent } from "./events/events.component";
import { EligibilityComponent } from "./eligibility/eligibility.component";
import { BranchesComponent } from "./branches/branches.component";
import { ContributionsComponent } from "./contributions/contributions.component";
import { PaymentStatesComponent } from "./payment-states/payment-states.component";

const routes: Routes = [
  {
    path: "",
    component: ConsoleComponent,
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "prefix" },
      {
        path: "dashboard", component: DashboardComponent
      },
      //CONFIGURATIONS
      {
        path: "categories", component: CategoriesComponent
      },
      {
        path: "events", component: EventsComponent
      },
      {
        path: "branches", component: BranchesComponent
      },
      {
        path: "payment-states", component: PaymentStatesComponent
      },
      {
        path: "eligibility", component: EligibilityComponent
      },
      {
        path: "statuses", component: StatusesComponent
      },
      //PUBLIC
      {
        path: "contributions", component: ContributionsComponent
      },
      //MEMBERS
      {
        path: "members", component: MembersComponent
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsoleRoutingModule { }
