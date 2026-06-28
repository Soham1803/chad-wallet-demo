import Image from "next/image";

export default function FeatureCard({
  title,
  description,
  imageAlt,
  imageSrc,
}: TFeatureCardProps) {
  return (
    <div className="p-6 h-120 overflow-hidden rounded-2xl bg-[#030816] border border-dark-border/80 hover:border-brand-green/40 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center gap-4">
      <h3 className="text-lg font-bold text-brand-green">{title}</h3>
      <p className="text-xl text-foreground/60 leading-relaxed">
        {description}
      </p>
      <div className="w-2/3">
        <Image
          alt={imageAlt}
          src={imageSrc}
          width={10000}
          height={10000}
          className="w-full"
        />
      </div>
    </div>
  );
}

type TFeatureCardProps = {
  title: string;
  description: string;
  imageAlt: string;
  imageSrc: string;
};
