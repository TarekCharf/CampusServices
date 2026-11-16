import { Toaster } from 'react-hot-toast';

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1e293b',      // slate-800
          color: '#f1f5f9',           // slate-100
          border: '1px solid #334155', // slate-700
          fontSize: '0.875rem',
          maxWidth: 420,
          whiteSpace: 'pre-line',     // respecte les \n dans les messages
        },
        success: {
          duration: 3000,
          iconTheme: { primary: '#22c55e', secondary: '#1e293b' },
        },
        error: {
          duration: 6000,
          iconTheme: { primary: '#ef4444', secondary: '#1e293b' },
        },
      }}
    />
  );
}