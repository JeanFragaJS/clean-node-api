import jwt from 'jsonwebtoken'
import { Encrypter } from "@src/data/protocols/cryptography/encrypter";

export class JwtAdapter implements Encrypter {

  constructor( private readonly secretKey: string) {}
  public async encrypt (value: string): Promise<string> {
      const accessToken =  jwt.sign(value, this.secretKey)
      return accessToken
  }

}


 