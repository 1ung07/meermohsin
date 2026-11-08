export default function CaseStudySidebar() {
  return (
    <>
  <div className="case-study-side-bar">
    <div className="close-sidebar">
      <svg  xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
  <path d="M1.29074 23L0 21.7093L10.2093 11.5L0 1.29074L1.29074 0L11.5 10.2093L21.7093 0L23 1.29074L12.7907 11.5L23 21.7093L21.7093 23L11.5 12.7907L1.29074 23Z" fill="#E6E6E6"/>
</svg>
    </div>
    <div className="image-hero-side" >
      <img src="" alt="Hero Image" loading="lazy" decoding="async" width="1200" height="800" />
    </div>
    
    <div className="image-bg-hero">
        <img src="" alt="Background Image" loading="lazy" decoding="async" width="1200" height="800" />
    </div>
      <div className="date-about-project">
       <p className="sidebar-date"></p>
    </div>
    <h1 className="sidebar-h1">lorem ipsum</h1>
    
        <p className="sidebar-p">Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum voluptatibus quisquam similique. Necessitatibus, natus? Odio magni rerum, optio unde adipisci expedita quod ab dolores quis dolorem recusandae quidem doloremque dolorum!</p>
 <div className="project-tags"></div>
 <section className="gallery-section">

    <h3>Gallery</h3>

    <div className="gallery-grid"></div>

</section>
<section className="project-role">

    <div className="section-heading">
        <span>Contribution</span>
    </div>

    <ul className="role-list">
        {/* JS will inject */}
    </ul>

</section>

{/* Live Project CTA */}

      {/* <div className="image-hero-side">
        <div>
      <img src="./06a92584b2cf541dcfcc519703b8a001.jpg" alt="" />
      </div>
      <div>
        <img src="./06a92584b2cf541dcfcc519703b8a001.jpg" alt="" />
    </div>
      </div> */}

    
</div>


    </>
  );
}
