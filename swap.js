import fs from 'fs';

let code = fs.readFileSync('c:\\\\e-disk files\\\\FSD\\\\folio\\\\src\\\\App.jsx', 'utf8');

const resumeRegex = /<a\s+href="https:\/\/drive\.google\.com\/file\/d\/1C8374zyXFYbljYM4Tzjxxm_VI1Zc7EpL\/view\?usp=drive_link"\s+target="_blank"\s+rel="noreferrer"\s+className="resume-btn"\s*>[\s\S]*?<\/a>/;

const newCubeBtn = `<a
              href="https://drive.google.com/file/d/1C8374zyXFYbljYM4Tzjxxm_VI1Zc7EpL/view?usp=drive_link"
              target="_blank"
              rel="noreferrer"
              className="cube-btn cube cube-hover"
              style={{ width: 'fit-content', padding: '1rem 3rem', textDecoration: 'none', display: 'inline-block' }}
            >
              <div className="bg-top"><div className="bg-inner"></div></div>
              <div className="bg-right"><div className="bg-inner"></div></div>
              <div className="bg"><div className="bg-inner"></div></div>
              <div className="text" style={{ padding: '0 1rem' }}>Resume</div>
            </a>`;

code = code.replace(resumeRegex, newCubeBtn);

fs.writeFileSync('c:\\\\e-disk files\\\\FSD\\\\folio\\\\src\\\\App.jsx', code);
console.log("Successfully swapped the button");
