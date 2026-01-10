import { LocationProvider } from '@/entities/location';
import { HomePage } from '@/pages/Home';

export default function App() {
  return (
    <LocationProvider>
      <HomePage />
    </LocationProvider>
  );
}
