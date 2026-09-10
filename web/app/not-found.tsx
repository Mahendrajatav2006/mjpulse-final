import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#05060b] text-white">
      <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
      <Link href="/" className="text-pink-400 underline text-sm">
        Return to MJ PULSE
      </Link>
    </div>
  );
}
