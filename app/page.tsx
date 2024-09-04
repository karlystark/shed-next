import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="Home container mx-auto py-12 flex flex-col items-center">
      <div className="flex">
      <Image src="/bowl-green.png" alt="a simple line drawing of a bowl" height="200" width="200"></Image>
      <Image src="/bottle-green.png" alt="a simple line drawing of a bottle" height="200" width="200"></Image>
      <Image src="/grass-green.png" alt="a simple line drawing of grass" height="200" width="200"></Image>
      <Image src="/cart-green.png" alt="a simple line drawing of a cart" height="200" width="200"></Image>
      <Image src="/bucket-green.png" alt="a simple line drawing of a bucket" height="200" width="200"></Image>
      </div>
      <h1 className="text-6xl font-bold mb-6">Welcome to Shed</h1>
      <p className="mb-6 text-xl">A resource-sharing app for chosen family networks.</p>
      <div className="space-x-4 mt-6 mr-4">
        <Link href="/about" className="bg-[var(--green)] hover:bg-[var(--pink)] text-white text-lg font-bold py-2 px-4 rounded">
          Learn More
        </Link>
        <Link href="/signup" className="bg-[var(--green)] hover:bg-[var(--pink)] text-white text-lg font-bold py-2 px-4 rounded">
          Sign Up
        </Link>
        <Link href="/login" className="bg-[var(--green)] hover:bg-[var(--pink)] text-white text-lg font-bold py-2 px-4 rounded">
          Log In
        </Link>
      </div>
    </div>
  );
}



