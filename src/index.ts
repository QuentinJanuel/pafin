import "module-alias/register";

import { getNumber } from "./env";
import { logger } from "./logger";
import { app } from "./server";

const PORT = getNumber("PORT");

app.listen(PORT, () => {
    logger.info(`Listening on port ${PORT}`);
});
