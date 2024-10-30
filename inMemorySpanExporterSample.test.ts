import * as assert from 'assert';
import {
  ConsoleSpanExporter,
  InMemorySpanExporter,
  SimpleSpanProcessor,
  Tracer,
} from '@opentelemetry/sdk-trace-node'
import request from 'supertest'
import { context, trace } from '@opentelemetry/api';
import http from 'http';
import { initializeSDK } from "./instrumentation";
// INMPORTANT: invoke before import app
// NodeSDK not supporting forceFlush then shuld use SimpleSpanProcessor for get spans immediately.
const memoryExporter = new InMemorySpanExporter();
initializeSDK(new SimpleSpanProcessor(new ConsoleSpanExporter))

import app from "./app";


/**
 * 指定時間処理を停止する関数
 * @param {number} ms 待機するミリ秒数
 */
async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


describe('InMemorySpanExporter', () => {
  beforeEach(() => {
    memoryExporter.reset()
  });

  it('should get finished spans', async () => {
    request(app)
      .get('/rolldice')
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
      })
    await sleep(1000)
    const spans = memoryExporter.getFinishedSpans()
    expect(spans).toEqual("hoge")
  });
});