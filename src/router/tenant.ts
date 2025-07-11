import express, {
    NextFunction,
    RequestHandler,
    Request,
    Response,
} from "express";
import { TenantController } from "../controller/TenantController";
import { TenantService } from "../services/TenantService";
import { AppDataSource } from "../config/data-source";
import { Tenant } from "../entity/Tenant";
import LOGGER from "../config/logger";
import authentication from "../middlewares/authentication";
import { routeProtection } from "../middlewares/routeProtection";
import { CreateTenantRequest } from "../types";
import { ROLES } from "../constants";
import { tenantValidator } from "../validator/tenantValidator";

const TenantRouter = express.Router();

//repository
const tenantRepository = AppDataSource.getRepository(Tenant);

//services
const tenantService = new TenantService(tenantRepository);

//controllers
const tenantController = new TenantController(tenantService, LOGGER);

//routes

TenantRouter.post(
    "/",
    authentication,
    tenantValidator,
    routeProtection([ROLES.ADMIN]),
    (async (req: CreateTenantRequest, res: Response, next: NextFunction) => {
        await tenantController.create(req, res, next);
    }) as unknown as RequestHandler,
);
TenantRouter.put(
    "/:id",
    authentication,
    tenantValidator,
    routeProtection([ROLES.ADMIN]),

    (async (req: CreateTenantRequest, res: Response, next: NextFunction) => {
        await tenantController.update(req, res, next);
    }) as unknown as RequestHandler,
);
TenantRouter.delete(
    "/:id",
    authentication,
    routeProtection([ROLES.ADMIN]),
    (async (req: CreateTenantRequest, res: Response, next: NextFunction) => {
        await tenantController.delete(req, res, next);
    }) as unknown as RequestHandler,
);

TenantRouter.get(
    "/",
    authentication as RequestHandler,
    routeProtection([ROLES.ADMIN]),
    (async (req: CreateTenantRequest, res: Response, next: NextFunction) => {
        await tenantController.getList(req, res, next);
    }) as unknown as RequestHandler,
);
TenantRouter.get(
    "/:id",
    authentication,
    routeProtection([ROLES.ADMIN]),
    (async (req: CreateTenantRequest, res: Response, next: NextFunction) => {
        await tenantController.getById(req, res, next);
    }) as unknown as RequestHandler,
);

export default TenantRouter;
