// Cultural Respect & IP Protection Middleware System
// middleware/contentEthics.js

const { validateMaoriUsage, MAORI_GLOSSARY } = require('./maoriGlossary');

// Cultural Guidelines and Sensitivity Rules
const CULTURAL_GUIDELINES = {
  maori: {
    respectRequired: true,
    guidelines: [
      'Acknowledge traditional knowledge with respect',
      'Avoid commercializing sacred or ceremonial concepts',
      'Use correct iwi references for specific regions',
      'Include proper macrons in Te Reo Māori',
      'Respect cultural protocols and tikanga',
      'Acknowledge source and context of traditional knowledge'
    ],
    sacredTerms: [
      'whakapapa', 'mauri', 'tapu', 'mana', 'wairua', 'whenua'
    ],
    iwi: {
      'Christchurch': 'Ngāi Tahu',
      'Canterbury': 'Ngāi Tahu',
      'Auckland': 'Multiple iwi including Ngāti Whātua',
      'Wellington': 'Te Ātiawa, Ngāti Toa, Ngāti Raukawa',
      'Rotorua': 'Te Arawa',
      'Queenstown': 'Ngāi Tahu'
    }
  },
  pacific: {
    respectRequired: true,
    guidelines: [
      'Acknowledge Pacific cultural diversity',
      'Respect different island nations and cultures',
      'Avoid generalizing Pacific cultures as one',
      'Include appropriate cultural context'
    ]
  },
  general: {
    guidelines: [
      'Avoid cultural stereotypes and generalizations',
      'Research and verify cultural information',
      'Include diverse perspectives and voices',
      'Respect religious and spiritual beliefs',
      'Acknowledge cultural ownership and origins'
    ]
  }
};

// IP Protection and Copyright Guidelines
const IP_PROTECTION_RULES = {
  copyrightedContent: {
    prohibited: [
      'Song lyrics (full or substantial portions)',
      'Copyrighted poetry or literature',
      'Branded content without permission',
      'Trademarked phrases or slogans',
      'Proprietary business content',
      'Copyrighted images or descriptions'
    ],
    guidelines: [
      'Create original content inspired by, not copying from sources',
      'Use fair use principles for educational content',
      'Attribute sources appropriately',
      'Avoid reproducing substantial portions of copyrighted work',
      'Create transformative content rather than derivative copies'
    ]
  },
  trademarks: {
    requireAttribution: [
      'Business names and brands',
      'Product names and services',
      'Location-specific branded experiences',
      'Trademarked phrases or slogans'
    ]
  },
  businessContent: {
    guidelines: [
      'Respect competitor confidentiality',
      'Avoid sharing proprietary business strategies',
      'Create original marketing content',
      'Respect privacy and confidentiality agreements'
    ]
  }
};

// Content Ethics Validation Middleware
class ContentEthicsValidator {
  constructor() {
    this.culturalGuidelines = CULTURAL_GUIDELINES;
    this.ipRules = IP_PROTECTION_RULES;
  }

  // Main validation function
  async validateContent(contentRequest) {
    const validationResult = {
      approved: true,
      warnings: [],
      errors: [],
      suggestions: [],
      culturalEnhancements: []
    };

    // Run all validation checks
    await this.validateCulturalSensitivity(contentRequest, validationResult);
    await this.validateIPCompliance(contentRequest, validationResult);
    await this.validateMaoriUsage(contentRequest, validationResult);
    await this.addCulturalEnhancements(contentRequest, validationResult);

    // Determine final approval status
    validationResult.approved = validationResult.errors.length === 0;

    return validationResult;
  }

  // Cultural sensitivity validation
  async validateCulturalSensitivity(contentRequest, result) {
    const { content, location, targetAudience, contentType } = contentRequest;

    // Check for cultural terms and context
    if (location && this.culturalGuidelines.maori.iwi[location]) {
      const correctIwi = this.culturalGuidelines.maori.iwi[location];
      
      // Check if generic "Māori" is used instead of specific iwi
      if (content.includes('Māori culture') && location !== 'Auckland') {
        result.suggestions.push({
          type: 'cultural_specificity',
          message: `Consider using "${correctIwi} cultural significance" instead of generic "Māori culture" for ${location}`,
          enhancement: `Use specific iwi reference: ${correctIwi}`
        });
      }
    }

    // Check for sacred terms usage
    this.culturalGuidelines.maori.sacredTerms.forEach(term => {
      if (content.toLowerCase().includes(term)) {
        result.warnings.push({
          type: 'sacred_term',
          term: term,
          message: `Sacred term "${term}" detected. Ensure respectful and appropriate context.`,
          guideline: 'Sacred terms require careful, respectful usage with proper cultural context'
        });
      }
    });

    // Check for cultural stereotypes
    const stereotypePatterns = [
      /all M[aā]ori/gi,
      /typical Pacific Islander/gi,
      /traditional lifestyle/gi
    ];

    stereotypePatterns.forEach(pattern => {
      if (pattern.test(content)) {
        result.warnings.push({
          type: 'potential_stereotype',
          message: 'Content may contain cultural generalizations. Consider more specific, respectful language.',
          suggestion: 'Use specific cultural references and avoid broad generalizations'
        });
      }
    });
  }

  // IP and copyright compliance validation
  async validateIPCompliance(contentRequest, result) {
    const { content, contentType, platform } = contentRequest;

    // Check for potential copyright violations
    const copyrightPatterns = [
      /lyrics?.*["\u201C\u201D]/gi,  // Lyrics in quotes
      /song.*verse/gi,               // Song verse references
      /©.*\d{4}/gi,                  // Copyright notices
      /trademark|™|®/gi              // Trademark symbols
    ];

    copyrightPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        result.warnings.push({
          type: 'potential_copyright',
          message: 'Content may include copyrighted material. Review for compliance.',
          guideline: 'Ensure original content creation or proper attribution/licensing'
        });
      }
    });

    // Check for branded content
    const brandPatterns = [
      /McDonald's|Coca-Cola|Disney|Nike|Apple/gi,
      /iPhone|iPad|MacBook/gi,
      /Google|Facebook|Instagram|TikTok/gi
    ];

    brandPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        result.suggestions.push({
          type: 'brand_usage',
          message: `Branded content detected: ${matches.join(', ')}. Ensure appropriate usage context.`,
          guideline: 'Use brand names factually and avoid implying endorsement without permission'
        });
      }
    });

    // Business confidentiality check
    if (contentType === 'business_strategy' || contentType === 'competitive_analysis') {
      result.warnings.push({
        type: 'business_confidentiality',
        message: 'Business content detected. Ensure no proprietary or confidential information is shared.',
        guideline: 'Respect competitor privacy and confidentiality agreements'
      });
    }
  }

  // Māori language usage validation
  async validateMaoriUsage(contentRequest, result) {
    const { content } = contentRequest;
    
    const maoriValidation = validateMaoriUsage(content);
    
    maoriValidation.forEach(issue => {
      result.warnings.push({
        type: 'maori_usage',
        term: issue.term,
        issue: issue.issue,
        suggestion: issue.suggestion,
        guideline: 'Ensure respectful and accurate Te Reo Māori usage'
      });
    });

    // Check for missing macrons
    const maoriWordsWithoutMacrons = content.match(/\b(Maori|Ngai|Tai|whakapapa|mana)\b/g);
    if (maoriWordsWithoutMacrons) {
      result.suggestions.push({
        type: 'macron_missing',
        message: 'Māori words detected without macrons. Consider adding proper macrons for cultural accuracy.',
        words: maoriWordsWithoutMacrons,
        guideline: 'Use proper macrons in Te Reo Māori for cultural respect and accuracy'
      });
    }
  }

  // Add cultural enhancement suggestions
  async addCulturalEnhancements(contentRequest, result) {
    const { location, targetAudience, contentType } = contentRequest;

    // Suggest cultural value integration
    if (location && ['Christchurch', 'Auckland', 'Wellington', 'Rotorua', 'Queenstown'].includes(location)) {
      result.culturalEnhancements.push({
        type: 'manaakitanga_integration',
        message: 'Consider integrating manaakitanga (hospitality and care) values into your content',
        implementation: 'Use welcoming, generous tone that reflects New Zealand hospitality values'
      });
    }

    // Suggest environmental consciousness
    if (targetAudience && targetAudience.includes('environmental')) {
      result.culturalEnhancements.push({
        type: 'kaitiakitanga_integration',
        message: 'Consider integrating kaitiakitanga (environmental guardianship) principles',
        implementation: 'Emphasize sustainable practices and environmental responsibility'
      });
    }

    // Suggest community focus
    if (contentType === 'community' || contentType === 'social') {
      result.culturalEnhancements.push({
        type: 'whakatohea_integration',
        message: 'Consider integrating whakatōhea (collective responsibility) values',
        implementation: 'Emphasize community support, inclusivity, and shared responsibility'
      });
    }
  }

  // User agreement and consent validation
  validateUserConsent(userAgreement) {
    const requiredConsents = [
      'cultural_respect_acknowledgment',
      'ip_compliance_agreement',
      'ethical_content_commitment',
      'maori_cultural_sensitivity'
    ];

    const missingConsents = requiredConsents.filter(consent => !userAgreement[consent]);

    return {
      valid: missingConsents.length === 0,
      missingConsents,
      message: missingConsents.length > 0 
        ? `Please acknowledge: ${missingConsents.join(', ')}`
        : 'All cultural and IP agreements acknowledged'
    };
  }
}

// User Agreement and Sign-up Integration
const REQUIRED_USER_AGREEMENTS = {
  cultural_respect: {
    title: 'Cultural Respect & Sensitivity',
    content: `I acknowledge and commit to:
    • Respecting Māori culture, values, and traditional knowledge
    • Using Te Reo Māori terms respectfully and accurately
    • Acknowledging the cultural significance of places and practices
    • Avoiding appropriation or misrepresentation of cultural elements
    • Supporting authentic cultural representation in all content`,
    required: true
  },
  ip_protection: {
    title: 'Intellectual Property Protection',
    content: `I agree to:
    • Create original content and respect copyright laws
    • Avoid reproducing copyrighted material without permission
    • Attribute sources appropriately and use fair use principles
    • Respect trademarks and branded content guidelines
    • Take responsibility for IP compliance in generated content`,
    required: true
  },
  ethical_content: {
    title: 'Ethical Content Creation',
    content: `I commit to:
    • Creating inclusive, respectful content for all audiences
    • Avoiding harmful stereotypes and discriminatory language
    • Respecting privacy and confidentiality requirements
    • Using AI tools responsibly and ethically
    • Supporting positive representation of communities and cultures`,
    required: true
  },
  maori_cultural_sensitivity: {
    title: 'Te Reo Māori & Cultural Sensitivity',
    content: `I acknowledge:
    • Te Reo Māori is a taonga (treasure) requiring respectful usage
    • The importance of correct pronunciation and cultural context
    • The significance of iwi-specific cultural references
    • My responsibility to learn and use Māori terms appropriately
    • The value of cultural consultation for significant cultural content`,
    required: true
  }
};

// Express.js middleware implementation
const contentEthicsMiddleware = async (req, res, next) => {
  try {
    const validator = new ContentEthicsValidator();
    const validationResult = await validator.validateContent(req.body);

    // Attach validation result to request
    req.ethicsValidation = validationResult;

    // Block request if there are critical errors
    if (!validationResult.approved) {
      return res.status(400).json({
        error: 'Content validation failed',
        details: validationResult.errors,
        warnings: validationResult.warnings
      });
    }

    // Continue with warnings and suggestions
    if (validationResult.warnings.length > 0) {
      console.log('Content Ethics Warnings:', validationResult.warnings);
    }

    next();
  } catch (error) {
    console.error('Content Ethics Validation Error:', error);
    res.status(500).json({ error: 'Ethics validation system error' });
  }
};

// Claude API integration with cultural guidelines
const enhanceClaudePrompt = (originalPrompt, location, culturalContext) => {
  const culturalGuidelines = `
CULTURAL GUIDELINES:
- Use appropriate Te Reo Māori with correct macrons
- Reference specific iwi when discussing ${location}: ${CULTURAL_GUIDELINES.maori.iwi[location] || 'research appropriate iwi'}
- Integrate manaakitanga (hospitality and care) values
- Respect cultural significance and avoid appropriation
- Include cultural context respectfully and accurately

IP PROTECTION:
- Create original content only
- Avoid reproducing copyrighted material
- Use transformative, inspired content rather than direct copying
- Attribute any factual references appropriately

${originalPrompt}`;

  return culturalGuidelines;
};

module.exports = {
  ContentEthicsValidator,
  CULTURAL_GUIDELINES,
  IP_PROTECTION_RULES,
  REQUIRED_USER_AGREEMENTS,
  contentEthicsMiddleware,
  enhanceClaudePrompt
};
