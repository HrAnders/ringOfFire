import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPlayerMobileComponent } from './app-player-mobile.component';

describe('AppPlayerMobileComponent', () => {
  let component: AppPlayerMobileComponent;
  let fixture: ComponentFixture<AppPlayerMobileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppPlayerMobileComponent]
    });
    fixture = TestBed.createComponent(AppPlayerMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
