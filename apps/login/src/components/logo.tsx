type Props = {
  darkSrc?: string;
  lightSrc?: string;
  height?: number;
  width?: number;
};

export function Logo({ lightSrc, darkSrc, height = 40, width = 147.5 }: Props) {
  const effectiveLightSrc = lightSrc || darkSrc;
  const effectiveDarkSrc = darkSrc || lightSrc;

  return (
    <>
      {effectiveDarkSrc && (
        <div className="hidden dark:flex">
          <img height={height} width={width} src={effectiveDarkSrc} alt="logo" />
        </div>
      )}
      {effectiveLightSrc && (
        <div className="flex dark:hidden">
          <img height={height} width={width} src={effectiveLightSrc} alt="logo" />
        </div>
      )}
    </>
  );
}
