import Image from 'next/image';
import { cookies } from 'next/headers';
import LandingGate from './components/landingGate/landingGate';

export const dynamic = 'force-dynamic';

export default function Home() {
  const unlocked = cookies().get('shed_access')?.value === 'granted';

  return (
    <div className="Home container mx-auto py-12 px-4 flex flex-col items-center">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
        <Image className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-[200px] lg:h-[200px]" src="/bowl-green.png" alt="a simple line drawing of a bowl" height="200" width="200"></Image>
        <Image className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-[200px] lg:h-[200px]" src="/bottle-green.png" alt="a simple line drawing of a bottle" height="200" width="200"></Image>
        <Image className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-[200px] lg:h-[200px]" src="/grass-green.png" alt="a simple line drawing of grass" height="200" width="200"></Image>
        <Image className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-[200px] lg:h-[200px]" src="/cart-green.png" alt="a simple line drawing of a cart" height="200" width="200"></Image>
        <Image className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-[200px] lg:h-[200px]" src="/bucket-green.png" alt="a simple line drawing of a bucket" height="200" width="200"></Image>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 mt-6 text-center">Welcome to Shed</h1>
      <p className="mb-6 text-base sm:text-xl text-center">A resource-sharing app for chosen family networks.</p>
      <LandingGate initiallyUnlocked={unlocked} />
    </div>
  );
}
