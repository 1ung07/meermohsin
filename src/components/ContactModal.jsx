export default function ContactModal() {
  return (
    <>
  <div className="modal-contact-us">
    <div className="close-sidebar-contact">
      
      <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
        <path
          d="M1.29074 23L0 21.7093L10.2093 11.5L0 1.29074L1.29074 0L11.5 10.2093L21.7093 0L23 1.29074L12.7907 11.5L23 21.7093L21.7093 23L11.5 12.7907L1.29074 23Z"
          fill="#E6E6E6" />
      </svg>
    </div>

    <h1>GET IN <span className="fancy">TOUCH</span> </h1>
    <img src="./assets/contact-us-bg-_S1DUN49.webp" alt="contact-us-bg" loading="lazy" decoding="async" width="1200" height="800" />
  <form action="https://api.web3forms.com/submit" method="POST">

  {/* Your Web3Forms Access Key */}
  <input type="hidden" name="access_key" value="92477dad-e412-494b-8996-f561db233348" />

  <input
    type="text"
    name="name"
    placeholder="Your Good Name"
    required
   />

  <input
    type="tel"
    name="phone"
    placeholder="Your Number"
    required
   />

  <input
    type="email"
    name="email"
    placeholder="Your Email"
    required
   />

  <textarea
    name="message"
    className="textarea"
    placeholder="Please type your concern here!"
    required
  ></textarea>

  <input
    type="submit"
    value="Submit"
    className="cta-submit"
   />

</form>
  </div>
    </>
  );
}
