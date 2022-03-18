import { Hasher } from "@src/data/protocols/cryptography/hasher";
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher {
  private readonly salt: number
  constructor(salt: number) {
    this.salt = salt
  }
  public async hash(value: string):Promise<string> {
    const valueHashed = await bcrypt.hash(value, this.salt)
    return valueHashed;
  }
}