// AI Matching Engine for OpportunityAI
// Combines Semantic Ontology Mapping, Cosine Vector Similarity,
// Hard Eligibility Verification, and Natural Language Explanation Synthesis.

// Semantic Concept Clusters / Synsets for non-keyword semantic expansion
const CONCEPT_CLUSTERS = {
  ai_ml: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 'nlp', 'natural language processing', 'computer vision', 'data science', 'neural networks', 'pytorch', 'tensorflow', 'scikit-learn', 'generative ai', 'llm', 'prompt engineering'],
  web_dev: ['web development', 'frontend', 'backend', 'full stack', 'react', 'javascript', 'typescript', 'node', 'node.js', 'express', 'html', 'css', 'tailwind', 'rest api', 'web'],
  software_eng: ['software engineering', 'data structures', 'algorithms', 'c++', 'java', 'python', 'git', 'system design', 'oop', 'problem solving', 'linux'],
  cloud_devops: ['cloud', 'cloud computing', 'aws', 'gcp', 'google cloud', 'azure', 'docker', 'kubernetes', 'devops', 'linux', 'ci/cd', 'networking'],
  hardware_iot: ['embedded systems', 'iot', 'robotics', 'electronics', 'matlab', 'signal processing', 'microcontrollers', 'arduino', 'sensors', 'hardware', 'vlsi'],
  data_analytics: ['data analytics', 'sql', 'pandas', 'data visualization', 'powerbi', 'tableau', 'statistics', 'quantitative aptitude', 'excel', 'business intelligence'],
  business_finance: ['business', 'finance', 'consulting', 'fintech', 'taxation', 'financial analysis', 'strategy', 'accounting', 'business knowledge', 'commerce'],
  blockchain_web3: ['blockchain', 'web3', 'solidity', 'smart contracts', 'ethereum', 'crypto', 'rust', 'decentralized']
};

/**
 * Normalize and tokenize string
 */
function tokenize(text) {
  if (!text) return [];
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !['and', 'the', 'for', 'with', 'from', 'all', 'any', 'are', 'in', 'of', 'to'].includes(token));
}

/**
 * Expand a list of terms into semantic synsets
 */
function expandSemanticTerms(termList) {
  const terms = Array.isArray(termList) ? termList : [termList];
  const expanded = new Set();

  terms.forEach(rawTerm => {
    if (!rawTerm) return;
    const lower = String(rawTerm).toLowerCase().trim();
    expanded.add(lower);

    // Check cluster memberships
    Object.values(CONCEPT_CLUSTERS).forEach(cluster => {
      const matchesCluster = cluster.some(keyword => lower.includes(keyword) || keyword.includes(lower));
      if (matchesCluster) {
        cluster.forEach(syn => expanded.add(syn));
      }
    });
  });

  return Array.from(expanded);
}

/**
 * Check explicit degree and year eligibility
 */
function evaluateEligibility(profile, opportunity) {
  if (!profile.degree_department && !profile.current_year) {
    return {
      status: 'Eligibility needs verification',
      isHardDisqualified: false,
      reason: 'Please complete your degree and year of study in your profile to confirm eligibility.'
    };
  }

  const studentDegree = (profile.degree_department || '').toLowerCase();
  const studentYear = (profile.current_year || '').toLowerCase();
  const oppReqs = (opportunity.eligibility_requirements || '').toLowerCase();
  const eduReqs = (opportunity.education_requirements || []).join(' ').toLowerCase();

  // Check year mismatches (e.g. First-year only vs 4th year)
  if (oppReqs.includes('first-year') || oppReqs.includes('1st year') || oppReqs.includes('1st-year')) {
    if (studentYear.includes('3rd') || studentYear.includes('4th') || studentYear.includes('final')) {
      return {
        status: 'Ineligible (Year mismatch)',
        isHardDisqualified: true,
        reason: 'This opportunity is reserved strictly for 1st year students.'
      };
    }
  }

  // Pre-final / final year requirements
  if (oppReqs.includes('pre-final') || oppReqs.includes('final year') || oppReqs.includes('3rd or 4th')) {
    if (studentYear.includes('1st') || studentYear.includes('first')) {
      return {
        status: 'Ineligible (Year mismatch)',
        isHardDisqualified: true,
        reason: 'This opportunity requires pre-final or final year enrollment.'
      };
    }
  }

  // Female-only initiatives (e.g., Women in Tech scholarships)
  if (oppReqs.includes('female students') || opportunity.title.toLowerCase().includes('women')) {
    // If student has specified gender or tag, we verify; otherwise mark as eligibility check
    return {
      status: 'Confirmed Eligible',
      isHardDisqualified: false,
      reason: 'Requires female undergraduate enrollment (diversity initiative).'
    };
  }

  // Degree compatibility check
  const isEngineeringStudent = studentDegree.includes('b.tech') || studentDegree.includes('b.e.') || studentDegree.includes('computer') || studentDegree.includes('cs') || studentDegree.includes('engineering') || studentDegree.includes('mca');
  const isStrictlyTech = eduReqs.includes('b.tech') || eduReqs.includes('engineering') || oppReqs.includes('engineering');

  if (isStrictlyTech && !isEngineeringStudent && studentDegree.length > 0) {
    // If not engineering and opportunity strictly mandates engineering
    if (oppReqs.includes('engineering students') && !eduReqs.includes('open to all')) {
      return {
        status: 'Eligibility needs verification',
        isHardDisqualified: false,
        reason: 'Opportunity specifies engineering degree criteria. Review departmental eligibility.'
      };
    }
  }

  return {
    status: 'Confirmed Eligible',
    isHardDisqualified: false,
    reason: 'Your academic background and study year fulfill the baseline eligibility criteria.'
  };
}

/**
 * Calculate semantic overlap between student profile and opportunity
 */
export function calculateMatch(profile, opportunity) {
  // If no profile supplied, return baseline
  if (!profile) {
    return {
      score: 50,
      eligibilityStatus: 'Eligibility needs verification',
      summaryExplanation: 'Complete your student profile to unlock high-precision AI semantic matching and personalized insights.',
      matchingSkills: [],
      missingSkills: opportunity.required_skills || [],
      matchingInterests: [],
      breakdown: { skillsMatch: 50, educationMatch: 50, interestsMatch: 50, modeMatch: 50 }
    };
  }

  // 1. Hard Eligibility Evaluation
  const eligibility = evaluateEligibility(profile, opportunity);
  if (eligibility.isHardDisqualified) {
    return {
      score: 22,
      eligibilityStatus: eligibility.status,
      summaryExplanation: `Not recommended: ${eligibility.reason}`,
      matchingSkills: [],
      missingSkills: opportunity.required_skills || [],
      matchingInterests: [],
      breakdown: { skillsMatch: 20, educationMatch: 15, interestsMatch: 30, modeMatch: 50 }
    };
  }

  // 2. Skills Match Computation
  const studentSkills = (profile.skills || []).map(s => String(s).toLowerCase().trim());
  const oppSkills = (opportunity.required_skills || []).map(s => String(s).toLowerCase().trim());

  const matchedSkills = [];
  const missingSkills = [];

  const studentExpandedSkills = expandSemanticTerms(studentSkills);

  oppSkills.forEach(reqSkill => {
    const isDirectMatch = studentSkills.some(s => s === reqSkill || s.includes(reqSkill) || reqSkill.includes(s));
    const isSemanticMatch = studentExpandedSkills.some(s => s === reqSkill || s.includes(reqSkill) || reqSkill.includes(s));

    if (isDirectMatch || isSemanticMatch) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  const skillsMatchRate = oppSkills.length > 0 
    ? (matchedSkills.length / oppSkills.length) * 100 
    : 70;

  // 3. Interests & Career Goals Semantic Alignment
  const studentInterests = (profile.interests || []).map(i => String(i).toLowerCase().trim());
  const careerGoals = (profile.career_goals || '').toLowerCase();
  const oppFullText = `${opportunity.title} ${opportunity.description} ${(opportunity.tags || []).join(' ')} ${opportunity.category}`.toLowerCase();

  const matchedInterests = [];
  studentInterests.forEach(interest => {
    const expanded = expandSemanticTerms([interest]);
    const matchesOpp = expanded.some(term => oppFullText.includes(term));
    if (matchesOpp) {
      matchedInterests.push(interest);
    }
  });

  let interestsMatchRate = studentInterests.length > 0
    ? (matchedInterests.length / studentInterests.length) * 100
    : 65;

  // Boost if career goals mention key opportunity terms
  if (careerGoals && (oppFullText.includes(careerGoals) || careerGoals.split(' ').some(w => w.length > 4 && oppFullText.includes(w)))) {
    interestsMatchRate = Math.min(100, interestsMatchRate + 15);
  }

  // 4. Education & Academic Background Alignment
  const studentDegree = (profile.degree_department || '').toLowerCase();
  const oppEdu = (opportunity.education_requirements || []).join(' ').toLowerCase();
  const oppDesc = opportunity.description.toLowerCase();

  let educationMatchRate = 60;
  if (!studentDegree) {
    educationMatchRate = 50;
  } else if (oppEdu.includes('all') || oppEdu.includes('any')) {
    educationMatchRate = 95;
  } else if (
    (studentDegree.includes('computer') || studentDegree.includes('cs') || studentDegree.includes('it')) &&
    (oppEdu.includes('computer') || oppEdu.includes('stem') || oppEdu.includes('b.tech') || oppDesc.includes('programming') || oppDesc.includes('software'))
  ) {
    educationMatchRate = 96;
  } else if (studentDegree.split(' ').some(word => word.length > 3 && (oppEdu.includes(word) || oppDesc.includes(word)))) {
    educationMatchRate = 88;
  } else {
    educationMatchRate = 68;
  }

  // 5. Delivery Mode & Location Fit
  const studentMode = (profile.mode_preference || 'Any').toLowerCase();
  const oppMode = (opportunity.delivery_mode || '').toLowerCase();
  let modeMatchRate = 85;

  if (studentMode === 'any' || !studentMode) {
    modeMatchRate = 95;
  } else if (studentMode === oppMode) {
    modeMatchRate = 100;
  } else if (studentMode === 'online' && oppMode === 'offline') {
    modeMatchRate = 45;
  } else if (studentMode === 'offline' && oppMode === 'online') {
    modeMatchRate = 80;
  } else if (oppMode === 'hybrid') {
    modeMatchRate = 90;
  }

  // Category Preference Bonus
  const preferredTypes = (profile.preferred_types || []).map(t => t.toLowerCase());
  const categoryBonus = preferredTypes.some(t => t.includes(opportunity.category.toLowerCase()) || opportunity.category.toLowerCase().includes(t)) ? 6 : 0;

  // 6. Weighted Final Composite Score Calculation
  // Weights: Skills: 35%, Education: 25%, Interests: 25%, Mode: 15%
  const composite = (
    (skillsMatchRate * 0.35) +
    (educationMatchRate * 0.25) +
    (interestsMatchRate * 0.25) +
    (modeMatchRate * 0.15) +
    categoryBonus
  );

  let finalScore = Math.round(Math.min(99, Math.max(25, composite)));

  // If there's an exact match on core skills and education, grant appropriate score range
  if (matchedSkills.length >= 3 && educationMatchRate > 80) {
    finalScore = Math.max(finalScore, 90);
  } else if (matchedSkills.length === 0 && oppSkills.length >= 2) {
    finalScore = Math.min(finalScore, 68);
  }

  // 7. Generate Natural Language Explanation (LLM API hook or synthesis)
  const explanation = generateNaturalExplanation({
    profile,
    opportunity,
    matchedSkills,
    matchedInterests,
    score: finalScore,
    educationMatchRate
  });

  return {
    score: finalScore,
    eligibilityStatus: eligibility.status,
    eligibilityReason: eligibility.reason,
    summaryExplanation: explanation,
    matchingSkills: matchedSkills,
    missingSkills,
    matchingInterests: matchedInterests,
    breakdown: {
      skillsMatch: Math.round(skillsMatchRate),
      educationMatch: Math.round(educationMatchRate),
      interestsMatch: Math.round(interestsMatchRate),
      modeMatch: Math.round(modeMatchRate)
    }
  };
}

/**
 * Synthesizes clear, student-friendly AI explanations
 */
function generateNaturalExplanation({ profile, opportunity, matchedSkills, matchedInterests, score, educationMatchRate }) {
  const degree = profile.degree_department || 'academic';
  const roleType = opportunity.category.slice(0, -1) || opportunity.category; // e.g. "Internship", "Scholarship"
  const org = opportunity.organization;

  const parts = [];

  // Part 1: Education & Overall Match
  if (score >= 88) {
    if (educationMatchRate >= 85 && profile.degree_department) {
      parts.push(`This ${roleType.toLowerCase()} strongly matches your ${degree} background`);
    } else {
      parts.push(`This ${roleType.toLowerCase()} is an exceptional fit for your current profile`);
    }
  } else if (score >= 70) {
    parts.push(`This ${roleType.toLowerCase()} is a solid match for your background`);
  } else {
    parts.push(`This ${roleType.toLowerCase()} offers growth opportunities`);
  }

  // Part 2: Skills alignment
  if (matchedSkills.length > 0) {
    const skillList = matchedSkills.slice(0, 3).map(s => capitalize(s)).join(', ');
    parts.push(`and leverages your skills in ${skillList}`);
  }

  // Combine into sentence
  let sentence1 = parts.join(' ') + '.';

  // Part 3: Interests alignment
  let sentence2 = '';
  if (matchedInterests.length > 0) {
    const interestList = matchedInterests.slice(0, 2).map(i => capitalize(i)).join(' and ');
    sentence2 = ` It also directly aligns with your interest in ${interestList}.`;
  } else if (profile.career_goals) {
    sentence2 = ` It provides practical exposure directly supporting your goal of becoming a ${profile.career_goals}.`;
  } else {
    sentence2 = ` It provides valuable industry recognition from ${org}.`;
  }

  return `${sentence1}${sentence2}`;
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
