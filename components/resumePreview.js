export function escapeLatex(str) {
  return str
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/~/g, "\\textasciitilde{}");
}

export function generateLatexFromState(state) {
  const {
    name,
    email,
    phone,
    github,
    linkedin,
    education,
    experience,
    skills,
  } = state;

  const header = `
\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(name)}} \\\\ \\vspace{1pt}
    \\small ${escapeLatex(phone)} \\$|\\$
    \\href{mailto:${escapeLatex(email)}}{\\underline{${escapeLatex(
    email
  )}}} \\$|\\$
    \\href{${escapeLatex(linkedin)}}{\\underline{${escapeLatex(
    linkedin
  )}}} \\$|\\$
    \\href{${escapeLatex(github)}}{\\underline{${escapeLatex(github)}}}
\\end{center}
  `;

  const educationSection = `
\\section{Education}
\\resumeSubHeadingListStart
${education
  .map(
    (edu) => `\\resumeSubheading
  {${escapeLatex(edu.title)}}{${escapeLatex(edu.date)}}
  {${escapeLatex(edu.subtitle)}}{}
  ${edu.points.map((pt) => `\\resumeItem{${escapeLatex(pt)}}`).join("\n")}
  \\resumeItemListEnd`
  )
  .join("\n")}
\\resumeSubHeadingListEnd
  `;

  const experienceSection = `
\\section{Experience}
\\resumeSubHeadingListStart
${experience
  .map(
    (exp) => `\\resumeSubheading
  {${escapeLatex(exp.title)}}{${escapeLatex(exp.date)}}
  {${escapeLatex(exp.subtitle)}}{}
  \\resumeItemListStart
  ${exp.points.map((pt) => `\\resumeItem{${escapeLatex(pt)}}`).join("\n")}
  \\resumeItemListEnd`
  )
  .join("\n")}
\\resumeSubHeadingListEnd
  `;

  const skillsSection = `
\\section{Technical Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
\\small{\\item{
${skills
  .map(
    (skill) =>
      `\\textbf{${escapeLatex(skill.type)}}{: ${escapeLatex(skill.tools)}} \\\\`
  )
  .join("\n")}
}}
\\end{itemize}
  `;

  return `
\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage{enumitem}
\\usepackage[pdftex, colorlinks=true, urlcolor=blue]{hyperref}
\\usepackage{fancyhdr}
\\usepackage{multicol}
\\usepackage{xcolor}

% Custom resume commands
\\input{resume-preamble.tex} % Make sure this preamble exists in the template or inline it

\\begin{document}
${header}
${educationSection}
${experienceSection}
${skillsSection}
\\end{document}
  `;
}