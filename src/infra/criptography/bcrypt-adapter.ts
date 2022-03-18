import { HashCompare } from "@src/data/protocols/cryptography/hash-compare";
import { Hasher } from "@src/data/protocols/cryptography/hasher";
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher, HashCompare {
  private readonly salt: number
  constructor(salt: number) {
    this.salt = salt
  }

  public async hash(value: string):Promise<string> {
    const valueHashed = await bcrypt.hash(value, this.salt)
    return valueHashed;
  }

  public async compare (value: string, hash: string): Promise<boolean> {
    const result = await bcrypt.compare(value, hash)
    return result
  }
}