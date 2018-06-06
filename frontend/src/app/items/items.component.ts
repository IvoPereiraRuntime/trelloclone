import { Component, OnDestroy, Input, Output, ViewChild, Inject, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-items',
  template: `
     <div #itemContainer>
       <h4 class="deb" (click)="selectItem($event, item)">{{item.title}}</h4>
       <small>{{item.description}}</small>
     </div>
  `,
  styleUrls: ['./items.component.css']
})
export class ItemsComponent {
  @Input() item: Object = {};
  @ViewChild('itemContainer', { read: ViewContainerRef }) _itemContainer;

  constructor(@Inject('dynamic-item-service') private dynamicItemService) {}

  selectItem(event, item) {
    const element = event.target;
    this.dynamicItemService.setRootViewContainerRef(this._itemContainer);
    this.dynamicItemService.addDynamicComponent(item, ItemsFormComponent);
    element.parentNode.remove();
  }
}

@Component({
  selector: 'app-item-form',
  template: `
    <div id="item-form" #itemFormContainer>
    <div>
      <label for="title">Title</label>
      <input #itemTitle name="item[title]" type="text" value={{item.title}}>
    </div>
    <div>
      <label for="description">Description</label>
      <input #itemDescription name="item[description]" type="text" value={{item.description}}>
    </div>
    <button type="button" (click)="onSave($event, {
      id: item.id,
      title: itemTitle.value,
      description: itemDescription.value
    }, item)">Save</button>
  </div>`
})
export class ItemsFormComponent implements OnDestroy {
  @Input() item: Object = {};
  @ViewChild('itemFormContainer', { read: ViewContainerRef }) _itemFormContainer;

  constructor(@Inject('items-service') private itemsService,
    @Inject('dynamic-item-service') private dynamicItemService) {}

  ngOnDestroy() {}

  onSave(event, item, original) {
    if (original !== {}) {
      const res = this.itemsService.updateItem(item);
    } else {
      const res = this.itemsService.createItem(item);
    }
    res.subscribe(
      (response) => {
        const element = event.target;
        this.dynamicItemService.setRootViewContainerRef(this._itemFormContainer);
        this.dynamicItemService.addDynamicComponent(response, ItemsComponent);
        element.parentNode.remove();
      },
      (err) => {
        console.log('Something went wrong.');
      }
    );
  }
}
