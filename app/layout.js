import './globals.css';

export const metadata = {
  title: 'Leph Maat',
  description: 'Red de Reputación Descentralizada',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
