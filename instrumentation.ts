/*instrumentation.ts*/
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter, SimpleSpanProcessor, SpanProcessor } from '@opentelemetry/sdk-trace-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import {
    PeriodicExportingMetricReader,
    ConsoleMetricExporter,
} from '@opentelemetry/sdk-metrics';

export const initializeSDK = (spanProcessor?: SpanProcessor): void => {
    const sdk = new NodeSDK({
        spanProcessors: [
            spanProcessor ?? new SimpleSpanProcessor(new ConsoleSpanExporter())
        ],
        metricReader: new PeriodicExportingMetricReader({
            exporter: new ConsoleMetricExporter(),
        }),
        instrumentations: [getNodeAutoInstrumentations()],
    });

    sdk.start();
}