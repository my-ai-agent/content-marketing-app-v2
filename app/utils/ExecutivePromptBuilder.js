// Executive Prompt Builder System
// File: /utils/ExecutivePromptBuilder.js

class ExecutivePromptBuilder {
  constructor() {
    this.promptData = {
      persona: null,
      photo: null,
      story: null,
      audience: null,
      interests: null,
      platforms: null,
      isComplete: false,
      completionPercentage: 0,
      lastUpdated: null,
      promptVersion: '1.0'
    };
    // DO NOT call initializeFromStorage in the constructor.
  }

  initializeFromStorage() {
    try {
      const existingPrompt = localStorage.getItem('executivePrompt');
      if (existingPrompt) {
        const parsed = JSON.parse(existingPrompt);
        this.promptData = { ...this.promptData, ...parsed };
      }
      this.validateCompleteness();
    } catch (error) {
      console.error('Error initializing executive prompt:', error);
      this.resetPrompt();
    }
  }

  // ...rest of your methods unchanged...
  // (Paste all the other methods here. They are unchanged.)
}

export default ExecutivePromptBuilder;
