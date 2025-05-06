import APP from "./app";
import { CONFIG } from "./config";
import LOGGER from "./config/logger";

const startServer = () => {
    try {
        APP.listen(CONFIG.PORT, () => {
            console.log(`Server is running on port ${CONFIG.PORT}`);
            LOGGER.info(`Server is running on port ${CONFIG.PORT}`);
        });
    } catch (error) {
        console.log(error);
        LOGGER.error(error);
        process.exit(1);
    }
};

startServer();
