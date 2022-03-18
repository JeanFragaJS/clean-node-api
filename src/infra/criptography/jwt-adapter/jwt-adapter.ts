import jwt from 'jsonwebtoken'
import { Encrypter } from "@src/data/protocols/cryptography/encrypter";

export class JwtAdapter implements Encrypter {
  private readonly secretKey: string

  constructor( secretKey: string) {
    this.secretKey = secretKey
  }
  public async encrypt (value: string): Promise<string> {
      const accessToken =  jwt.sign(value, this.secretKey)
      return accessToken
  }

}


 