import { Encrypter } from "@src/data/protocols/encrypter";
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Encrypter {
  private readonly salt: number
  constructor(salt: number) {
    this.salt = salt
  }
  public async encrypt(value: string):Promise<string> {
    const valueHashed = await bcrypt.hash(value, this.salt)
    return valueHashed;
  }
}