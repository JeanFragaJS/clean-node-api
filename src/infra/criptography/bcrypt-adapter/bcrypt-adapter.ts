import { HashCompare } from "@/data/protocols/cryptography/hash-compare";
import { Hasher } from "@/data/protocols/cryptography/hasher";
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher, HashCompare {
  constructor(private readonly salt: number) {}

  public async hash(value: string):Promise<string> {
    const valueHashed = await bcrypt.hash(value, this.salt)
    return valueHashed;
  }

  public async compare (value: string, hash: string): Promise<boolean> {
    const result = await bcrypt.compare(value, hash)
    return result
  }
}