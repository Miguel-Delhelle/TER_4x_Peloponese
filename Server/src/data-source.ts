import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./User/User"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./GreeceAnatomy.sqlite",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})
