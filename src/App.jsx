import React, { useEffect, useRef, useState, useMemo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim'; 
import Typed from 'typed.js';
import './App.css';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [menuActive, setMenuActive] = useState(false);
  const [particlesReady, setParticlesReady] = useState(false);
  const typedRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    if (!typedRef.current) return;

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
  }, []);

  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal:not(.project-card)');
    if (!revealElements.length) return;

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
  }, []);

  useEffect(() => {
    const projectCards = document.querySelectorAll('.project-card');
    if (!projectCards.length) return;

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
  }, []);

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
    initParticlesEngine(async engine => {
      await loadSlim(engine); 
    }).then(() => {
      setParticlesReady(true);
    });
  }, []);

  const particlesLoaded = container => {
    particlesRef.current = container;
  };

  const particlesOptions = useMemo(
    () => ({
      particles: {
        number: {
          value: 60,
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
          distance: 150,
          color: theme === 'light' ? '#5a6861' : '#a4b2ac',
          opacity: 0.4,
          width: 1,
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
      {particlesReady && (
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
            <h3>Full-Stack Developer</h3>
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
                href="https://github.com/Saicharan7777"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <i className="fab fa-github"></i>
              </a>
              <a
                href="https://x.com/Saicharan3355"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://www.instagram.com/saicharan_maddimsetti08/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://m.facebook.com/profile.php?id=61565422881985"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
            </div>
            <a
              href="https://drive.google.com/file/d/1oIjfB8pq1Uu393J-QM97MF4eXblmCbT2/view?usp=drive_link"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
            >
              <i className="fas fa-download"></i> Resume
            </a>
          </div>
          <div className="home-img reveal">
            <img
              src="https://uploads.onecompiler.io/42b5cwusm/44b9ypd9g/23P31A4245_Drive_Ready%20(1).png"
              alt="Saicharan Maddimsetti"
            />
          </div>
        </section>

        <section className="about" id="about">
          <div className="about-text reveal">
            <h2 className="heading">
              About <span>Me</span>
            </h2>
            <h3>Architecting the Web, One Line of Code at a Time</h3>
            <p>
              As a developer, I am driven by a deep passion for both the logical
              challenges of backend architecture and the creative process of
              crafting intuitive user interfaces.
            </p>
            <p>
              My philosophy is centered on writing clean, scalable, and
              maintainable code. I thrive in collaborative environments where I
              can contribute to meaningful projects and continuously learn from
              my peers.
            </p>
            <a href="#contact" className="btn">
              Let&apos;s Talk
            </a>
          </div>
        </section>

        <section className="coding-profiles" id="coding-profiles">
          <h2 className="heading reveal">Coding Profiles</h2>
          <div className="profiles-container">
            <a
              href="https://leetcode.com/u/Saicharan_Maddimsetti/"
              className="glass-card profile-card reveal"
              target="_blank"
              rel="noreferrer"
              title="LeetCode"
            >
              <img
                src="https://uploads.onecompiler.io/42b5cwusm/43wmyckzh/l.png"
                alt="LeetCode Logo"
              />
            </a>
            <a
              href="https://github.com/Saicharan7777"
              className="glass-card profile-card reveal"
              target="_blank"
              rel="noreferrer"
              title="GitHub"
            >
              <img
                src="https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/github.svg"
                alt="GitHub Logo"
                className="github-svg"
              />
            </a>
            <a
              href="https://www.hackerrank.com/profile/saicharanmaddim1"
              className="glass-card profile-card reveal"
              target="_blank"
              rel="noreferrer"
              title="HackerRank"
            >
              <img
                src="https://uploads.onecompiler.io/42b5cwusm/43wmyckzh/hc.png"
                alt="HackerRank Logo"
              />
            </a>
            <a
              href="https://www.codechef.com/users/charan_335566"
              className="glass-card profile-card reveal"
              target="_blank"
              rel="noreferrer"
              title="CodeChef"
            >
              <img
                src="https://uploads.onecompiler.io/42b5cwusm/43wmyckzh/c.png"
                alt="CodeChef Logo"
              />
            </a>
            <a
              href="https://codeforces.com/profile/saicharan188"
              className="glass-card profile-card reveal"
              target="_blank"
              rel="noreferrer"
              title="Codeforces"
            >
              <img
                src="https://uploads.onecompiler.io/42b5cwusm/43wmyckzh/cf.png"
                alt="Codeforces Logo"
              />
            </a>
            <a
              href="https://www.geeksforgeeks.org/user/saicharan_3355/"
              className="glass-card profile-card reveal"
              target="_blank"
              rel="noreferrer"
              title="GeeksforGeeks"
            >
              <img
                src="https://uploads.onecompiler.io/42b5cwusm/43wmyckzh/gfg.png"
                alt="GeeksforGeeks Logo"
              />
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
              <div className="glass-card skill-card reveal">
                <i className="devicon-github-original"></i>
                <p>GitHub</p>
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
                    href="https://3355.oneapp.dev/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                  >
                    <i className="fas fa-external-link-alt"></i> Demo
                  </a>
                  <a
                    href="https://github.com/Saicharan7777/Tic-Tac-Toe"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                  >
                    <i className="fab fa-github"></i> Code
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
                    href="https://335566.oneapp.dev/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                  >
                    <i className="fas fa-external-link-alt"></i> Demo
                  </a>
                  <a
                    href="https://github.com/Saicharan7777/Calculator-Main"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                  >
                    <i className="fab fa-github"></i> Code
                  </a>
                </div>
              </div>
            </div>

            <div
              className="glass-card project-card reveal"
            >
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
                    href="https://chvmkiran.github.io/LevelUpDev/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                  >
                    <i className="fas fa-external-link-alt"></i> Demo
                  </a>
                  <a
                    href="https://github.com/Saicharan7777/LeveLUpDev"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                  >
                    <i className="fab fa-github"></i> Code
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
            <input type="submit" value="Send Message" className="btn" />
          </form>
        </section>
      </main>
      <footer className="footer">
        <div className="footer-text">
          <p>© 2025 Saicharan Maddimsetti | All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
