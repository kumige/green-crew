import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaProviderPage } from './media-provider.page';

describe('MediaProviderPage', () => {
  let component: MediaProviderPage;
  let fixture: ComponentFixture<MediaProviderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaProviderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaProviderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
