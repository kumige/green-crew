import { TestBed } from "@angular/core/testing";

import { SingleMediaService } from "./single-media.service";

describe("SingleMediaService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: SingleMediaService = TestBed.get(SingleMediaService);
    expect(service).toBeTruthy();
  });
});
