export const metadata = {
  title: 'Leph Maat',
  description: 'Sistema de consulta en línea.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
