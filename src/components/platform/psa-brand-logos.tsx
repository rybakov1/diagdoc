import Image from "next/image";

interface PsaBrandLogosProps {
  size?: number;
  className?: string;
}

export function PsaBrandLogos({ size = 32, className }: PsaBrandLogosProps) {
  const classes = className ? "psa-brand-logos " + className : "psa-brand-logos";

  return (
    <span className={classes} aria-hidden="true">
      <Image src="/brands/peugeot.svg" alt="" width={size} height={size} />
      <Image src="/brands/citroen.svg" alt="" width={size} height={size} />
    </span>
  );
}
