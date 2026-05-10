/**
 * ZK Benchmarking Utility
 */

export interface ZKBenchmarkResult {
  witnessTime: number;
  proofTime: number;
  totalTime: number;
  proofSize: number;
  deviceInfo?: string;
}

export const logBenchmark = (result: ZKBenchmarkResult) => {
  console.log('--- ZK Benchmark ---');
  console.log(`Witness Computation: ${result.witnessTime}s`);
  console.log(`Proof Generation: ${result.proofTime}s`);
  console.log(`Total Latency: ${result.totalTime}s`);
  console.log(`Proof Size: ${result.proofSize} bytes`);
  console.log('--------------------');
};
