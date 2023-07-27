import "module-alias/register";

import { Env } from "./env";
import { logger } from "./logger";
import { app } from "./server";

const PORT = Env.getNumber("PORT");

app.listen(PORT, () => {
    logger.info(`Listening on port ${PORT}`);
});
