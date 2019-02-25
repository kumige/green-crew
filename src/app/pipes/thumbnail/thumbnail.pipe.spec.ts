import { MediaProviderPage } from "./../../media-provider/media-provider.page";
import { ThumbnailPipe } from "./thumbnail.pipe";

describe("ThumbnailPipe", () => {
  it("create an instance", () => {
    const pipe = new ThumbnailPipe(this.MediaProviderPage);
    expect(pipe).toBeTruthy();
  });
});
