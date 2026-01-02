import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// #region agent log
fetch('http://127.0.0.1:7242/ingest/078eead1-c0e6-45d9-991e-8437a95e7a31',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:8',message:'Checking root element styles',data:{rootExists:!!document.getElementById('root'),bodyStyles:getComputedStyle(document.body).getPropertyValue('height'),htmlStyles:getComputedStyle(document.documentElement).getPropertyValue('height')},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'E'})}).catch(()=>{});
// #endregion

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// #region agent log
setTimeout(() => {
  const rootEl = document.getElementById('root');
  if (rootEl) {
    const rootStyles = getComputedStyle(rootEl);
    fetch('http://127.0.0.1:7242/ingest/078eead1-c0e6-45d9-991e-8437a95e7a31',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:18',message:'Root element computed styles after render',data:{maxWidth:rootStyles.maxWidth,width:rootStyles.width,height:rootStyles.height,padding:rootStyles.padding,margin:rootStyles.margin,textAlign:rootStyles.textAlign},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'E'})}).catch(()=>{});
  }
  const bodyStyles = getComputedStyle(document.body);
  const htmlStyles = getComputedStyle(document.documentElement);
  fetch('http://127.0.0.1:7242/ingest/078eead1-c0e6-45d9-991e-8437a95e7a31',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:25',message:'Body and HTML computed styles',data:{bodyHeight:bodyStyles.height,bodyMinHeight:bodyStyles.minHeight,htmlHeight:htmlStyles.height,htmlMinHeight:htmlStyles.minHeight,viewportHeight:window.innerHeight},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'F'})}).catch(()=>{});
}, 100);
// #endregion
