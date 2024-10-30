import {
  ConsoleSpanExporter,
  InMemorySpanExporter,
  SimpleSpanProcessor,
  Tracer,
} from '@opentelemetry/sdk-trace-node'
import http from 'http';
import { initializeSDK } from "./instrumentation";
// INMPORTANT: invoke before import app
// NodeSDK not supporting forceFlush then shuld use SimpleSpanProcessor for get spans immediately.
const memoryExporter = new InMemorySpanExporter();
initializeSDK(new SimpleSpanProcessor(memoryExporter))

import app from "./app";

let server: http.Server;

beforeAll((done) => {
  server = app.listen(3000, () => done());
});

beforeEach(() => {
  memoryExporter.reset()
});

afterAll((done) => {
  server.close(done);
});

test('GET /hello should return Hello, World!', async () => {
  // 実際に成功はしている
  const response = await fetch('http://localhost:3000/rolldice');
  expect(response.status).toBe(200);
  const spans = memoryExporter.getFinishedSpans()[0]
  // これfetchの自動計装が出てくる。app側のトレースは出てきてなさそう。。。
  expect(spans).toMatchObject({ hoge: "test" })
});