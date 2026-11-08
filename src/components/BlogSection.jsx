export default function BlogSection() {
  return (
    <>
  <div className="blog-section" id="blog">
    <div className="blogs-main-headings">

      <p className="blog-heading">
        VISUAL 
        <span className="fonts">
          JOURNAL
        </span>
      </p>

      <div className="points-blogs">
        <span className="blog-para">
          A collection of design experiments, creative processes,
          front-end discoveries, and visual stories. Every project
          begins with an idea, evolves through exploration, and
          becomes an experience worth sharing.
        </span>
      </div>

    </div>

    <div className="cards-blogs">

      <div className="card-1">
        <div className="image-blog">
          <img src="./src/assets/Images/fall-star.gif" alt="Fall Star" loading="lazy" decoding="async" width="1200" height="800" />
          <div className="follow-blog"></div>
        </div>

        <p>Motion Beyond Animation</p>
        <span>July 1, 2026</span>
      </div>

      <div className="card-1">
        <div className="image-blog">
          <img src="./src/assets/Images/dark.jpg" alt="Dark Interface" loading="lazy" decoding="async" width="1200" height="800" />
          <div className="follow-blog"></div>
        </div>

        <p>The Psychology of Dark Interfaces</p>
        <span>June 14, 2026</span>
      </div>

      <div className="card-1">
        <div className="image-blog">
          <img src="./src/assets/1 (8).jpg" alt="Visual Story" loading="lazy" decoding="async" width="1200" height="800" />
          <div className="follow-blog"></div>
        </div>

        <p>Designing Experiences, Not Websites</p>
        <span>May 22, 2026</span>
      </div>
    </div>
  </div>
    </>
  );
}
