export type IUser = {

}
declare global {
    namespace Express {
        export interface User extends IUser {}

    }
}