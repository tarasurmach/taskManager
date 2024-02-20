import {DataSource, DataSourceOptions} from "typeorm";
import * as dotenv from "dotenv"
dotenv.config()
import * as process from "process";
import * as path from "path";

console.log(path.join(__dirname, "../src/typeorm/User.entity.js"))
console.log(path.join(__dirname, "migrations/*.js"));


export const dataSourceOptions:DataSourceOptions = {

    type:"mysql",
    host:process.env.HOST,
    port:+process.env.DB_PORT,
    username:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE,
    entities:["dist/src/**/*.entity.js"],

    synchronize:false,
    migrations:[

        "dist/db/migrations/*.js"

    ]
}
const dataSource = new DataSource(dataSourceOptions);
export default dataSource
