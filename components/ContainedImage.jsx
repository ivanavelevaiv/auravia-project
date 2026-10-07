import Image from "next/image";

// Card-style frame for showcase images: rounded, hairline border, deep shadow, dark fill.
// Put it on a positioned wrapper that sets the aspect ratio (e.g. "aspect-[4/3]").
export const imageFrameClass =
  "relative overflow-hidden rounded-2xl border border-white/5 bg-obsidian/50 shadow-2xl";

// Shows the whole photo, never cropped, whatever its shape: a 2:1 exterior, a square interior,
// or a portrait group photo. It sits centred with padding and rounded corners, over a blurred,
// faded copy of itself that fills the rest of the frame so the empty space reads as intentional
// rather than letterboxing. Both layers use the same `sizes`, so the browser fetches the file
// once. Must be placed inside a positioned element with a defined size.
export default function ContainedImage({ src, alt, sizes, priority = false, onError }) {
  return (
    <>
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        sizes={sizes}
        className="scale-110 object-cover opacity-30 blur-2xl"
      />
      <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4">
        {/* width/height only seed the aspect ratio before load; CSS sizes it to the real photo,
            capped to the frame, so it's never upscaled past its own resolution. */}
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={1000}
          sizes={sizes}
          priority={priority}
          onError={onError}
          className="h-auto max-h-full w-auto max-w-full rounded-xl object-contain shadow-[0_16px_40px_-16px_rgba(0,0,0,0.9)]"
        />
      </div>
    </>
  );
}
