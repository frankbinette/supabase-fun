export default function Title({ title, subtitle, date }: { title: string; subtitle?: string; date?: string }) {
  return (
    <div className="px-3 py-3 pt-md-5 pb-md-4 mx-auto">
      <div className="row">
        <div className="col mb-4">
          <h1 className="display-4">{title}</h1>
          {subtitle && <p className="lead text-muted">{subtitle}</p>}
          {date && <p className="lead text-muted">{date}</p>}
        </div>
      </div>
    </div>
  );
}
