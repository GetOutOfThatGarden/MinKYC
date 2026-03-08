import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

// Load our pre-compiled Noir circuit
import circuit from '../constants/minkyc_circuits.json';

interface ZKProverProps {
  onProofGenerated: (proof: Uint8Array, publicInputs: string[]) => void;
  onError: (error: string) => void;
  inputs: {
    dob: string;
    passport_name_hash: string;
    submitted_name_hash: string;
    secret: string;
    current_date: string;
    salt: string;
    commitment: string;
  } | null;
}

/**
 * Invisible WebView component that executes Noir Barretenberg WASM.
 * Mobile JS engines struggle with huge WASM crypto, so this bridges to a WebKit context.
 * 
 * NOTE: We use esm.sh with ?bundle-deps flag which returns proper CORS headers,
 * and set a baseUrl to avoid 'null' origin CORS issues with ES module imports.
 */
export const ZKProver: React.FC<ZKProverProps> = ({ inputs, onProofGenerated, onError }) => {
  const webviewRef = useRef<WebView>(null);
  const [html, setHtml] = useState<string>('');
  const [webviewReady, setWebviewReady] = useState(false);

  useEffect(() => {
    // Build the HTML with classic script loading (no ES module imports)
    // Using esm.sh which properly handles CORS headers for cross-origin requests
    setHtml(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <div id="status">Initializing ZK Engine...</div>
        <script>
          // Signal readiness and define proof generation
          var zkReady = false;
          var pendingInputs = null;
          var pendingCircuit = null;

          function log(msg) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'LOG', msg: msg }));
          }

          function reportError(err) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', error: typeof err === 'string' ? err : (err.message || err.toString()) }));
          }

          // Dynamic import works from a proper baseUrl origin
          async function loadDeps() {
            try {
              log('Loading Noir dependencies...');
              var bbMod = await import('https://esm.sh/@noir-lang/backend_barretenberg@0.33.0?bundle-deps');
              var noirMod = await import('https://esm.sh/@noir-lang/noir_js@0.33.0?bundle-deps');
              window._BarretenbergBackend = bbMod.BarretenbergBackend;
              window._Noir = noirMod.Noir;
              zkReady = true;
              log('Noir dependencies loaded successfully!');
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'READY' }));
              
              // If inputs were already pending, run now
              if (pendingInputs && pendingCircuit) {
                runProof(pendingInputs, pendingCircuit);
              }
            } catch (err) {
              reportError('Failed to load Noir deps: ' + (err.message || err));
            }
          }

          async function runProof(inputs, circuit) {
            try {
              log('Starting proof generation...');
              var backend = new window._BarretenbergBackend(circuit, { threads: navigator.hardwareConcurrency || 1 });
              var noir = new window._Noir(circuit);
              
              log('Step 1: Executing circuit to generate witness...');
              var execResult = await noir.execute(inputs);
              log('Witness generated! Step 2: Generating proof...');
              var proof = await backend.generateProof(execResult.witness);
              
              window.ReactNativeWebView.postMessage(JSON.stringify({ 
                type: 'SUCCESS', 
                proof: Array.from(proof.proof), 
                publicInputs: proof.publicInputs
              }));
            } catch (err) {
              reportError(err);
            }
          }

          window.generateProof = function(inputsStr, circuitStr) {
            try {
              var inputs = JSON.parse(inputsStr);
              var circuit = JSON.parse(circuitStr);
              if (zkReady) {
                runProof(inputs, circuit);
              } else {
                log('Dependencies still loading, queuing proof request...');
                pendingInputs = inputs;
                pendingCircuit = circuit;
              }
            } catch (err) {
              reportError(err);
            }
          };

          // Start loading dependencies immediately
          loadDeps();
        </script>
      </body>
      </html>
    `);
  }, []);

  useEffect(() => {
    if (inputs && html && webviewRef.current) {
      // Trigger the proof generation once inputs are provided
      const inputsStr = JSON.stringify(inputs).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      const circuitStr = JSON.stringify(circuit).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      const script = `window.generateProof('${inputsStr}', '${circuitStr}'); true;`;
      webviewRef.current.injectJavaScript(script);
    }
  }, [inputs, html, webviewReady]);

  const onMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'SUCCESS') {
        onProofGenerated(new Uint8Array(data.proof), data.publicInputs);
      } else if (data.type === 'ERROR') {
        onError(data.error);
      } else if (data.type === 'LOG') {
        console.log('[ZKProver]', data.msg);
      } else if (data.type === 'READY') {
        console.log('[ZKProver] Dependencies loaded, WebView ready');
        setWebviewReady(true);
      }
    } catch (e) {
      console.error('Failed to parse WebView message:', e);
    }
  };

  if (!html) return null;

  return (
    <View style={styles.container}>
      {/* 
        Must be rendered but can be hidden/off-screen. 
        Zero opacity or 1x1 pixel prevents it from disrupting the UI while still allowing WebKit to execute.
      */}
      <WebView
        ref={webviewRef}
        source={{ html, baseUrl: 'https://minkyc.local/' }}
        onMessage={onMessage}
        javaScriptEnabled={true}
        style={styles.webview}
        originWhitelist={['*']}
        allowUniversalAccessFromFileURLs={true}
        mixedContentMode="always"
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
