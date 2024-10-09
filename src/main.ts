import { Container } from "inversify";
import { App } from "./app";
import { ExceptionFilters } from "./errors/exception.filter";
import { LoggerService } from "./logger/logger.service";
import { ILogger } from "./logger/logger.interface";
import { TYPES } from "./types";
import { IExceptionFilters } from "./errors/exception.filter.interface";
import { IConfigService } from "./config/config.service.interface";
import { ConfigService } from "./config/config.service";
import customersModule from "./modules/customers/customers.module";
import { DataSource } from "typeorm";
import { dataSource } from "./ormconfig";

export interface IBootstrapRun{
    appContainer:Container,
    app:App
}


function bootstrap(){
    const appContainer = new Container();
    appContainer.bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope()
    appContainer.bind<IExceptionFilters>(TYPES.ExceptionFilter).to(ExceptionFilters)
    appContainer.bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope()   
    appContainer.bind<App>(TYPES.Application).to(App)
    appContainer.bind<DataSource>(DataSource).toConstantValue(dataSource);

    const app = appContainer.get<App>(TYPES.Application)

    const controllers = [
        ...customersModule.controllers
    ];
    // here we load custom modules
    appContainer.load(customersModule.module);
    
    //end 

    app.connectToDb();
   
    return {appContainer,app,controllers}
}
export const {appContainer,app,controllers} = bootstrap()
app.init(controllers);