import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled React Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ background: '#070709', color: '#F4F4F5', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
          <h1 style={{ color: '#EF4444', fontSize: '1.4rem' }}>⚠️ ERROR EN TIEMPO DE EJECUCIÓN AION AEGIS</h1>
          <p style={{ fontSize: '0.9rem', color: '#C4B5FD' }}>{this.state.error?.toString()}</p>
          <pre style={{ background: '#111017', padding: '1rem', borderRadius: '8px', fontSize: '0.78rem', overflowX: 'auto' }}>
            {this.state.error?.stack}
          </pre>
          <button
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{ background: '#7C3AED', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', marginTop: '1rem' }}
          >
            🔄 Limpiar Caché y Reiniciar App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
