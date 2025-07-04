export default function ColorFontTest() {
  return (
    <div>
      <div className="text-accent bg-primary font-sans p-4">
        This should be green text on black background, Open Sans.
      </div>
      <div className="font-mono p-4">
        This should be IBM Plex Mono.
      </div>
      <div className="text-[#00f5a0] bg-[#1c1c1c] p-4">
        This should be green text on black background (arbitrary values).
      </div>
    </div>
  );
}