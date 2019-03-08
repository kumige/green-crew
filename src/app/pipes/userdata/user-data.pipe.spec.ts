import { UserDataPipe } from "./user-data.pipe";

describe("UserDataPipe", () => {
  it("create an instance", () => {
    const pipe = new UserDataPipe(null);
    expect(pipe).toBeTruthy();
  });
});
