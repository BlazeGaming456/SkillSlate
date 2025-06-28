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
//   } = state;

//   const renderEducation = education
//     .filter((edu) => edu?.title || edu?.subtitle)
//     .map(
//       (edu) => `
// \\resumeSubheading
//   {${escape(edu.title || "")}}
//   {${escape(edu.date || "")}}
//   {${escape(edu.subtitle || "")}}
//   {}
//   ${
//     edu.points?.length
//       ? `
//   \\resumeItemListStart
//     ${edu.points
//       .filter(Boolean)
//       .map((pt) => `\\resumeItem{${escape(pt)}}`)
//       .join("\n    ")}
//   \\resumeItemListEnd`
//       : ""
//   }`
//     )
//     .join("\n");

//   const renderExperience = experience
//     .filter((exp) => exp?.title || exp?.subtitle)
//     .map(
//       (exp) => `
// \\resumeSubheading
//   {${escape(exp.title || "")}}
//   {${escape(exp.date || "")}}
//   {${escape(exp.subtitle || "")}}
//   {}
//   ${
//     exp.points?.length
//       ? `
//   \\resumeItemListStart
//     ${exp.points
//       .filter(Boolean)
//       .map((pt) => `\\resumeItem{${escape(pt)}}`)
//       .join("\n    ")}
//   \\resumeItemListEnd`
//       : ""
//   }`
//     )
//     .join("\n");

//   const renderSkills = skills
//     .filter((skill) => skill.type || skill.tools)
//     .map(
//       (skill) =>
//         `\\textbf{${escape(skill.type || "")}}: ${escape(
//           skill.tools || ""
//         )}\\\\`
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
// \\pdfgentounicode=1

// %-------------------------
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

// \\begin{center}
//   \\textbf{\\Huge \\scshape ${escape(name)}} \\\\
//   \\vspace{1pt}
//   \\small ${escape(phone)} $|$
//   \\href{mailto:${escape(email)}}{${escape(email)}} $|$
//   \\href{${escape(linkedin)}}{LinkedIn} $|$
//   \\href{${escape(github)}}{GitHub}
// \\end{center}

// \\section{Education}
// \\resumeSubHeadingListStart
// ${renderEducation}
// \\resumeSubHeadingListEnd

// \\section{Experience}
// \\resumeSubHeadingListStart
// ${renderExperience}
// \\resumeSubHeadingListEnd

// \\section{Technical Skills}
// \\begin{itemize}[leftmargin=0.15in, label={}]
//   \\small{\\item{
//     ${renderSkills}
//   }}
// \\end{itemize}

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
  } = state;

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
  edu.points?.filter(Boolean).length
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
  exp.points?.filter(Boolean).length
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

\\begin{document}

% Header
\\begin{center}
  \\textbf{\\Huge \\scshape ${escape(name)}} \\\\
  \\vspace{1pt}
  \\small ${escape(phone)} $|$ 
  \\href{mailto:${escape(email)}}{${escape(email)}} $|$
  \\href{${escape(linkedin)}}{LinkedIn} $|$ 
  \\href{${escape(github)}}{GitHub}
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