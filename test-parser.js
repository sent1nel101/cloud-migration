#!/usr/bin/env node

/**
 * Test script for resume parser
 * Tests parser directly without API
 */

const fs = require('fs');
const path = require('path');

// Import parser functions (simulate what the API would do)
const resumeText = fs.readFileSync(path.join(__dirname, 'test-resume.txt'), 'utf-8');

console.log('=== RESUME PARSER TEST ===\n');
console.log('Input file: test-resume.txt');
console.log('File size:', resumeText.length, 'bytes\n');

// Simulate parser functions
function extractName(text) {
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    if (!firstLine.match(/email|phone|location|resume|curriculum|vitae|linkedin|github/i)) {
      return firstLine;
    }
  }
  return undefined;
}

function extractEmail(text) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(emailRegex);
  return matches ? matches[0] : undefined;
}

function extractPhone(text) {
  const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/;
  const matches = text.match(phoneRegex);
  return matches ? matches[0] : undefined;
}

function extractLocation(text) {
  const locationRegex = /\b([A-Z][a-z]+),\s*([A-Z]{2})\b/;
  const matches = text.match(locationRegex);
  return matches ? `${matches[1]}, ${matches[2]}` : undefined;
}

function extractCurrentRole(text) {
  const jobTitles = [
    "senior", "junior", "lead", "manager", "engineer", "developer",
    "designer", "analyst", "coordinator", "specialist", "director",
    "executive", "consultant", "architect", "administrator", "scientist", "officer",
  ];

  const lines = text.split("\n");
  for (let i = 0; i < Math.min(lines.length, 30); i++) {
    const line = lines[i].trim();
    if (jobTitles.some((title) => line.toLowerCase().includes(title)) && line.length < 100) {
      return line;
    }
  }
  return undefined;
}

function extractYearsExperience(text) {
  const yearsRegex = /(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp|professional|industry)?/i;
  const matches = text.match(yearsRegex);

  if (matches && matches[1]) {
    const years = parseInt(matches[1]);
    if (years >= 1 && years <= 70) {
      return years;
    }
  }

  // Alternative: Extract from job dates
  const jobDateRegex = /(\d{4})\s*[-–—]\s*(?:present|current|today|\d{4})/gi;
  const jobMatches = text.match(jobDateRegex);
  if (jobMatches && jobMatches.length > 0) {
    const currentYear = new Date().getFullYear();
    let totalYears = 0;
    
    for (const match of jobMatches) {
      const yearMatch = match.match(/(\d{4})/);
      if (yearMatch) {
        const startYear = parseInt(yearMatch[1]);
        const isPresent = /present|current|today/i.test(match);
        const endYear = isPresent ? currentYear : parseInt(match.split(/-–—/)[1].trim()) || currentYear;
        totalYears += (endYear - startYear);
      }
    }
    
    if (totalYears > 0) {
      return Math.max(totalYears, 1);
    }
  }

  return undefined;
}

function extractSkills(text) {
  const skillsRegex = /(?:skills?|competencies|technical\s*skills|technical\s*expertise|core\s*competencies)[\s:]*\n?([\s\S]*?)(?=\n(?:education|experience|certifications|projects|awards|references|professional|summary|\n\n|$))/i;

  const matches = text.match(skillsRegex);
  if (!matches) {
    const experienceText = text.toLowerCase();
    const commonSkills = [
      'python', 'javascript', 'java', 'c++', 'c#', 'typescript', 'react', 'node', 'angular', 'vue',
      'sql', 'mongodb', 'postgresql', 'mysql', 'aws', 'azure', 'gcp', 'docker', 'kubernetes',
      'git', 'linux', 'windows', 'html', 'css', 'bootstrap', 'tailwind',
      'machine learning', 'ai', 'data analysis', 'analytics', 'excel', 'tableau', 'power bi',
      'sales', 'marketing', 'project management', 'agile', 'scrum', 'leadership',
      'communication', 'problem solving', 'teamwork', 'collaboration'
    ];
    
    const foundSkills = commonSkills.filter(skill => experienceText.includes(skill.toLowerCase()));
    return foundSkills.length > 0 ? foundSkills : undefined;
  }

  const skillsText = matches[1];
  const skills = skillsText
    .split(/[,•·|]|\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.length < 60 && !s.match(/^\d+$/))
    .slice(0, 30);

  return skills.length > 0 ? skills : undefined;
}

function extractEducationLevel(text) {
  const educationMap = {
    "high school": "High School",
    "associate": "Associate's",
    "bachelor": "Bachelor's",
    "master": "Master's",
    "phd": "PhD",
    "doctorate": "PhD",
  };

  const educationSectionRegex = /(?:education|academic)[\s:]*\n?([\s\S]*?)(?=\n(?:experience|skills|certifications|projects|awards|references|\n\n|$))/i;
  const educationSectionMatches = text.match(educationSectionRegex);
  const searchText = educationSectionMatches ? educationSectionMatches[1] : text;

  for (const [key, level] of Object.entries(educationMap)) {
    if (searchText.toLowerCase().includes(key)) {
      return level;
    }
  }

  return undefined;
}

function extractGoals(text) {
  const summaryRegex = /(?:professional\s*summary|summary|objective|profile|about|goals?)[\s:]*\n?([\s\S]*?)(?=\n(?:experience|education|skills|work|projects|certifications))/i;

  const matches = text.match(summaryRegex);
  if (matches) {
    const summaryText = matches[1]
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, 2)
      .join(" ")
      .substring(0, 250);

    if (summaryText.length > 0) {
      return summaryText;
    }
  }

  return undefined;
}

// Run extraction
const results = {
  name: extractName(resumeText),
  email: extractEmail(resumeText),
  phone: extractPhone(resumeText),
  location: extractLocation(resumeText),
  currentRole: extractCurrentRole(resumeText),
  yearsExperience: extractYearsExperience(resumeText),
  skills: extractSkills(resumeText),
  educationLevel: extractEducationLevel(resumeText),
  goals: extractGoals(resumeText),
};

console.log('=== EXTRACTION RESULTS ===\n');
console.log('Name:', results.name || '❌ NOT FOUND');
console.log('Email:', results.email || '❌ NOT FOUND');
console.log('Phone:', results.phone || '❌ NOT FOUND');
console.log('Location:', results.location || '❌ NOT FOUND');
console.log('Current Role:', results.currentRole || '❌ NOT FOUND');
console.log('Years Experience:', results.yearsExperience !== undefined ? results.yearsExperience : '❌ NOT FOUND');
console.log('Education Level:', results.educationLevel || '❌ NOT FOUND');
console.log('Skills:', results.skills ? `${results.skills.length} found` : '❌ NOT FOUND');
if (results.skills) {
  console.log('  -', results.skills.slice(0, 5).join(', '));
}
console.log('Goals:', results.goals ? results.goals.substring(0, 80) + '...' : '❌ NOT FOUND');

console.log('\n=== SUMMARY ===');
const foundCount = Object.values(results).filter(v => v !== undefined && v !== null).length - 1; // -1 for skills array
console.log(`Successfully extracted ${foundCount}/8 main fields`);
console.log('Parser accuracy: ' + Math.round((foundCount / 8) * 100) + '%');
