/// <reference types="sequelize" />
import * as Sequelize from 'sequelize';
export interface Table_Keys {
    id: string;
    username: string;
    password: string;
}
export interface Settings {
    user_model: any;
    table_keys?: any;
}
export declare class UserManager {
    db: Sequelize.Sequelize;
    User_Model: any;
    user_model: any;
    private sessionCollection;
    private table_keys;
    constructor(db: Sequelize.Sequelize, settings: Settings);
    prepare_new_user(fields: any): any;
    create_user(fields: any, uniqueField?: string | string[]): Promise<any>;
    createUser(fields: any, uniqueField?: string | string[]): Promise<any>;
    getUser(id: any): Promise<User_With_Password>;
    getSessionCollection(): any;
    getUserCollection(): any;
    private validateParameters(request);
    private sanitizeRequest(request);
    fieldExists(key: string, value: any): Promise<boolean>;
    checkUniqueness(user: any, field?: string): Promise<void>;
}
export declare class User_Manager extends UserManager {
    constructor(db: Sequelize.Sequelize, settings: Settings);
}
