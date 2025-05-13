import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User/User"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./greekAnatomic.sqlite",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})
