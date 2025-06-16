// Te Reo Māori Glossary System with Hover Tooltips

const MAORI_GLOSSARY = {
  // Geographic and Location Terms
  'Aotearoa': {
    translation: 'Land of the long white cloud',
    context: 'Māori name for New Zealand',
    pronunciation: 'ah-oh-teh-ah-roh-ah',
    usage: 'formal'
  },
  'Te Waipounamu': {
    translation: 'The waters of greenstone',
    context: 'Māori name for South Island',
    pronunciation: 'teh why-poh-nah-moo',
    usage: 'formal'
  },
  'Ōtautahi': {
    translation: 'The place of Tautahi',
    context: 'Māori name for Christchurch',
    pronunciation: 'oh-tah-oo-tah-hee',
    usage: 'formal'
  },
  'Tāmaki Makaurau': {
    translation: 'Tāmaki desired by many',
    context: 'Māori name for Auckland',
    pronunciation: 'tah-mah-kee mah-kah-oo-rah-oo',
    usage: 'formal'
  },
  'Te Whanga-nui-a-Tara': {
    translation: 'The great harbour of Tara',
    context: 'Māori name for Wellington',
    pronunciation: 'teh fah-ngah-noo-ee-ah-tah-rah',
    usage: 'formal'
  },
  'Tāhuna': {
    translation: 'Shallow bay',
    context: 'Māori name for Queenstown',
    pronunciation: 'tah-hoo-nah',
    usage: 'formal'
  },

  // Cultural Values and Concepts
  'manaakitanga': {
    translation: 'Hospitality, care, respect, generosity',
    context: 'Core Māori value of caring for others',
    pronunciation: 'mah-nah-ah-kee-tah-ngah',
    usage: 'common'
  },
  'whakatōhea': {
    translation: 'Collective responsibility and care',
    context: 'Shared responsibility for community wellbeing',
    pronunciation: 'fah-kah-toh-heh-ah',
    usage: 'formal'
  },
  'kaitiakitanga': {
    translation: 'Guardianship, environmental stewardship',
    context: 'Responsibility to protect and care for environment',
    pronunciation: 'kah-ee-tee-ah-kee-tah-ngah',
    usage: 'common'
  },
  'whakapapa': {
    translation: 'Genealogy, relationships, connections',
    context: 'Ancestral connections and relationships',
    pronunciation: 'fah-kah-pah-pah',
    usage: 'formal'
  },
  'mauri': {
    translation: 'Life force, vital essence',
    context: 'Life force present in all things',
    pronunciation: 'mah-oo-ree',
    usage: 'formal'
  },
  'whakatōhea': {
    translation: 'To be friendly, welcoming',
    context: 'Act of being welcoming and inclusive',
    pronunciation: 'fah-kah-toh-heh-ah',
    usage: 'common'
  },

  // Tribal and Cultural Terms
  'iwi': {
    translation: 'Tribe, people',
    context: 'Large kinship group, tribal nation',
    pronunciation: 'ee-wee',
    usage: 'common'
  },
  'Ngāi Tahu': {
    translation: 'People of Tahu',
    context: 'South Island iwi, Canterbury region',
    pronunciation: 'ngah-ee tah-hoo',
    usage: 'formal'
  },
  'Te Arawa': {
    translation: 'The canoe/waka',
    context: 'Bay of Plenty iwi, Rotorua region',
    pronunciation: 'teh ah-rah-wah',
    usage: 'formal'
  },
  'hākari': {
    translation: 'Feast, meal',
    context: 'Communal meal or feast',
    pronunciation: 'hah-kah-ree',
    usage: 'common'
  },
  'pōwhiri': {
    translation: 'Welcome ceremony',
    context: 'Traditional Māori welcome',
    pronunciation: 'poh-fee-ree',
    usage: 'common'
  },
  'hongi': {
    translation: 'Traditional greeting',
    context: 'Pressing noses together in greeting',
    pronunciation: 'hong-gee',
    usage: 'common'
  },

  // General Terms
  'kupu': {
    translation: 'Word, words',
    context: 'Māori language words',
    pronunciation: 'koo-poo',
    usage: 'common'
  },
  'Te Reo Māori': {
    translation: 'The Māori language',
    context: 'Indigenous language of New Zealand',
    pronunciation: 'teh reh-oh mah-oh-ree',
    usage: 'formal'
  },
  'waka': {
    translation: 'Canoe, vessel',
    context: 'Traditional Māori canoe',
    pronunciation: 'wah-kah',
    usage: 'common'
  },
  'whenua': {
    translation: 'Land, country, placenta',
    context: 'Sacred connection to land',
    pronunciation: 'feh-noo-ah',
    usage: 'formal'
  },
  'taonga': {
    translation: 'Treasure, precious thing',
    context: 'Culturally significant items or concepts',
    pronunciation: 'tah-oh-ngah',
    usage: 'common'
  },
  'rongoā': {
    translation: 'Traditional medicine, healing',
    context: 'Māori traditional healing practices',
    pronunciation: 'rong-goh-ah',
    usage: 'formal'
  }
};

// React component for hover glossary
const MaoriGlossary = ({ children, term }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const glossaryEntry = MAORI_GLOSSARY[term];

  if (!glossaryEntry) {
    return <span>{children}</span>;
  }

  return (
    <span 
      className="maori-term relative cursor-help underline decoration-dotted decoration-green-600"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-green-800 text-white text-sm rounded-lg shadow-lg z-10 w-64">
          <div className="font-semibold">{glossaryEntry.translation}</div>
          <div className="text-xs mt-1 opacity-90">{glossaryEntry.context}</div>
          <div className="text-xs mt-1 italic">/{glossaryEntry.pronunciation}/</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-green-800"></div>
        </div>
      )}
    </span>
  );
};

// CSS styles for glossary terms
const GLOSSARY_STYLES = `
.maori-term {
  color: #059669;
  font-weight: 500;
  text-decoration: underline;
  text-decoration-style: dotted;
  cursor: help;
  position: relative;
}

.maori-term:hover {
  color: #047857;
}

.glossary-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  padding: 8px 12px;
  background-color: #1f2937;
  color: white;
  font-size: 12px;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 250px;
  text-align: left;
}

.glossary-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: #1f2937;
}
`;

// Function to automatically wrap Māori terms in content
function wrapMaoriTerms(content) {
  let wrappedContent = content;
  
  Object.keys(MAORI_GLOSSARY).forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    wrappedContent = wrappedContent.replace(regex, (match) => {
      return `<span class="maori-term" data-term="${term.toLowerCase()}">${match}</span>`;
    });
  });
  
  return wrappedContent;
}

// Function to get pronunciation guide
function getPronunciationGuide(term) {
  const entry = MAORI_GLOSSARY[term.toLowerCase()];
  return entry ? entry.pronunciation : null;
}

// Function to get cultural context
function getCulturalContext(term) {
  const entry = MAORI_GLOSSARY[term.toLowerCase()];
  return entry ? entry.context : null;
}

// Validation function for respectful usage
function validateMaoriUsage(content) {
  const issues = [];
  
  Object.keys(MAORI_GLOSSARY).forEach(term => {
    if (content.includes(term)) {
      const entry = MAORI_GLOSSARY[term];
      
      // Check for proper capitalization of formal terms
      if (entry.usage === 'formal' && content.includes(term.toLowerCase())) {
        issues.push({
          term,
          issue: 'Formal term should be capitalized',
          suggestion: `Use "${term}" instead of "${term.toLowerCase()}"`
        });
      }
      
      // Check for context appropriateness
      if (entry.context.includes('sacred') || entry.context.includes('ceremonial')) {
        issues.push({
          term,
          issue: 'Sacred term requires careful context',
          suggestion: 'Ensure respectful usage and appropriate context'
        });
      }
    }
  });
  
  return issues;
}

module.exports = {
  MAORI_GLOSSARY,
  MaoriGlossary,
  GLOSSARY_STYLES,
  wrapMaoriTerms,
  getPronunciationGuide,
  getCulturalContext,
  validateMaoriUsage
};
