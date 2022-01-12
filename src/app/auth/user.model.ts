export class User {
  constructor(
    public email: string,
    public id: string,
    private token_: string,
    private tokenExpirationDate_: Date
  ) {}

  get token() {
    if (!this.tokenExpirationDate_ || new Date() > this.tokenExpirationDate_) {
      return null;
    }
    return this.token_;
  }

}
