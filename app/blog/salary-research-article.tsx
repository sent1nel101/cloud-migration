/**
 * Blog article: researching salaries for any career.
 * Rendered inline on the blog page (expands from the post card).
 */

const link = (href: string, label: string) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {label}
  </a>
)

export default function SalaryResearchArticle() {
  return (
    <div className="blog-article-body">
      <p>
        Before you commit time and money to a career change, you need a
        realistic idea of what the new role pays: where you&apos;re likely to
        start, and where you could be in a few years. Here&apos;s a simple
        process that works for any field, from nursing and the skilled trades
        to teaching, finance, and tech.
      </p>

      <h4>1. Start with free government data</h4>
      <p>
        Government sources cover nearly every occupation and aren&apos;t
        skewed by who chooses to self-report.
      </p>
      <ul>
        <li>
          {link("https://www.bls.gov/ooh/", "Occupational Outlook Handbook (BLS)")}:
          median pay, typical education or training, and projected job growth
          for hundreds of occupations.
        </li>
        <li>
          {link("https://www.careeronestop.org/Toolkit/Wages/find-salary.aspx", "CareerOneStop Salary Finder")}:
          wages by occupation for your state or metro area, including
          entry-level and experienced ranges.
        </li>
        <li>
          {link("https://www.onetonline.org/", "O*NET OnLine")}: wages and
          outlook plus the day-to-day tasks, skills, and credentials each job
          requires. It&apos;s useful for spotting which of your current skills
          transfer.
        </li>
      </ul>

      <h4>2. Check real job postings in your area</h4>
      <p>
        A growing number of US states and cities require employers to list a
        pay range in job postings. Search your target job title on the major
        job boards for your location and note the ranges you see. Postings
        also show which certifications, licenses, or experience levels
        employers expect at each pay level.
      </p>

      <h4>3. Use crowd-sourced sites as a cross-check</h4>
      <p>
        Sites like Glassdoor, Payscale, and Indeed Salaries show self-reported
        pay by employer and location. They&apos;re helpful for comparing
        specific employers, but sample sizes can be small, so treat them as a
        rough guide rather than a single source of truth.
      </p>

      <h4>4. Look for published pay scales</h4>
      <p>
        Many jobs have public, fixed pay schedules: government roles (see the{" "}
        {link("https://www.opm.gov/policy-data-oversight/pay-leave/salaries-wages/", "OPM federal pay tables")}),
        public school districts (teacher salary schedules), and union trades
        (apprentice and journeyworker rates). These show exactly how pay grows
        with years of service, education, or apprenticeship progress.
      </p>

      <h4>5. Compare total pay, not just the salary</h4>
      <p>
        Two offers with the same base pay can be very different. Factor in
        overtime, shift differentials, tips or commission, bonuses, health
        insurance, retirement contributions or pensions, paid time off, and
        tuition assistance. For hourly roles, estimate yearly pay from
        realistic weekly hours.
      </p>

      <h4>6. Build your own realistic range</h4>
      <ul>
        <li>
          Collect figures from at least three sources and write down a low,
          middle, and high number for your location.
        </li>
        <li>
          Assume you&apos;ll start near the entry-level end, unless your
          current experience directly applies to the new role (it often
          does). Be ready to explain why.
        </li>
        <li>
          Plan for the transition itself: training or licensing costs, time
          spent studying, and a possible temporary pay dip. Know how long your
          savings can cover it.
        </li>
        <li>
          Revisit your numbers once you have a certification or license in
          hand. Credentials are often what unlock the next pay step.
        </li>
      </ul>

      <p>
        Once you have a target role and a realistic range,{" "}
        <a href="/">generate your free FutureMap roadmap</a> to
        see the skills, credentials, and steps that get you there.
      </p>
    </div>
  )
}
