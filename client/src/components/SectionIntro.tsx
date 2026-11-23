export default function SectionIntro({
  index,
  title,
  lede,
}: {
  index: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="mb-12 max-w-2xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
        {index}
      </p>
      <h2 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
        {title}
      </h2>
      {lede ? (
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {lede}
        </p>
      ) : null}
    </div>
  );
}
