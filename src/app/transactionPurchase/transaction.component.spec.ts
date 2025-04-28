import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionPurchaseComponent } from './transactionPurchase.component';

describe('TransactionComponent', () => {
  let component: TransactionPurchaseComponent;
  let fixture: ComponentFixture<TransactionPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionPurchaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
