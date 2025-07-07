//Latex generation for cover letter

const escape = (str = "") => str.toString().replace(/([#%&{}_$^~\\])/g, "\\$1");

export function generateLatexFromState(state) {
  const {
    name = "",
    email = "",
    phone = "",
    linkedin = "",
    city = "",
    content = "",
    address = [],
  } = state;

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const role = escape(address[0]?.role || "");
  const company = escape(address[0]?.company || "");
  const street = escape(address[0]?.address1 || "");
  const cityLine = escape(address[0]?.address2 || "");
  const greeting = `Dear ${role || "Hiring Manager"}`;

  return `
\\documentclass[12pt]{letter}
\\usepackage[utf8]{inputenc}
\\usepackage[empty]{fullpage}
\\usepackage[hidelinks]{hyperref}
\\usepackage{graphicx}
\\usepackage{eso-pic}
\\usepackage{charter}
\\usepackage{xcolor}

\\addtolength{\\topmargin}{-0.5in}
\\addtolength{\\textheight}{1.0in}
\\definecolor{gr}{RGB}{225,225,225}

\\begin{document}

% Header banner background
\\AddToShipoutPictureBG{%
  \\color{gr}
  \\AtPageUpperLeft{\\rule[-1.3in]{\\paperwidth}{1.3in}}
}

\\begin{center}
  {\\fontsize{28}{0}\\selectfont\\scshape ${escape(name)}}

  \\href{mailto:${escape(email)}}{${escape(email)}}\\hfill
  \\href{https://linkedin.com/in/${escape(linkedin)}}{linkedin.com/in/${escape(
    linkedin
  )}}\\hfill
  ${escape(phone)}\\hfill
  ${escape(city)}
\\end{center}

\\vspace{0.2in}

${today}\\\\

${role && role + "\\\\"}
${company && company + "\\\\"}
${street && street + "\\\\"}
${cityLine && cityLine + "\\\\"}

\\vspace{0.1in}
${greeting},\\\\

\\vspace{0.1in}
\\setlength\\parindent{24pt}
\\noindent
${escape(content).replace(/\\n/g, "\\\\\n")}

\\vspace{0.2in}
\\vfill

\\begin{flushright}
Sincerely,\\\\
${escape(name)}
\\end{flushright}

\\end{document}
`;
}
