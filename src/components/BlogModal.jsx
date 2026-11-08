export default function BlogModal() {
  return (
    <>
  <div className="modal-blogs">
    <div className="close-sidebar-blog">
      <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
        <path
          d="M1.29074 23L0 21.7093L10.2093 11.5L0 1.29074L1.29074 0L11.5 10.2093L21.7093 0L23 1.29074L12.7907 11.5L23 21.7093L21.7093 23L11.5 12.7907L1.29074 23Z"
          fill="#E6E6E6" />
      </svg>
    </div>
    <div className="content-blogs">
      <div className="Date-blog">lorem ipsum</div>
      <h1>LOREM IPSUM</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius corrupti non ipsa molestiae voluptate numquam
        similique itaque accusantium quam ex. Commodi inventore modi eius nisi perferendis dolor dolorem minus at!</p>
      <div className="by-who">
        MEER MOHSIN
      </div>
    </div>
    <div className="image-blog">
      <img src="./src/assets/1 (8).jpg" alt="blog-hero" loading="lazy" decoding="async" width="1200" height="800" />
    </div>
  </div>
    </>
  );
}
