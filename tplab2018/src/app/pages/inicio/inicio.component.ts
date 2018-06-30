import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  num = 1;
  num2 = 1;
  item1 = "item";
  item2 = "item";
  item3 = "item";

  active1 = "";
  active2 = "";
  active3 = ""
  constructor() {  }

  ngOnInit() 
  {
    this.slider();
  }
  cambiar(func)
  {
      switch(func)
      {
          case 1:
            this.item1 = "item active";
            this.active1 = "active";
            this.item2 = "item";
            this.active2 = "";
            this.item3 = "item";
            this.active3 = "";
            this.num = 1;
            this.num2 = 2;
            break;
          case 2:
            this.item1 = "item";
            this.active1 = "";
            this.item2 = "item active";
            this.active2 = "active";
            this.item3 = "item";
            this.active3 = "";
            this.num = 2;
            this.num2 = 3;
            break;
          case 3:
            this.item1 = "item";
            this.active1 = "";
            this.item2 = "item";
            this.active2 = "";
            this.item3 = "item active";
            this.active3 = "active";
            this.num = 3;
            this.num2 = 1;
            break;
      }
  }

  slider()
  {
      switch(this.num2)
      {
          case 1:
            this.item2 = "item";
            this.active2 = "";
            this.item3 = "item";
            this.active3 = "";
            this.item1 = "item active";
            this.active1 = "active";
            this.num = 1;
            this.num2 = 2;
            break;
          case 2:
            this.item1 = "item";
            this.active1 = "";
            this.item3 = "item";
            this.active3 = "";
            this.item2 = "item active";
            this.active2 = "active";
            this.num = 2;
            this.num2 = 3;
            break;
          case 3:
            this.item1 = "item";
            this.active1 = "";
            this.item2 = "item";
            this.active2 = "";
            this.item3 = "item active";
            this.active3 = "active";
            this.num = 3;
            this.num2 = 1;
            break;
      }
        setTimeout(() =>
        {
             this.slider();
        },
        3000);
  }


  anterior()
  {
      switch(this.num)
      {
          case 1:
            this.item1 = "item";
            this.active1 = "";
            this.item2 = "item";
            this.active2 = "";
            this.item3 = "item active";
            this.active3 = "active";
            this.num = 3;
            this.num2 = 1;
            break;
          case 2:
            this.item1 = "item active";
            this.active1 = "active";
            this.item2 = "item";
            this.active2 = "";
            this.item3 = "item";
            this.active3 = "";
            this.num = 1;
            this.num2 = 2;
            break;
          case 3:
            this.item1 = "item";
            this.active1 = "";
            this.item2 = "item active";
            this.active2 = "active";
            this.item3 = "item";
            this.active3 = "";
            this.num = 2;
            this.num2 = 3;
            break;
      }
  }

  posterior()
  {
      switch(this.num)
      {
          case 1:
            this.item1 = "item";
            this.active1 = "";
            this.item2 = "item active";
            this.active2 = "active";
            this.item3 = "item";
            this.active3 = "";
            this.num = 2;
            this.num2 = 3;
            break;
          case 2:
            this.item1 = "item";
            this.active1 = "";
            this.item2 = "item";
            this.active2 = "";
            this.item3 = "item active";
            this.active3 = "active";
            this.num = 3;
            this.num2 = 1;
            break;
          case 3:
            this.item1 = "item active";
            this.active1 = "active";
            this.item2 = "item";
            this.active2 = "";
            this.item3 = "item";
            this.active3 = "";
            this.num = 1;
            this.num2 = 2;
            break;
      }
  }

}
