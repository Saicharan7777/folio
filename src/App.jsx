import React, { useEffect, useRef, useState, useMemo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';  
import Typed from 'typed.js';
import './App.css';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [menuActive, setMenuActive] = useState(false);
  const [particlesReady, setParticlesReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const typedRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleMotionPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    handleMotionPreference();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionPreference);
    } else {
      mediaQuery.addListener(handleMotionPreference);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMotionPreference);
      } else {
        mediaQuery.removeListener(handleMotionPreference);
      }
    };
  }, []);

  useEffect(() => {
    if (!typedRef.current) return;

    if (prefersReducedMotion) {
      typedRef.current.textContent = 'Building Modern Web Apps';
      return;
    }

    const typed = new Typed(typedRef.current, {
      strings: [
        'Crafting Clean Code',
        'Building Modern Web Apps',
        'Turning Ideas into Reality',
        'Design. Develop. Deploy.',
        'Passion for Problem Solving',
      ],
      typeSpeed: 70,
      backSpeed: 40,
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal:not(.project-card)');
    if (!revealElements.length) return;

    if (prefersReducedMotion) {
      revealElements.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  useEffect(() => {
    const projectCards = document.querySelectorAll('.project-card');
    if (!projectCards.length) return;

    if (prefersReducedMotion) {
      projectCards.forEach(card => card.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, index * 300); 
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    projectCards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('header');
      const navLinks = document.querySelectorAll('header nav a');
      const sections = document.querySelectorAll('section');

      if (header) {
        header.classList.toggle('sticky', window.scrollY > 100);
      }

      let currentSectionId = '';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 150) {
          currentSectionId = sec.getAttribute('id') || '';
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuClick = () => {
    setMenuActive(prev => !prev);
  };

  const handleNavLinkClick = () => {
    if (menuActive) {
      setMenuActive(false);
    }
  };

  useEffect(() => {
    document.body.classList.toggle('light', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    if (prefersReducedMotion) return;

    initParticlesEngine(async engine => {
      await loadSlim(engine); 
    }).then(() => {
      setParticlesReady(true);
    });
  }, [prefersReducedMotion]);

  const particlesLoaded = container => {
    particlesRef.current = container;
  };

  const particlesOptions = useMemo(
    () => ({
      particles: {
        number: {
          value: 80,
          density: { enable: true, area: 800 },
        },
        color: { value: theme === 'light' ? '#5a6861' : '#a4b2ac' },
        shape: { type: 'circle' },
        opacity: {
          value: 0.5,
          anim: { enable: true, speed: 1, minimumValue: 0.1, sync: false },
        },
        size: { value: 2 },
        links: {
          enable: true,
          distance: 170,
          color: theme === 'light' ? '#5a6861' : '#a4b2ac',
          opacity: 0.6,
          width: 1.4,
        },
        move: {
          enable: true,
          speed: 1.5,
          direction: 'none',
          outModes: { default: 'bounce' },
        },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: 'repulse' },
          onClick: { enable: true, mode: 'push' },
        },
        modes: {
          repulse: { distance: 100, duration: 0.4 },
          push: { quantity: 4 },
        },
      },
      background: {
        color: 'transparent',
      },
      detectRetina: true, 
    }),
    [theme]
  );

  return (
    <>
      {particlesReady && !prefersReducedMotion && (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={particlesOptions}
        />
      )}

      <header className="header">
        <a href="#home" className="logo">
          Saicharan<span>.</span>
        </a>
        <i
          className={`fas fa-bars ${menuActive ? 'fa-times' : ''}`}
          id="menu-icon"
          onClick={handleMenuClick}
        ></i>
        <nav className={`navbar ${menuActive ? 'active' : ''}`}>
          <a href="#home" className="active" onClick={handleNavLinkClick}>
            Home
          </a>
          <a href="#about" onClick={handleNavLinkClick}>
            About
          </a>
          <a href="#coding-profiles" onClick={handleNavLinkClick}>
             Coding Profiles
          </a>
          <a href="#skills" onClick={handleNavLinkClick}>
            Skills
          </a>
          
          <a href="#projects" onClick={handleNavLinkClick}>
            Projects
          </a>
          <a href="#contact" onClick={handleNavLinkClick}>
            Contact
          </a>
          <i
            className={`fas ${theme === 'light' ? 'fa-sun' : 'fa-moon'}`}
            id="theme-toggle-icon"
            onClick={handleThemeToggle}
          ></i>
        </nav>
      </header>

      <main>
        <section className="home" id="home">
          <div className="home-content reveal">
            <h3>Software Engineer</h3>
            <h1>Saicharan Maddimsetti</h1>
            <div className="typing-container">
              <span className="typing-text" ref={typedRef}></span>
            </div>
            <p>
              I build elegant and efficient digital solutions, transforming
              complex problems into seamless user experiences with a strong
              foundation in modern web technologies and a passion for
              competitive programming.
            </p>
            <div className="social-media">
              <a
                href="https://www.linkedin.com/in/saicharan-maddimsetti-841b61290/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a
                href="https://github.com/Saicharan7777"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <i className="fab fa-github"></i>
              </a>
              <a
                href="mailto:saichranmaddimsetti188@gmail.com"
                aria-label="Email"
              >
                <i className="fas fa-envelope"></i>
              </a>
            </div>
            <a
              href="https://drive.google.com/file/d/1C8374zyXFYbljYM4Tzjxxm_VI1Zc7EpL/view?usp=drive_link"
              target="_blank"
              rel="noreferrer"
              className="cube-btn cube cube-hover"
              style={{ width: 'fit-content', padding: '1rem 3rem', textDecoration: 'none', marginTop: '2rem' }}
            >
              <div className="bg-top">
                <div className="bg-inner"></div>
              </div>
              <div className="bg-right">
                <div className="bg-inner"></div>
              </div>
              <div className="bg">
                <div className="bg-inner"></div>
              </div>
              <div className="text" style={{ padding: '0 1rem' }}>Resume</div>
            </a>
          </div>
          <div className="home-img reveal">
            <img
              src="https://uploads.onecompiler.io/42b5cwusm/44h6m53wb/Gemini_Generated_Image_qj817mqj817mqj81.png"
              alt="Saicharan Maddimsetti"
            />
          </div>
          <a href="#about" className="scroll-down" aria-label="Scroll Down">
            <i className="fas fa-chevron-down arrow1"></i>
            <i className="fas fa-chevron-down arrow2"></i>
            <i className="fas fa-chevron-down arrow3"></i>
          </a>
        </section>

        <section className="about" id="about">
          <div className="about-text reveal">
            <h2 className="heading">
              About <span>Me</span>
            </h2>
            <h3>Passionate Full-Stack Software Engineer & Problem Solver</h3>
            <p>
              I'm a dedicated software engineer with a strong foundation in web development and competitive programming. I specialize in building robust, scalable applications that solve real-world problems. My expertise spans across frontend technologies like React and JavaScript, backend systems, and database design.
            </p>
            <p>
              As a software engineer, I am driven by the pursuit of clean, efficient code and innovative solutions. I am committed to writing maintainable applications, optimizing performance, and delivering exceptional user experiences. I thrive in collaborative team environments where I can contribute to impactful projects while continuously expanding my technical skills and knowledge.
            </p>
           
          </div>
        </section>

        <section className="coding-profiles" id="coding-profiles">
          <h2 className="heading reveal">Coding Profiles</h2>
          <div className="profiles-container">
            <a
              href="https://leetcode.com/u/Saicharan_Maddimsetti/"
              className="profile-icon reveal"
              target="_blank"
              rel="noreferrer"
              title="LeetCode"
            >
              <img
                src="https://uploads.onecompiler.io/42b5cwusm/43wmyckzh/l.png"
                alt="LeetCode Logo"
              />
              <span className="profile-name">LeetCode</span>
            </a>
            <a
              href="https://www.hackerrank.com/profile/saicharanmaddim1"
              className="profile-icon reveal"
              target="_blank"
              rel="noreferrer"
              title="HackerRank"
            >
              <img
                src="https://uploads.onecompiler.io/42b5cwusm/43wmyckzh/hc.png"
                alt="HackerRank Logo"
              />
              <span className="profile-name">HackerRank</span>
            </a>
            <a
              href="https://www.codechef.com/users/charan_335566"
              className="profile-icon reveal"
              target="_blank"
              rel="noreferrer"
              title="CodeChef"
            >
              <img
                src="https://uploads.onecompiler.io/42b5cwusm/43wmyckzh/c.png"
                alt="CodeChef Logo"
              />
              <span className="profile-name">CodeChef</span>
            </a>
            <a
              href="https://codeforces.com/profile/saicharan188"
              className="profile-icon reveal"
              target="_blank"
              rel="noreferrer"
              title="Codeforces"
            >
              <img
                src="https://uploads.onecompiler.io/42b5cwusm/43wmyckzh/cf.png"
                alt="Codeforces Logo"
              />
              <span className="profile-name">Codeforces</span>
            </a>
            <a
              href="https://www.geeksforgeeks.org/user/saicharan_3355/"
              className="profile-icon reveal"
              target="_blank"
              rel="noreferrer"
              title="GeeksforGeeks"
            >
              <img
                src="https://uploads.onecompiler.io/42b5cwusm/43wmyckzh/gfg.png"
                alt="GeeksforGeeks Logo"
              />
              <span className="profile-name">GeeksforGeeks</span>
            </a>
          </div>
        </section>

        <section className="skills" id="skills">
          <h2 className="heading reveal">My Skills</h2>

          <div className="skill-category reveal">
            <h3 className="skill-category-heading">Programming Languages</h3>
            <div className="skills-container">
              <div className="glass-card skill-card reveal">
                <i className="devicon-c-plain"></i>
                <p>C</p>
              </div>
              <div className="glass-card skill-card reveal">
                <i className="devicon-cplusplus-plain"></i>
                <p>C++</p>
              </div>
              <div className="glass-card skill-card reveal">
                <i className="devicon-java-plain"></i>
                <p>Java</p>
              </div>
              <div className="glass-card skill-card reveal">
                <i className="devicon-python-plain"></i>
                <p>Python</p>
              </div>
            </div>
          </div>

          <div className="skill-category reveal">
            <h3 className="skill-category-heading">Frontend Development</h3>
            <div className="skills-container">
              <div className="glass-card skill-card reveal">
                <i className="devicon-html5-plain"></i>
                <p>HTML</p>
              </div>
              <div className="glass-card skill-card reveal">
                <i className="devicon-css3-plain"></i>
                <p>CSS</p>
              </div>
              <div className="glass-card skill-card reveal">
                <i className="devicon-javascript-plain"></i>
                <p>JavaScript</p>
              </div>
              <div className="glass-card skill-card reveal">
                <i className="devicon-react-original"></i>
                <p>React</p>
              </div>
              <div className="glass-card skill-card reveal">
                <i className="devicon-bootstrap-plain"></i>
                <p>Bootstrap</p>
              </div>
            </div>
          </div>

          <div className="skill-category reveal">
            <h3 className="skill-category-heading">Backend Development</h3>
            <div className="skills-container">
              <div className="glass-card skill-card reveal">
                <i className="devicon-nodejs-plain"></i>
                <p>Node.js</p>
              </div>
            </div>
          </div>

          <div className="skill-category reveal">
            <h3 className="skill-category-heading">Databases</h3>
            <div className="skills-container">
              <div className="glass-card skill-card reveal">
                <i className="devicon-mongodb-plain"></i>
                <p>MongoDB</p>
              </div>
              <div className="glass-card skill-card reveal">
                <i className="fas fa-database"></i>
                <p>DBMS</p>
              </div>
            </div>
          </div>

          <div className="skill-category reveal">
            <h3 className="skill-category-heading">Developer Tools</h3>
            <div className="skills-container">
              <div className="glass-card skill-card reveal">
                <i className="devicon-git-plain"></i>
                <p>Git</p>
              </div>

            </div>
          </div>
        </section>

        <section className="projects" id="projects">
          <h2 className="heading reveal">My Projects</h2>
          <div className="projects-container">
            <div className="glass-card project-card reveal">
              <img
                src="https://uploads.onecompiler.io/42b5cwusm/43wmyckzh/1.png"
                alt="Tic Tac Toe AI"
              />
              <div className="project-content">
                <h4>Tic Tac Toe (AI)</h4>
                <p>
                  Developed a responsive Tic-Tac-Toe game featuring an
                  unbeatable AI opponent, implemented using the Minimax
                  algorithm in JavaScript.
                </p>
                <div className="project-links">
                  <a
                    href="https://tic-tac-toe-main-woad.vercel.app/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                  >
                    <i className="fas fa-external-link-alt"></i> Demo
                  </a>
                  <a
                    href="https://github.com/Saicharan7777/tic-tac-toe-ai"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                  >
                    <i className="fab fa-github"></i> GitHub
                  </a>
                </div>
              </div>
            </div>

            <div className="glass-card project-card reveal">
              <img
                src="https://uploads.onecompiler.io/42b5cwusm/43wmyckzh/2.png"
                alt="Advanced Calculator"
              />
              <div className="project-content">
                <h4>Advanced Calculator</h4>
                <p>
                  Built a modern, user-friendly calculator with real-time
                  expression parsing and a theme-able interface using vanilla
                  JavaScript and CSS.
                </p>
                <div className="project-links">
                  <a
                    href="https://calculator-mu-wine.vercel.app/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                  >
                    <i className="fas fa-external-link-alt"></i> Demo
                  </a>
                  <a
                    href="https://github.com/Saicharan7777/advanced-calculator"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                  >
                    <i className="fab fa-github"></i> GitHub
                  </a>
                </div>
              </div>
            </div>
            

            <div className="glass-card project-card reveal">
              <img
                src="https://uploads.onecompiler.io/42b5cwusm/43wmyckzh/3.png"
                alt="Level Up Dev"
              />
              
              <div className="project-content">
                <h4>Level UP DEV</h4>
                <p>
                  Contributed to an interactive platform designed to help
                  developers enhance their coding skills through curated
                  challenges and learning resources.
                </p>
                <div className="project-links">
                  <a
                    href="https://leve-l-up-dev.vercel.app"
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                  >
                    <i className="fas fa-external-link-alt"></i> Demo
                  </a>
                  <a
                    href="https://github.com/Saicharan7777/level-up-dev"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                  >
                    <i className="fab fa-github"></i> GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="contact" id="contact">
          <h2 className="heading reveal">Let&apos;s Build Something Together</h2>
          <form action="#" className="reveal">
            <div className="input-group">
              <label htmlFor="full-name">Full Name</label>
              <input
                type="text"
                id="full-name"
                name="name"
                placeholder="Your Name"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                rows="7"
                placeholder="Hi Saicharan, I'd like to connect about..."
                required
              ></textarea>
            </div>
            <button type="submit" className="resume-btn" style={{ width: '100%', marginTop: '2rem', justifyContent: 'center' }}>
              <span>Send Message</span>
              <span>
                <svg width="66px" height="43px" viewBox="0 0 66 43" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <g id="arrow" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <path className="one" d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z" fill="#FFFFFF"></path>
                    <path className="two" d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z" fill="#FFFFFF"></path>
                    <path className="three" d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z" fill="#FFFFFF"></path>
                  </g>
                </svg>
              </span>
            </button>
          </form>
        </section>
      </main>
      <footer className="footer" style={{ flexDirection: 'column' }}>
        <div className="footer-text" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ fontSize: '1.8rem', margin: 0 }}>
            <i className="fas fa-envelope" style={{ marginRight: '1rem', color: 'var(--text-primary)', fontSize: '2.5rem' }}></i>
            <a href="mailto:saicharanmaddimsetti188@gmail.com" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '1.6rem', fontWeight: '700' }}>
              saicharanmaddimsetti188@gmail.com
            </a>
          </p>
        </div>
        <div className="social-media" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <a
            href="https://x.com/Saicharan3355"
            target="_blank"
            rel="noreferrer"
            aria-label="Twitter"
            style={{ margin: '0 1.5rem' }}
          >
            <i className="fa-brands fa-x-twitter"></i>
          </a>
          <a
            href="https://www.instagram.com/saicharan_maddimsetti08/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            style={{ margin: '0 1.5rem' }}
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://m.facebook.com/profile.php?id=61565422881985"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            style={{ margin: '0 1.5rem' }}
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://github.com/Saicharan7777"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            style={{ margin: '0 1.5rem' }}
          >
            <i className="fab fa-github"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/saicharan-maddimsetti-841b61290/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            style={{ margin: '0 1.5rem' }}
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
        <div className="footer-text" style={{ textAlign: 'center' }}>
          <p>© 2025 Saicharan Maddimsetti | All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
