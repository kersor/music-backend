export class DtoRegister {
  name: string;
  email: string;
  password: string;
}

export class DtoLogin {
  email: string;
  password: string;
}

export class Tokens {
  access_token: string;
  refresh_token: string;
}

export class ResponceAuth {
  name: string;
  email: string;
  access_token: string;
  createdAt: Date;
  updatedAt: Date;
}

export class IVerifyToken {
  id: string;
  iat: number;
  exp: number;
}
