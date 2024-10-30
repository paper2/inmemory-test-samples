import { ConsoleSpanExporter, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { initializeSDK } from "./instrumentation";
initializeSDK(new SimpleSpanProcessor(new ConsoleSpanExporter()))

import app from "./app";

const PORT: number = parseInt(process.env.PORT || '8080');

app.listen(PORT, () => {
    console.log(`Listening for requests on http://localhost:${PORT}`);
});