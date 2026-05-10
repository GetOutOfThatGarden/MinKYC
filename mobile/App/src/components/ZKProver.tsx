import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

// Load our pre-compiled Noir circuit
import circuit from '../constants/minkyc_circuits.json';

interface ZKProverProps {
  onProofGenerated: (proof: Uint8Array, publicInputs: string[]) => void;
  onError: (error: string) => void;
  inputs: {
    dob: number;
    secret_nonce: number;
    current_date: number;
    verifier_id: number;
    caller_pubkey: number;
    commitment: string;
  } | null;
}

/**
 * ZKProver Component — Generates a ZK proof inside a WebView.
 * 
 * This component uses the real Barretenberg (UltraHonk) backend and Noir JS
 * to generate a cryptographically valid proof on-device.
 */
export const ZKProver: React.FC<ZKProverProps> = ({ inputs, onProofGenerated, onError }) => {
  const webviewRef = useRef<WebView>(null);
  const [webviewReady, setWebviewReady] = useState(false);

  // HTML content with Noir & Barretenberg JS libraries
  // We use ESM modules from a CDN as a bridge.
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { font-family: sans-serif; background: #f0f0f0; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .status { font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="status" id="status">Initializing ZK Engine...</div>
      
      <script type="module">
        import { Noir } from 'https://unpkg.com/@noir-lang/noir_js@1.0.0-beta.19/dist/index.js';
        import { BarretenbergBackend } from 'https://unpkg.com/@noir-lang/backend_barretenberg@0.36.0/dist/index.js';

        function log(msg) {
          document.getElementById('status').innerText = msg;
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'LOG', msg: msg }));
        }

        function reportError(err) {
          var errMsg = typeof err === 'string' ? err : (err.message || err.toString());
          log('Error: ' + errMsg);
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', error: errMsg }));
        }

        let noir;
        let backend;

        async function init() {
          try {
            log('Loading WASM Backend...');
            // In a real app, circuit would be fetched or passed as a prop
            // For now we wait for generateProof call which provides the circuit
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'READY' }));
          } catch (err) {
            reportError(err);
          }
        }

        window.generateProof = async function(inputsStr, circuitStr) {
          try {
            const inputs = JSON.parse(inputsStr);
            const circuit = JSON.parse(circuitStr);
            
            log('Initializing backend...');
            backend = new BarretenbergBackend(circuit.bytecode);
            noir = new Noir(circuit, backend);
            
            log('Computing witness...');
            const startTime = performance.now();
            
            // Execute circuit to get witness
            const { witness } = await noir.execute(inputs);
            
            log('Generating UltraHonk proof...');
            // Generate the ZK proof
            const proof = await backend.generateProof(witness);
            
            const endTime = performance.now();
            const duration = ((endTime - startTime) / 1000).toFixed(2);
            
            log('Proof generated in ' + duration + 's');
            
            window.ReactNativeWebView.postMessage(JSON.stringify({ 
              type: 'SUCCESS', 
              proof: Array.from(proof.proof), 
              publicInputs: proof.publicInputs,
              duration: duration
            }));
            
          } catch (err) {
            reportError(err);
          }
        };

        init();
      </script>
    </body>
    </html>
  `;

  const triggerProofGeneration = useCallback(() => {
    if (inputs && webviewReady && webviewRef.current) {
      console.log('[ZKProver] Triggering real ZK proof generation...');
      const inputsStr = JSON.stringify(inputs).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      const circuitStr = JSON.stringify(circuit).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      const script = `window.generateProof('${inputsStr}', '${circuitStr}'); true;`;
      webviewRef.current.injectJavaScript(script);
    }
  }, [inputs, webviewReady]);

  useEffect(() => {
    triggerProofGeneration();
  }, [triggerProofGeneration]);

  const onMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'SUCCESS') {
        console.log(`[ZKProver] Proof generated successfully in ${data.duration}s`);
        onProofGenerated(new Uint8Array(data.proof), data.publicInputs);
      } else if (data.type === 'ERROR') {
        onError(data.error);
      } else if (data.type === 'LOG') {
        console.log('[ZKProver]', data.msg);
      } else if (data.type === 'READY') {
        console.log('[ZKProver] WebView ready, engine initialized');
        setWebviewReady(true);
      }
    } catch (e) {
      console.error('Failed to parse WebView message:', e);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{ html, baseUrl: 'https://minkyc.local/' }}
        onMessage={onMessage}
        javaScriptEnabled={true}
        style={styles.webview}
        originWhitelist={['*']}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 0,
    height: 0,
    opacity: 0,
    overflow: 'hidden',
  },
  webview: {
    width: 1,
    height: 1,
  },
});
