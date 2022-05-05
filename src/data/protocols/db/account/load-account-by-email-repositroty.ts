import { AccountModel } from "../../../usecases/db-add-account/db-add-account-protocols";

export interface LoadAccountByEmailRepository {
  loadByEmail (email:string): Promise<AccountModel>
}