import { Component, OnInit } from '@angular/core';

interface feature {
  icon: string;
  title: string;
};

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit {

  /**
   * Clients Logo
   */
   featuresdata: feature[] = [
    {
      icon: "eye",
      title: "Visa Application"
    },
    {
      icon: "monitor",
      title: "Passport"
    },
    {
      icon: "heart",
      title: "Citizen Services Center"
    },
    {
      icon: "bold",
      title: "Schedule appointments"
    },
    {
      icon: "feather",
      title: "Provide travelling support"
    },
    {
      icon: "code",
      title: "Enquiries"
    },
    {
      icon: "user-check",
      title: "Follow-up"
    },
    {
      icon: "git-merge",
      title: "General Administration"
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
