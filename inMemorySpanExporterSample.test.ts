import * as assert from 'assert';
import {
  InMemorySpanExporter,
  SimpleSpanProcessor,
  BasicTracerProvider,
} from '@opentelemetry/sdk-trace-node'
import { context, trace } from '@opentelemetry/api';

describe('InMemorySpanExporter', () => {
  let memoryExporter: InMemorySpanExporter;
  let provider: BasicTracerProvider;

  beforeEach(() => {
    memoryExporter = new InMemorySpanExporter();
    provider = new BasicTracerProvider();
    // simpleSpanProcessor使っている
    provider.addSpanProcessor(new SimpleSpanProcessor(memoryExporter));
  });

  it('should get finished spans', () => {
    const root = provider.getTracer('default').startSpan('root');
    const child = provider
      .getTracer('default')
      .startSpan('child', {}, trace.setSpan(context.active(), root));
    const grandChild = provider
      .getTracer('default')
      .startSpan('grand-child', {}, trace.setSpan(context.active(), child));

    assert.strictEqual(memoryExporter.getFinishedSpans().length, 0);
    grandChild.end();
    assert.strictEqual(memoryExporter.getFinishedSpans().length, 1);
    child.end();
    assert.strictEqual(memoryExporter.getFinishedSpans().length, 2);
    root.end();
    assert.strictEqual(memoryExporter.getFinishedSpans().length, 3);

    const [span1, span2, span3] = memoryExporter.getFinishedSpans();
    assert.strictEqual(span1.name, 'grand-child');
    assert.strictEqual(span2.name, 'child');
    assert.strictEqual(span3.name, 'root');
    assert.strictEqual(
      span1.spanContext().traceId,
      span2.spanContext().traceId
    );
    assert.strictEqual(
      span2.spanContext().traceId,
      span3.spanContext().traceId
    );
    assert.strictEqual(span1.parentSpanId, span2.spanContext().spanId);
    assert.strictEqual(span2.parentSpanId, span3.spanContext().spanId);
  });

});