// const escape = (str = "") => str.toString().replace(/([#%&{}_$^~\\])/g, "\\$1");

// export function generateLatexFromState(state) {
//   const {
//     name = "",
//     email = "",
//     phone = "",
//     github = "",
//     linkedin = "",
//     education = [],
//     experience = [],
//     skills = [],
//     projects = [],
//     achievements = [],
//   } = state;

//   const renderEducation = education
//     .filter((edu) => edu.title || edu.subtitle || edu.date)
//     .map(
//       (edu) => `
// \\resumeSubheading
//   {${escape(edu.title || "")}}
//   {${escape(edu.date || "")}}
//   {${escape(edu.subtitle || "")}}
//   {}
// ${
//   Array.isArray(edu.points) && edu.points.filter(Boolean).length
//     ? `\\resumeItemListStart
// ${edu.points
//   .filter(Boolean)
//   .map((pt) => `  \\resumeItem{${escape(pt)}}`)
//   .join("\n")}
// \\resumeItemListEnd`
//     : ""
// }
// `
//     )
//     .join("\n");

//   const renderExperience = experience
//     .filter((exp) => exp.title || exp.subtitle || exp.date)
//     .map(
//       (exp) => `
// \\resumeSubheading
//   {${escape(exp.title || "")}}
//   {${escape(exp.date || "")}}
//   {${escape(exp.subtitle || "")}}
//   {}
// ${
//   Array.isArray(exp.points) && exp.points.filter(Boolean).length
//     ? `\\resumeItemListStart
// ${exp.points
//   .filter(Boolean)
//   .map((pt) => `  \\resumeItem{${escape(pt)}}`)
//   .join("\n")}
// \\resumeItemListEnd`
//     : ""
// }
// `
//     )
//     .join("\n");

//   const renderProjects = projects
//     .filter((proj) => proj.title || proj.techstack || proj.date)
//     .map(
//       (proj) => `
// \\resumeSubheading
//   {${escape(proj.title || "")}}
//   {${escape(proj.date || "")}}
//   {${escape(proj.techstack || "")}}
//   {}
// ${
//   Array.isArray(proj.points) && proj.points.filter(Boolean).length
//     ? `\\resumeItemListStart
// ${proj.points
//   .filter(Boolean)
//   .map((pt) => `  \\resumeItem{${escape(pt)}}`)
//   .join("\n")}
// \\resumeItemListEnd`
//     : ""
// }
// `
//     )
//     .join("\n");

//   const renderAchievements = achievements
//     .filter(Boolean)
//     .map((ach) => `\\resumeItem{${escape(ach)}}`)
//     .join("\n");

//   const renderSkills = skills
//     .filter((s) => s.type || s.tools)
//     .map(
//       (s) =>
//         `\\textbf{${escape(s.type || "")}}{: ${escape(s.tools || "")}} \\\\`
//     )
//     .join("\n");

//   return `
// \\documentclass[letterpaper,11pt]{article}
// \\usepackage{latexsym}
// \\usepackage[empty]{fullpage}
// \\usepackage{titlesec}
// \\usepackage{marvosym}
// \\usepackage[usenames,dvipsnames]{color}
// \\usepackage{verbatim}
// \\usepackage{enumitem}
// \\usepackage[hidelinks]{hyperref}
// \\usepackage{fancyhdr}
// \\usepackage[english]{babel}
// \\usepackage{tabularx}
// \\input{glyphtounicode}
// \\pagestyle{fancy}
// \\fancyhf{}
// \\fancyfoot{}
// \\renewcommand{\\headrulewidth}{0pt}
// \\renewcommand{\\footrulewidth}{0pt}
// \\addtolength{\\oddsidemargin}{-0.5in}
// \\addtolength{\\evensidemargin}{-0.5in}
// \\addtolength{\\textwidth}{1in}
// \\addtolength{\\topmargin}{-.5in}
// \\addtolength{\\textheight}{1.0in}
// \\urlstyle{same}
// \\raggedbottom
// \\raggedright
// \\setlength{\\tabcolsep}{0in}
// \\titleformat{\\section}{
//   \\vspace{-4pt}\\scshape\\raggedright\\large
// }{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]
// \\pdfgentounicode=1

// % Custom commands
// \\newcommand{\\resumeItem}[1]{\\item\\small{{#1 \\vspace{-2pt}}}}
// \\newcommand{\\resumeSubheading}[4]{
//   \\vspace{-2pt}\\item
//   \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
//     \\textbf{#1} & #2 \\\\
//     \\textit{\\small#3} & \\textit{\\small #4} \\\\
//   \\end{tabular*}\\vspace{-7pt}
// }
// \\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}
// \\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
// \\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
// \\newcommand{\\resumeItemListStart}{\\begin{itemize}}
// \\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

// \\begin{document}

// % Header
// \\begin{center}
//   \\textbf{\\Huge \\scshape ${escape(name)}} \\\\
//   \\vspace{1pt}
//   \\small ${escape(phone)} $|$
//   \\href{mailto:${escape(email)}}{${escape(email)}} $|$
//   \\href{${escape(linkedin)}}{LinkedIn} $|$
//   \\href{${escape(github)}}{GitHub}
// \\end{center}

// % Education
// ${
//   renderEducation
//     ? `\\section{Education}
// \\resumeSubHeadingListStart
// ${renderEducation}
// \\resumeSubHeadingListEnd`
//     : ""
// }

// % Experience
// ${
//   renderExperience
//     ? `\\section{Experience}
// \\resumeSubHeadingListStart
// ${renderExperience}
// \\resumeSubHeadingListEnd`
//     : ""
// }

// % Projects
// ${
//   renderProjects
//     ? `\\section{Projects}
// \\resumeSubHeadingListStart
// ${renderProjects}
// \\resumeSubHeadingListEnd`
//     : ""
// }

// % Achievements
// ${
//   renderAchievements
//     ? `\\section{Achievements}
// \\resumeItemListStart
// ${renderAchievements}
// \\resumeItemListEnd`
//     : ""
// }

// % Skills
// ${
//   renderSkills
//     ? `\\section{Technical Skills}
// \\begin{itemize}[leftmargin=0.15in, label={}]
//   \\small{\\item{
//     ${renderSkills}
//   }}
// \\end{itemize}`
//     : ""
// }

// \\end{document}
// `;
// }

const escape = (str = "") => str.toString().replace(/([#%&{}_$^~\\])/g, "\\$1");

export function generateLatexFromState(state) {
  const {
    name = "",
    email = "",
    phone = "",
    github = "",
    linkedin = "",
    education = [],
    experience = [],
    skills = [],
    projects = [],
    achievements = [],
  } = state;

  // Helper to extract username or fallback
  const getLabel = (url, fallback) => {
    if (!url) return "";
    try {
      const u = new URL(url);
      // Remove all slashes, get last non-empty part
      const parts = u.pathname.split("/").filter(Boolean);
      return parts.length ? parts[parts.length - 1] : fallback;
    } catch {
      // Not a valid URL, just return as-is
      return url;
    }
  };
  const linkedinLabel = getLabel(linkedin, "LinkedIn");
  const githubLabel = getLabel(github, "GitHub");

  const renderEducation = education
    .filter((edu) => edu.title || edu.subtitle || edu.date)
    .map(
      (edu) => `
\\resumeSubheading
  {${escape(edu.title || "")}}
  {${escape(edu.date || "")}}
  {${escape(edu.subtitle || "")}}
  {}
${
  Array.isArray(edu.points) && edu.points.filter(Boolean).length
    ? `\\resumeItemListStart
${edu.points
  .filter(Boolean)
  .map((pt) => `  \\resumeItem{${escape(pt)}}`)
  .join("\n")}
\\resumeItemListEnd`
    : ""
}
`
    )
    .join("\n");

  const renderExperience = experience
    .filter((exp) => exp.title || exp.subtitle || exp.date)
    .map(
      (exp) => `
\\resumeSubheading
  {${escape(exp.title || "")}}
  {${escape(exp.date || "")}}
  {${escape(exp.subtitle || "")}}
  {}
${
  Array.isArray(exp.points) && exp.points.filter(Boolean).length
    ? `\\resumeItemListStart
${exp.points
  .filter(Boolean)
  .map((pt) => `  \\resumeItem{${escape(pt)}}`)
  .join("\n")}
\\resumeItemListEnd`
    : ""
}
`
    )
    .join("\n");

  const renderProjects = projects
    .filter((proj) => proj.title || proj.subtitle || proj.date)
    .map(
      (proj) => `
\\resumeSubheadingProject
  {${escape(proj.title || "")}}
  {${escape(proj.subtitle || "")}}
  {${escape(proj.date || "")}}
${
  Array.isArray(proj.points) && proj.points.filter(Boolean).length
    ? `\\resumeItemListStart
${proj.points
  .filter(Boolean)
  .map((pt) => `  \\resumeItem{${escape(pt)}}`)
  .join("\n")}
\\resumeItemListEnd`
    : ""
}
`
    )
    .join("\n");

  const renderAchievements = achievements
    .filter(Boolean)
    .map((ach) => `\\resumeItem{${escape(ach)}}`)
    .join("\n");

  const renderSkills = skills
    .filter((s) => s.type || s.tools)
    .map(
      (s) =>
        `\\textbf{${escape(s.type || "")}}{: ${escape(s.tools || "")}} \\\\`
    )
    .join("\n");

  return `
\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}
\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}
\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]
\\pdfgentounicode=1

% Custom commands
\\newcommand{\\resumeItem}[1]{\\item\\small{{#1 \\vspace{-2pt}}}}
\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
  \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
    \\textbf{#1} & #2 \\\\
    \\textit{\\small#3} & \\textit{\\small #4} \\\\
  \\end{tabular*}\\vspace{-7pt}
}
\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}
\\newcommand{\\resumeSubheadingProject}[3]{
  \\item
  \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
    \\textbf{#1} $|$ \\textit{#2} & #3 \\
  \\end{tabular*}\\vspace{-2pt}
}

\\begin{document}

% Header
\\begin{center}
  \\textbf{\\Huge \\scshape ${escape(name)}} \\\\
  \\vspace{1pt}
  \\small ${escape(phone)} $|$
  \\href{mailto:${escape(email)}}{${escape(email)}} $|$
  ${linkedin ? `\\href{${escape(linkedin)}}{${escape(linkedinLabel)}} $|$` : ""}
  ${github ? `\\href{${escape(github)}}{${escape(githubLabel)}}` : ""}
\\end{center}

% Education
${
  renderEducation
    ? `\\section{Education}
\\resumeSubHeadingListStart
${renderEducation}
\\resumeSubHeadingListEnd`
    : ""
}

% Experience
${
  renderExperience
    ? `\\section{Experience}
\\resumeSubHeadingListStart
${renderExperience}
\\resumeSubHeadingListEnd`
    : ""
}

% Projects
${
  renderProjects
    ? `\\section{Projects}
\\resumeSubHeadingListStart
${renderProjects}
\\resumeSubHeadingListEnd`
    : ""
}

% Achievements
${
  renderAchievements
    ? `\\section{Achievements}
\\resumeItemListStart
${renderAchievements}
\\resumeItemListEnd`
    : ""
}

% Skills
${
  renderSkills
    ? `\\section{Technical Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\small{\\item{
    ${renderSkills}
  }}
\\end{itemize}`
    : ""
}

\\end{document}
`;
}
