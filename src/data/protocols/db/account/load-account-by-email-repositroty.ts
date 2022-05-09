import { AccountModel } from "@/data/usecases/db-add-account/db-add-account-protocols";

export interface LoadAccountByEmailRepository {
  loadByEmail (email:string): Promise<AccountModel>
}