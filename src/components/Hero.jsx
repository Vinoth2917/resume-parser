// The opening: a headline, and a sample résumé sheet showing what the results look like.
export default function Hero() {
  return (
    <section className="hero">
      <div>
        <h1 className="hero__title">Find what your résumé is missing before you apply.</h1>
        <p className="hero__lede">
          Upload your résumé and paste the job posting. You get a score, the skills the job asks for that
          you have not mentioned, and your résumé with your matches marked.
        </p>
      </div>

      <figure className="specimen" aria-label="Example of a résumé with matches highlighted">
        <p className="specimen__line">
          Built checkout flows in <mark className="hl">React</mark> and{" "}
          <mark className="hl">TypeScript</mark> for 120,000 monthly shoppers.
        </p>
        <p className="specimen__line">
          Cut API response times by 40% by caching hot queries in <mark className="hl">Redis</mark>.
        </p>
        <p className="specimen__line">Ran releases for four teams using Docker.</p>
        <figcaption className="specimen__note">The job also asks for Kubernetes. Not in this résumé.</figcaption>
      </figure>
    </section>
  );
}
