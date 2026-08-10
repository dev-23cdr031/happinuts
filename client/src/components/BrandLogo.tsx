export default function BrandLogo({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  const logoSize = compact ? 'h-12 w-12' : 'h-16 w-16 md:h-[4.5rem] md:w-[4.5rem]';

  return (
    <span
      className={`${logoSize} inline-flex shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-white shadow-sm`}
      data-theme={dark ? 'dark' : 'light'}
    >
      <img
        src="/assets/happi-nuts-logo.png"
        alt="Happi Nuts logo"
        className="h-full w-full object-cover"
      />
    </span>
  );
}
