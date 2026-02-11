import React, { useState } from 'react';
import { Send, ChevronRight, CheckCircle, Package, Wrench, Mail, Phone, ExternalLink } from 'lucide-react';

// Subtle CSS animations for professional polish
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }
  
  .animate-slide-in {
    animation: slideIn 0.3s ease-out;
  }
  
  .animate-scale-in {
    animation: scaleIn 0.3s ease-out;
  }
  
  .smooth-transition {
    transition: all 0.2s ease-in-out;
  }
  
  .hover-lift:hover {
    transform: translateY(-1px);
  }
  
  .hover-scale:hover {
    transform: scale(1.02);
  }
  
  .active\:scale-98:active {
    transform: scale(0.98);
  }
`;

// Inject styles into document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

/*
 * GOOGLE SHEETS INTEGRATION SETUP
 * ================================
 * This chatbot saves lead data directly to Google Sheets.
 * 
 * QUICK SETUP (5 minutes):
 * 1. Open Google Sheets and create a new spreadsheet
 * 2. Name it "Storflex Leads" (or whatever you prefer)
 * 3. Follow the detailed instructions in GOOGLE_SHEETS_SETUP.md
 * 4. Copy the Web App URL from Google Apps Script
 * 5. Replace 'YOUR_GOOGLE_SCRIPT_URL_HERE' on line ~670
 * 
 * BENEFITS:
 * - No API keys needed
 * - All leads in one organized place
 * - Easy to filter, sort, and analyze
 * - Can share with team members
 * - Free and unlimited
 */

const PRODUCT_CATALOG = {
  gondola: {
    url: 'https://www.storflex.com/product/gondola-shelving/',
    title: 'Gondola Shelving: Purchase Direct from the Factory',
    name: 'Gondola Shelving',
    category: 'Center Aisle Displays'
  },
  wall: {
    url: 'https://www.storflex.com/product/wall-unit-shelving/',
    title: 'Retail Wall Unit Shelving | Wall Display Shelving',
    name: 'Wall Unit Shelving',
    category: 'Perimeter Displays'
  },
  widespan: {
    url: 'https://www.storflex.com/product/widespan-shelving/',
    title: 'Widespan Shelving (Heavy Duty)',
    name: 'Widespan Shelving',
    category: 'Heavy Duty Storage'
  },
  clearspan: {
    url: 'https://www.storflex.com/product/clearspan-shelving/',
    title: 'Clearspan Shelving | Particle Board Shelves',
    name: 'Clearspan Shelving',
    category: 'Warehouse/Backroom'
  },
  endUnit: {
    url: 'https://www.storflex.com/product/end-unit-displays/',
    title: 'End Unit Displays: Buy Direct from the Manufacturer',
    name: 'End Unit Displays',
    category: 'End Caps'
  },
  insideCorner: {
    url: 'https://www.storflex.com/product/inside-corner-shelving/',
    title: 'Inside Corner Shelving | Merchandising Shelves',
    name: 'Inside Corner Shelving',
    category: 'Corner Solutions'
  },
  boxCorner: {
    url: 'https://www.storflex.com/product/box-corner-shelving/',
    title: 'Box Corner Shelving',
    name: 'Box Corner Shelving',
    category: 'Corner Solutions'
  },
  fourSided: {
    url: 'https://www.storflex.com/product/four-sided-displayer/',
    title: 'Four-Sided Displayer | Mobile Retail Display Unit',
    name: 'Four-Sided Displayers',
    category: 'Impulse Displays'
  },
  cooler: {
    url: 'https://www.storflex.com/product/walk-in-coolers/',
    title: 'Walk-In Coolers & Freezers: Purchase Factory Direct',
    name: 'Walk-In Coolers & Freezers',
    category: 'Refrigeration'
  },
  merchandisingCounter: {
    url: 'https://www.storflex.com/product/merchandising-counter-checkout-system/',
    title: 'Merchandising Retail Sales Counter System',
    name: 'Merchandising Counter System',
    category: 'Checkout Solutions'
  },
  gondolaAccessories: {
    url: 'https://www.storflex.com/product-category/gondola-accessories/',
    title: 'Gondola Shelving Accessories',
    name: 'Gondola Accessories',
    category: 'Accessories'
  },
  retailShelves: {
    url: 'https://www.storflex.com/product-category/retail-shelves/',
    title: 'Retail Store Shelving | Buy Retail Shelves Factory Direct',
    name: 'Specialty Shelves',
    category: 'Shelving Options'
  },
  woodDisplays: {
    url: 'https://www.storflex.com/product-category/wood-retail-displays/',
    title: 'Wood Retail Displays & Shelving',
    name: 'Wood Displays',
    category: 'Premium Finishes'
  },
  rxPharmacy: {
    url: 'https://www.storflex.com/product-category/rx-pharmacy-fixtures/',
    title: 'Rx Pharmacy Retail Store Fixtures',
    name: 'Pharmacy Fixtures',
    category: 'Pharmacy Solutions'
  },
  allProducts: {
    url: 'https://www.storflex.com/store-fixture-displays/',
    title: 'Shop All Store Fixture Displays',
    name: 'All Store Fixtures & Displays',
    category: 'Complete Catalog'
  }
};

const StorflexAssistant = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Welcome! I'm the Storflex Assistant. I can help you choose the right shelving or fixtures and get you to a quote quickly.",
      timestamp: new Date()
    },
    {
      type: 'bot',
      text: "What are you working on today?",
      options: [
        { id: 'A', label: 'New store / remodel' },
        { id: 'B', label: 'Add or replace shelving' },
        { id: 'C', label: 'Walk-in cooler / freezer' },
        { id: 'D', label: 'Parts, install, or instructions' },
        { id: 'E', label: 'Something else' }
      ],
      timestamp: new Date()
    }
  ]);
  
  const [conversationState, setConversationState] = useState({
    mode: null,
    intent: null,
    businessType: null,
    location: null,
    items: null,
    displayType: null,
    adjustability: null,
    spaceInfo: null,
    sectionCount: null,
    timeline: null,
    supportType: null,
    leadData: {},
    uncertaintyCount: 0, // Track "not sure" answers for adaptive handoff
    skippedQuestions: [], // Track which questions were intelligently skipped
    confidenceFactors: {} // Track factors for confidence scoring
  });
  
  const [inputValue, setInputValue] = useState('');
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadFormData, setLeadFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    notes: ''
  });
  
  // Widget toggle state
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  const addMessage = (type, text, options = null, productLinks = null, whyFits = null) => {
    const newMessage = {
      type,
      text,
      options,
      productLinks,
      whyFits,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const skipToTimeline = () => {
    addMessage('bot', "What's your timeline?", [
      { id: 'asap', label: 'ASAP / this month' },
      { id: 'soon', label: '1-3 months' },
      { id: 'planning', label: 'Just planning' }
    ]);
  };

  const handleIntentSelection = (intentId) => {
    const labels = {
      'A': 'New store / remodel',
      'B': 'Add or replace shelving',
      'C': 'Walk-in cooler / freezer',
      'D': 'Parts, install, or instructions',
      'E': 'Something else'
    };
    
    addMessage('user', labels[intentId]);
    
    if (intentId === 'D') {
      setConversationState(prev => ({ ...prev, mode: 'support', intent: intentId }));
      setTimeout(() => {
        addMessage('bot', "I can help with that! What do you need assistance with?", [
          { id: 'assembly', label: 'Assembly instructions' },
          { id: 'parts', label: 'Missing or replacement parts' },
          { id: 'identify', label: 'Identify a component' },
          { id: 'troubleshoot', label: 'Troubleshooting' }
        ]);
      }, 500);
    } else if (intentId === 'E') {
      // Custom flow for "Something else"
      setConversationState(prev => ({ ...prev, mode: 'custom', intent: intentId }));
      setTimeout(() => {
        addMessage('bot', "I'd love to help! Please describe what you're looking for, and I'll do my best to point you in the right direction.\n\n(For example: displays, storage solutions, specific fixtures, accessories, etc.)");
      }, 500);
    } else {
      setConversationState(prev => ({ ...prev, mode: 'sales', intent: intentId }));
      setTimeout(() => {
        addMessage('bot', "Great! Let me ask a few quick questions to find the best solution for you.");
        setTimeout(() => {
          addMessage('bot', "What type of business is this for?", [
            { id: 'grocery', label: 'Grocery / Supermarket' },
            { id: 'convenience', label: 'Convenience store' },
            { id: 'hardware', label: 'Hardware store' },
            { id: 'pharmacy', label: 'Pharmacy' },
            { id: 'pet', label: 'Pet store' },
            { id: 'liquor', label: 'Liquor store' },
            { id: 'retail', label: 'Other retail' },
            { id: 'warehouse', label: 'Warehouse/Distribution' }
          ]);
        }, 500);
      }, 500);
    }
  };

  // Keyword detection and smart recommendation system
  const analyzeCustomRequest = (userMessage) => {
    const message = userMessage.toLowerCase();
    const recommendations = [];
    
    // Keyword mappings to products
    const keywordMap = {
      // Display types
      display: ['gondola', 'wall', 'endUnit', 'fourSided'],
      displays: ['gondola', 'wall', 'endUnit', 'fourSided'],
      shelving: ['gondola', 'wall', 'widespan', 'clearspan'],
      shelves: ['gondola', 'wall', 'widespan', 'clearspan'],
      shelf: ['gondola', 'wall', 'widespan'],
      
      // Specific products
      gondola: ['gondola', 'gondolaAccessories'],
      wall: ['wall'],
      'end cap': ['endUnit'],
      endcap: ['endUnit'],
      corner: ['insideCorner', 'boxCorner'],
      checkout: ['merchandisingCounter'],
      counter: ['merchandisingCounter'],
      
      // Heavy duty / warehouse
      heavy: ['widespan', 'clearspan'],
      warehouse: ['widespan', 'clearspan'],
      storage: ['widespan', 'clearspan'],
      backroom: ['clearspan'],
      
      // Refrigeration
      cooler: ['cooler'],
      freezer: ['cooler'],
      refrigeration: ['cooler'],
      'walk-in': ['cooler'],
      
      // Materials
      wood: ['woodDisplays'],
      wooden: ['woodDisplays'],
      
      // Specific industries
      pharmacy: ['rxPharmacy'],
      
      // Accessories
      accessories: ['gondolaAccessories', 'retailShelves'],
      parts: ['gondolaAccessories'],
      hooks: ['gondolaAccessories'],
      baskets: ['gondolaAccessories'],
      
      // General retail
      retail: ['gondola', 'wall', 'endUnit'],
      store: ['gondola', 'wall', 'endUnit'],
      fixtures: ['gondola', 'wall', 'merchandisingCounter'],
      
      // Mobile/portable
      mobile: ['fourSided'],
      portable: ['fourSided'],
      movable: ['fourSided']
    };
    
    // Check for keywords in the message
    const foundProducts = new Set();
    
    Object.keys(keywordMap).forEach(keyword => {
      if (message.includes(keyword)) {
        keywordMap[keyword].forEach(product => foundProducts.add(product));
      }
    });
    
    // If we found matching products, recommend them
    if (foundProducts.size > 0) {
      const productLinks = Array.from(foundProducts)
        .slice(0, 3) // Limit to top 3 matches
        .map(productKey => PRODUCT_CATALOG[productKey]);
      
      let responseText = "Based on what you described, here are some products that might work for you:\n\n";
      
      addMessage('bot', responseText, null, productLinks);
      
      setTimeout(() => {
        addMessage('bot', "Would you like more information, or should I connect you with a specialist?", [
          { id: 'browse_all', label: 'Browse all products' },
          { id: 'quote_custom', label: 'Get a custom quote' },
          { id: 'call_custom', label: 'Speak with a specialist' }
        ]);
      }, 1000);
      
      return true;
    }
    
    // No keywords matched - provide general help
    addMessage('bot', "I want to make sure I understand correctly. Are you looking for:\n\n• Store fixtures and displays?\n• Shelving systems?\n• Refrigeration equipment?\n• Something else entirely?\n\nFeel free to describe it in more detail, or I can connect you directly with a specialist who can help!", [
      { id: 'browse_all', label: 'Browse all products' },
      { id: 'call_custom', label: 'Speak with a specialist' }
    ]);
    
    return false;
  };

  const handleCustomResponse = (optionId) => {
    if (optionId === 'browse_all') {
      addMessage('user', 'Browse all products');
      setTimeout(() => {
        addMessage('bot', "Here's our complete product catalog:", null, [PRODUCT_CATALOG.allProducts]);
      }, 500);
    } else if (optionId === 'quote_custom' || optionId === 'call_custom') {
      addMessage('user', optionId === 'quote_custom' ? 'Get a custom quote' : 'Speak with a specialist');
      setTimeout(() => {
        addMessage('bot', "Perfect! Let me collect your information so we can help you.\n\nWhat's the best way to reach you?");
        setShowLeadForm(true);
      }, 500);
    }
  };

  const handleBusinessType = (typeId) => {
    const labels = {
      grocery: 'Grocery / Supermarket',
      convenience: 'Convenience store',
      hardware: 'Hardware store',
      pharmacy: 'Pharmacy',
      pet: 'Pet store',
      liquor: 'Liquor store',
      retail: 'Other retail',
      warehouse: 'Warehouse/Distribution'
    };
    
    addMessage('user', labels[typeId]);
    setConversationState(prev => ({ ...prev, businessType: typeId }));
    
    setTimeout(() => {
      if (conversationState.intent === 'C') {
        addMessage('bot', "Perfect. What type of refrigeration do you need?", [
          { id: 'cooler', label: 'Walk-in cooler (35-45F)' },
          { id: 'freezer', label: 'Walk-in freezer (-10 to 0F)' },
          { id: 'both_cf', label: 'Both cooler and freezer' }
        ]);
      } else {
        addMessage('bot', "Where will the shelving be located?", [
          { id: 'aisles', label: 'Center aisles (double-sided)' },
          { id: 'wall', label: 'Against walls (single-sided)' },
          { id: 'endcaps', label: 'End caps / End displays' },
          { id: 'corners', label: 'Corners of the store' },
          { id: 'checkout', label: 'Checkout / Front-end' },
          { id: 'multiple', label: 'Multiple areas' },
          { id: 'not_sure', label: 'Not sure yet' }
        ]);
      }
    }, 500);
  };

  const handleLocation = (locationId) => {
    const labels = {
      aisles: 'Center aisles (double-sided)',
      wall: 'Against walls (single-sided)',
      endcaps: 'End caps / End displays',
      corners: 'Corners of the store',
      checkout: 'Checkout / Front-end',
      multiple: 'Multiple areas',
      not_sure: 'Not sure yet',
      cooler: 'Walk-in cooler (35-45F)',
      freezer: 'Walk-in freezer (-10 to 0F)',
      both_cf: 'Both cooler and freezer'
    };
    
    addMessage('user', labels[locationId]);
    
    // Track uncertainty
    let newUncertaintyCount = conversationState.uncertaintyCount;
    if (locationId === 'not_sure') {
      newUncertaintyCount++;
    }
    
    setConversationState(prev => ({ 
      ...prev, 
      location: locationId,
      uncertaintyCount: newUncertaintyCount
    }));
    
    setTimeout(() => {
      // ADAPTIVE: Fast-track to human if too much uncertainty
      if (newUncertaintyCount >= 2) {
        addMessage('bot', "I notice you're exploring different options. Let me connect you with a specialist who can better understand your needs:\n\n**Would you like to speak with someone directly?**", [
          { id: 'yes_connect', label: 'Yes, connect me with specialist' },
          { id: 'continue_chatbot', label: 'No, continue with questions' }
        ]);
        return;
      }
      
      // ADAPTIVE: Cooler/freezer has unique requirements - skip standard retail questions
      if (locationId === 'cooler' || locationId === 'freezer' || locationId === 'both_cf') {
        setConversationState(prev => ({ 
          ...prev, 
          skippedQuestions: [...prev.skippedQuestions, 'items', 'displayType', 'adjustability', 'spaceInfo']
        }));
        skipToTimeline();
        return;
      }
      
      // ADAPTIVE: Wall-only skips aisle-specific questions
      if (locationId === 'wall') {
        addMessage('bot', "For wall perimeter shelving, what **product type** will you display?", [
          { id: 'packaged', label: 'Packaged goods (cans, boxes)' },
          { id: 'hanging', label: 'Hanging merchandise' },
          { id: 'mixed', label: 'Mix of products' },
          { id: 'pharmacy_items', label: 'Pharmacy/Rx items' }
        ]);
        // Note: Wall-only doesn't need aisle width questions
        setConversationState(prev => ({ 
          ...prev, 
          skippedQuestions: [...prev.skippedQuestions, 'aisleWidth']
        }));
        return;
      }
      
      // ADAPTIVE: Endcaps/corners are specialty - go straight to display type
      if (locationId === 'endcaps') {
        addMessage('bot', "What type of end cap display interests you?", [
          { id: 'standard_end', label: 'Standard end units' },
          { id: 'promotional', label: 'Promotional / Seasonal displays' },
          { id: 'both_ends', label: 'Both options' }
        ]);
        return;
      } 
      
      if (locationId === 'corners') {
        addMessage('bot', "What type of corner solution do you need?", [
          { id: 'inside_corner', label: 'Inside corner (90° transition)' },
          { id: 'box_corner', label: 'Box corner (eliminate dead space)' },
          { id: 'not_sure_corner', label: 'Not sure - need advice' }
        ]);
        return;
      } 
      
      // ADAPTIVE: Checkout is impulse/small footprint - different questions
      if (locationId === 'checkout') {
        addMessage('bot', "What are you looking for at checkout?", [
          { id: 'counter_system', label: 'Merchandising counter system' },
          { id: 'impulse_displays', label: 'Impulse / Four-sided displays' },
          { id: 'both_checkout', label: 'Both options' }
        ]);
        return;
      }
      
      // ADAPTIVE: Multiple areas needs more detail
      if (locationId === 'multiple') {
        addMessage('bot', "For multiple areas, which is your **primary focus** right now?", [
          { id: 'aisles', label: 'Center aisles' },
          { id: 'wall', label: 'Wall displays' },
          { id: 'entire_store', label: 'Entire store layout' }
        ]);
        return;
      }
      
      // Standard path for center aisles
      addMessage('bot', "What will you be displaying?", [
        { id: 'packaged', label: 'Packaged goods (cans, boxes)' },
        { id: 'bulk', label: 'Bulk items or cases' },
        { id: 'hanging', label: 'Hanging merchandise' },
        { id: 'mixed', label: 'Mix of products' },
        { id: 'pharmacy_items', label: 'Pharmacy/Rx items' },
        { id: 'hardware_items', label: 'Hardware/Tools' },
        { id: 'specialty', label: 'Specialty/variable items' }
      ]);
    }, 500);
  };

  const handleDisplayType = (displayId) => {
    const labels = {
      standard_end: 'Standard end units',
      promotional: 'Promotional / Seasonal displays',
      both_ends: 'Both options',
      inside_corner: 'Inside corner (dramatic transition)',
      box_corner: 'Box corner (eliminate dead space)',
      not_sure_corner: 'Not sure - need advice',
      counter_system: 'Merchandising counter system',
      impulse_displays: 'Impulse / Four-sided displays',
      both_checkout: 'Both options'
    };
    
    addMessage('user', labels[displayId]);
    setConversationState(prev => ({ ...prev, displayType: displayId }));
    
    setTimeout(() => {
      skipToTimeline();
    }, 500);
  };

  const handleItems = (itemsId) => {
    const labels = {
      packaged: 'Packaged goods (cans, boxes)',
      bulk: 'Bulk items or cases',
      mixed: 'Mix of products',
      hanging: 'Hanging merchandise',
      pharmacy_items: 'Pharmacy/Rx items',
      hardware_items: 'Hardware/Tools',
      specialty: 'Specialty/variable items'
    };
    
    addMessage('user', labels[itemsId]);
    
    // Track uncertainty
    let newUncertaintyCount = conversationState.uncertaintyCount;
    if (itemsId === 'specialty' || itemsId === 'mixed') {
      // These are less specific, slight uncertainty indicator
    }
    
    setConversationState(prev => ({ 
      ...prev, 
      items: itemsId,
      uncertaintyCount: newUncertaintyCount
    }));
    
    setTimeout(() => {
      // ADAPTIVE: Bulk/heavy items skip adjustability, ask about capacity
      if (itemsId === 'bulk') {
        addMessage('bot', "For bulk storage, I need to understand **capacity needs**:\n\nWill you need pallet-level access or forklift clearance?", [
          { id: 'pallet_yes', label: 'Yes - pallet/forklift access needed' },
          { id: 'pallet_no', label: 'No - hand-stocked only' },
          { id: 'pallet_unsure', label: 'Not sure' }
        ]);
        setConversationState(prev => ({ 
          ...prev, 
          skippedQuestions: [...prev.skippedQuestions, 'adjustability']
        }));
        return;
      }
      
      // ADAPTIVE: Hanging merchandise needs hook/arm questions, not shelf questions
      if (itemsId === 'hanging') {
        addMessage('bot', "For hanging merchandise, what **display type** works best?", [
          { id: 'faceout', label: 'Faceout displays' },
          { id: 'waterfall', label: 'Waterfall hooks' },
          { id: 'straight_arm', label: 'Straight arms' },
          { id: 'mixed_hanging', label: 'Mix of styles' }
        ]);
        setConversationState(prev => ({ 
          ...prev, 
          skippedQuestions: [...prev.skippedQuestions, 'adjustability']
        }));
        return;
      }
      
      // ADAPTIVE: Pharmacy items go to specialized pharmacy fixtures
      if (itemsId === 'pharmacy_items') {
        addMessage('bot', "For pharmacy items, do you need **specialized Rx fixtures** or standard shelving?", [
          { id: 'rx_specialized', label: 'Specialized Rx bay fixtures' },
          { id: 'rx_standard', label: 'Standard shelving for OTC' },
          { id: 'rx_both', label: 'Both Rx and OTC' }
        ]);
        setConversationState(prev => ({ 
          ...prev, 
          skippedQuestions: [...prev.skippedQuestions, 'adjustability']
        }));
        return;
      }
      
      // ADAPTIVE: Hardware items often need pegboard/slatwall
      if (itemsId === 'hardware_items') {
        addMessage('bot', "Hardware displays often use **pegboard or slatwall**. What's your preference?", [
          { id: 'pegboard_hw', label: 'Pegboard (traditional)' },
          { id: 'slatwall_hw', label: 'Slatwall (modern)' },
          { id: 'shelving_hw', label: 'Standard shelving' },
          { id: 'mixed_hw', label: 'Combination' }
        ]);
        setConversationState(prev => ({ 
          ...prev, 
          skippedQuestions: [...prev.skippedQuestions, 'adjustability']
        }));
        return;
      }
      
      // Standard path for packaged goods/mixed
      addMessage('bot', "What type of display works best for your products?", [
        { id: 'adjustable', label: 'Adjustable shelving (flexibility)' },
        { id: 'fixed', label: 'Fixed shelving (economy)' },
        { id: 'mixed_display', label: 'Mix of both' },
        { id: 'not_sure_display', label: 'Not sure' }
      ]);
    }, 500);
  };

  const handleAdjustability = (adjustId) => {
    const labels = {
      yes: 'Yes, adjustable shelving',
      no: 'No, fixed heights are fine',
      unsure: 'Not sure'
    };
    
    addMessage('user', labels[adjustId]);
    setConversationState(prev => ({ ...prev, adjustability: adjustId }));
    
    setTimeout(() => {
      addMessage('bot', "How would you describe your space?", [
        { id: 'footage', label: 'I know square footage' },
        { id: 'sections', label: 'I know number of sections needed' },
        { id: 'dimensions', label: 'I have wall dimensions' },
        { id: 'help', label: 'Need help figuring it out' }
      ]);
    }, 500);
  };

  const handleSpaceInfo = (spaceId) => {
    const labels = {
      square_footage: 'I know square footage',
      linear_footage: 'I know linear footage',
      sections: 'I know number of sections needed',
      dimensions: 'I have wall dimensions',
      help: 'Need help figuring it out'
    };
    
    addMessage('user', labels[spaceId]);
    setConversationState(prev => ({ ...prev, spaceInfo: spaceId }));
    
    // ADAPTIVE: Square footage calculation
    if (spaceId === 'square_footage') {
      setTimeout(() => {
        addMessage('bot', "Great! What's your approximate **square footage** for this shelving area?", [
          { id: 'sqft_100', label: 'Under 100 sq ft' },
          { id: 'sqft_250', label: '100-250 sq ft' },
          { id: 'sqft_500', label: '250-500 sq ft' },
          { id: 'sqft_1000', label: '500-1,000 sq ft' },
          { id: 'sqft_more', label: '1,000+ sq ft' }
        ]);
      }, 500);
    }
    // ADAPTIVE: Linear footage calculation
    else if (spaceId === 'linear_footage') {
      setTimeout(() => {
        addMessage('bot', "Perfect! What's your approximate **linear footage** available?", [
          { id: 'linear_12', label: '12-24 feet' },
          { id: 'linear_36', label: '24-48 feet' },
          { id: 'linear_72', label: '48-96 feet' },
          { id: 'linear_more', label: '96+ feet' }
        ]);
      }, 500);
    }
    // ADAPTIVE: Direct sections known
    else if (spaceId === 'sections') {
      setTimeout(() => {
        addMessage('bot', "How many sections do you need?", [
          { id: '1-5', label: '1-5 sections' },
          { id: '6-15', label: '6-15 sections' },
          { id: '16-30', label: '16-30 sections' },
          { id: '30+', label: '30+ sections' }
        ]);
      }, 500);
    }
    // ADAPTIVE: Dimensions calculation
    else if (spaceId === 'dimensions') {
      setTimeout(() => {
        addMessage('bot', "What are your wall dimensions? Please provide **length in feet** (approximate):", [
          { id: 'wall_8', label: '8-16 feet' },
          { id: 'wall_20', label: '16-24 feet' },
          { id: 'wall_32', label: '24-40 feet' },
          { id: 'wall_more', label: '40+ feet' }
        ]);
      }, 500);
    }
    // Need help
    else {
      setTimeout(() => {
        addMessage('bot', "No problem! Let's figure it out together. Do you know the **approximate size** of the area where shelving will go?", [
          { id: 'small_area', label: 'Small area (retail corner/section)' },
          { id: 'medium_area', label: 'Medium area (1-2 aisles)' },
          { id: 'large_area', label: 'Large area (full store section)' },
          { id: 'whole_store', label: 'Entire store' }
        ]);
      }, 500);
    }
  };
  
  // SPACE CALCULATION HANDLERS
  
  const handleSquareFootage = (sqftId) => {
    const labels = {
      sqft_100: 'Under 100 sq ft',
      sqft_250: '100-250 sq ft',
      sqft_500: '250-500 sq ft',
      sqft_1000: '500-1,000 sq ft',
      sqft_more: '1,000+ sq ft'
    };
    
    addMessage('user', labels[sqftId]);
    
    // Calculate recommended sections based on square footage
    // Standard gondola: 3-4 ft wide, assume 4-5 ft aisle clearance needed
    // Rule of thumb: ~40-60 sq ft per gondola section (depending on layout)
    let recommendation;
    let sqftRange;
    let reasoning;
    
    if (sqftId === 'sqft_100') {
      recommendation = '2-4 sections';
      sqftRange = '~100 sq ft';
      reasoning = 'Compact space ideal for 2-4 gondola sections (3-4 ft each) with aisle clearance. Perfect for specialty areas or end caps.';
    } else if (sqftId === 'sqft_250') {
      recommendation = '4-8 sections';
      sqftRange = '100-250 sq ft';
      reasoning = 'Mid-size space can accommodate 4-8 sections creating 12-32 linear feet of display with proper aisle width (4-5 ft).';
    } else if (sqftId === 'sqft_500') {
      recommendation = '8-15 sections';
      sqftRange = '250-500 sq ft';
      reasoning = 'Large space perfect for 8-15 sections, creating multiple aisles or a full perimeter wall display with excellent traffic flow.';
    } else if (sqftId === 'sqft_1000') {
      recommendation = '15-30 sections';
      sqftRange = '500-1,000 sq ft';
      reasoning = 'Substantial retail space supporting 15-30 sections in multiple configurations: center aisles, perimeter walls, or mixed layouts.';
    } else {
      recommendation = '30+ sections';
      sqftRange = '1,000+ sq ft';
      reasoning = 'Large-scale retail space with 30+ sections. Perfect for full store layouts, multiple departments, or warehouse-style displays.';
    }
    
    setConversationState(prev => ({ 
      ...prev, 
      calculatedSections: recommendation,
      spaceDetails: {
        squareFootage: sqftRange,
        recommendedSections: recommendation,
        reasoning: reasoning
      },
      confidenceFactors: { ...prev.confidenceFactors, hasSpaceCalculation: true }
    }));
    
    setTimeout(() => {
      addMessage('bot', `**Space Analysis for ${sqftRange}:**\n\n📏 **Recommended:** ${recommendation}\n\n💡 **Why this fits:**\n${reasoning}\n\n*Based on standard 3-4 ft sections with 4-5 ft aisle clearance*`);
      
      setTimeout(() => {
        addMessage('bot', "Does this recommendation align with your vision?", [
          { id: 'space_good', label: 'Yes, sounds right' },
          { id: 'space_more', label: 'Need more sections' },
          { id: 'space_less', label: 'Need fewer sections' },
          { id: 'space_unsure', label: 'Still not sure' }
        ]);
      }, 1000);
    }, 500);
  };
  
  const handleLinearFootage = (linearId) => {
    const labels = {
      linear_12: '12-24 feet',
      linear_36: '24-48 feet',
      linear_72: '48-96 feet',
      linear_more: '96+ feet'
    };
    
    addMessage('user', labels[linearId]);
    
    // Calculate sections based on linear footage
    // Standard section: 3 ft (36") or 4 ft (48") wide
    let recommendation;
    let linearRange;
    let reasoning;
    
    if (linearId === 'linear_12') {
      recommendation = '3-6 sections';
      linearRange = '12-24 feet';
      reasoning = 'With 12-24 linear feet, you can fit 3-6 sections (assuming 4 ft sections). Great for wall displays or short aisles.';
    } else if (linearId === 'linear_36') {
      recommendation = '6-12 sections';
      linearRange = '24-48 feet';
      reasoning = 'Your 24-48 linear feet accommodates 6-12 sections, perfect for one full aisle or extended wall displays with excellent product visibility.';
    } else if (linearId === 'linear_72') {
      recommendation = '12-24 sections';
      linearRange = '48-96 feet';
      reasoning = 'With 48-96 linear feet available, 12-24 sections will create substantial display capacity across multiple aisles or full perimeter coverage.';
    } else {
      recommendation = '24+ sections';
      linearRange = '96+ feet';
      reasoning = 'Your 96+ linear feet supports 24+ sections for extensive merchandising across multiple aisles, departments, or full-store configurations.';
    }
    
    setConversationState(prev => ({ 
      ...prev, 
      calculatedSections: recommendation,
      spaceDetails: {
        linearFootage: linearRange,
        recommendedSections: recommendation,
        reasoning: reasoning
      },
      confidenceFactors: { ...prev.confidenceFactors, hasSpaceCalculation: true }
    }));
    
    setTimeout(() => {
      addMessage('bot', `**Space Analysis for ${linearRange}:**\n\n📏 **Recommended:** ${recommendation}\n\n💡 **Why this fits:**\n${reasoning}\n\n*Based on standard 4 ft (48") gondola sections*`);
      
      setTimeout(() => {
        addMessage('bot', "Does this sound about right?", [
          { id: 'space_good', label: 'Yes, perfect' },
          { id: 'space_adjust', label: 'Need to adjust' }
        ]);
      }, 1000);
    }, 500);
  };
  
  const handleAreaSize = (areaId) => {
    const labels = {
      small_area: 'Small area (retail corner/section)',
      medium_area: 'Medium area (1-2 aisles)',
      large_area: 'Large area (full store section)',
      whole_store: 'Entire store'
    };
    
    addMessage('user', labels[areaId]);
    
    let recommendation;
    let reasoning;
    
    if (areaId === 'small_area') {
      recommendation = '2-5 sections';
      reasoning = 'Small corner or section area typically fits 2-5 sections, ideal for specialty displays, end caps, or focused product categories.';
    } else if (areaId === 'medium_area') {
      recommendation = '6-15 sections';
      reasoning = 'Medium area with 1-2 aisles fits 6-15 sections comfortably, creating organized product zones with good traffic flow.';
    } else if (areaId === 'large_area') {
      recommendation = '16-40 sections';
      reasoning = 'Large store section accommodates 16-40 sections for comprehensive department displays with multiple aisles and categories.';
    } else {
      recommendation = '40+ sections';
      reasoning = 'Full store layout requires 40+ sections to create complete merchandising environment with multiple departments and optimal flow.';
    }
    
    setConversationState(prev => ({ 
      ...prev, 
      calculatedSections: recommendation,
      spaceDetails: {
        areaSize: labels[areaId],
        recommendedSections: recommendation,
        reasoning: reasoning
      },
      confidenceFactors: { ...prev.confidenceFactors, hasSpaceCalculation: true }
    }));
    
    setTimeout(() => {
      addMessage('bot', `**Space Recommendation:**\n\n📏 **Sections Needed:** ${recommendation}\n\n💡 **Why:**\n${reasoning}`);
      
      setTimeout(() => {
        skipToTimeline();
      }, 1000);
    }, 500);
  };
  
  const handleSpaceConfirmation = (confirmId) => {
    if (confirmId === 'space_good' || confirmId === 'space_adjust') {
      addMessage('user', confirmId === 'space_good' ? 'Yes, sounds right' : 'Yes, perfect');
      setTimeout(() => {
        skipToTimeline();
      }, 500);
    } else if (confirmId === 'space_more') {
      addMessage('user', 'Need more sections');
      // Increase by ~50%
      const current = conversationState.calculatedSections;
      setTimeout(() => {
        addMessage('bot', "Understood! We can scale up. Would you like to speak with a specialist to optimize your larger space?", [
          { id: 'send_to_specialist', label: 'Yes, get specialist help' },
          { id: 'continue_more', label: 'Continue with larger estimate' }
        ]);
      }, 500);
    } else if (confirmId === 'space_less') {
      addMessage('user', 'Need fewer sections');
      setTimeout(() => {
        addMessage('bot', "No problem! We can work with a smaller footprint. Let's continue with your scaled-down needs.");
        setTimeout(() => skipToTimeline(), 1000);
      }, 500);
    } else if (confirmId === 'space_unsure') {
      addMessage('user', 'Still not sure');
      let newUncertaintyCount = conversationState.uncertaintyCount + 1;
      setConversationState(prev => ({ ...prev, uncertaintyCount: newUncertaintyCount }));
      
      if (newUncertaintyCount >= 2) {
        setTimeout(() => {
          addMessage('bot', "I'd recommend speaking with a Storflex specialist who can help calculate your exact needs:\n\n📞 **(800) 869-2040**\n📧 **customerservice@storflex.com**\n\nOr I can have someone reach out:", [
            { id: 'send_to_specialist', label: 'Have specialist contact me' },
            { id: 'continue_anyway', label: 'Continue with estimate' }
          ]);
        }, 500);
      } else {
        setTimeout(() => {
          skipToTimeline();
        }, 500);
      }
    } else if (confirmId === 'continue_more' || confirmId === 'continue_anyway') {
      addMessage('user', 'Continue');
      setTimeout(() => {
        skipToTimeline();
      }, 500);
    }
  };

  const handleSectionCount = (countId) => {
    const labels = {
      '1-5': '1-5 sections',
      '6-15': '6-15 sections',
      '16-30': '16-30 sections',
      '30+': '30+ sections'
    };
    
    addMessage('user', labels[countId]);
    setConversationState(prev => ({ ...prev, sectionCount: countId }));
    
    setTimeout(() => {
      skipToTimeline();
    }, 500);
  };

  // NEW ADAPTIVE PATH HANDLERS
  
  const handlePalletAccess = (palletId) => {
    const labels = {
      pallet_yes: 'Yes - pallet/forklift access needed',
      pallet_no: 'No - hand-stocked only',
      pallet_unsure: 'Not sure'
    };
    
    addMessage('user', labels[palletId]);
    
    // Track uncertainty
    let newUncertaintyCount = conversationState.uncertaintyCount;
    if (palletId === 'pallet_unsure') newUncertaintyCount++;
    
    setConversationState(prev => ({ 
      ...prev, 
      palletAccess: palletId,
      uncertaintyCount: newUncertaintyCount,
      confidenceFactors: { ...prev.confidenceFactors, hasPalletInfo: palletId !== 'pallet_unsure' }
    }));
    
    setTimeout(() => {
      if (palletId === 'pallet_yes') {
        addMessage('bot', "For pallet-level storage, approximately **how many pallet positions** do you need?", [
          { id: 'pallets_10', label: '5-10 positions' },
          { id: 'pallets_25', label: '10-25 positions' },
          { id: 'pallets_50', label: '25-50 positions' },
          { id: 'pallets_more', label: '50+ positions' }
        ]);
      } else {
        skipToTimeline();
      }
    }, 500);
  };
  
  const handlePalletPositions = (positionsId) => {
    const labels = {
      pallets_10: '5-10 positions',
      pallets_25: '10-25 positions',
      pallets_50: '25-50 positions',
      pallets_more: '50+ positions'
    };
    
    addMessage('user', labels[positionsId]);
    setConversationState(prev => ({ 
      ...prev, 
      palletPositions: positionsId,
      confidenceFactors: { ...prev.confidenceFactors, hasQuantity: true }
    }));
    
    setTimeout(() => {
      skipToTimeline();
    }, 500);
  };
  
  const handleHangingDisplay = (hangingId) => {
    const labels = {
      faceout: 'Faceout displays',
      waterfall: 'Waterfall hooks',
      straight_arm: 'Straight arms',
      mixed_hanging: 'Mix of styles'
    };
    
    addMessage('user', labels[hangingId]);
    setConversationState(prev => ({ 
      ...prev, 
      hangingDisplay: hangingId,
      confidenceFactors: { ...prev.confidenceFactors, hasDisplayPreference: true }
    }));
    
    setTimeout(() => {
      addMessage('bot', "What's the approximate **linear footage** for hanging displays?", [
        { id: 'hanging_12', label: '4-12 feet' },
        { id: 'hanging_24', label: '12-24 feet' },
        { id: 'hanging_48', label: '24-48 feet' },
        { id: 'hanging_more', label: '48+ feet' }
      ]);
    }, 500);
  };
  
  const handleHangingFootage = (footageId) => {
    const labels = {
      hanging_12: '4-12 feet',
      hanging_24: '12-24 feet',
      hanging_48: '24-48 feet',
      hanging_more: '48+ feet'
    };
    
    addMessage('user', labels[footageId]);
    setConversationState(prev => ({ 
      ...prev, 
      hangingFootage: footageId,
      confidenceFactors: { ...prev.confidenceFactors, hasSpaceInfo: true }
    }));
    
    setTimeout(() => {
      skipToTimeline();
    }, 500);
  };
  
  const handlePharmacyType = (pharmaId) => {
    const labels = {
      rx_specialized: 'Specialized Rx bay fixtures',
      rx_standard: 'Standard shelving for OTC',
      rx_both: 'Both Rx and OTC'
    };
    
    addMessage('user', labels[pharmaId]);
    setConversationState(prev => ({ 
      ...prev, 
      pharmacyType: pharmaId,
      confidenceFactors: { ...prev.confidenceFactors, hasSpecialtyNeeds: true }
    }));
    
    setTimeout(() => {
      skipToTimeline();
    }, 500);
  };
  
  const handleHardwareDisplay = (hwId) => {
    const labels = {
      pegboard_hw: 'Pegboard (traditional)',
      slatwall_hw: 'Slatwall (modern)',
      shelving_hw: 'Standard shelving',
      mixed_hw: 'Combination'
    };
    
    addMessage('user', labels[hwId]);
    setConversationState(prev => ({ 
      ...prev, 
      hardwareDisplay: hwId,
      confidenceFactors: { ...prev.confidenceFactors, hasDisplayPreference: true }
    }));
    
    setTimeout(() => {
      skipToTimeline();
    }, 500);
  };
  
  const handleUncertaintyEscalation = (escalateId) => {
    if (escalateId === 'yes_connect') {
      addMessage('user', 'Yes, connect me with specialist');
      setTimeout(() => {
        addMessage('bot', "Perfect! I'll connect you with a Storflex specialist.\n\n📞 **Call now:** (800) 869-2040\n📧 **Email:** customerservice@storflex.com\n\nOr I can have someone reach out to you:", [
          { id: 'send_to_specialist', label: 'Have specialist contact me' },
          { id: 'call_instead', label: 'I\'ll call directly' }
        ]);
      }, 500);
    } else {
      addMessage('user', 'Continue with questions');
      setTimeout(() => {
        addMessage('bot', "No problem! Let's continue. What will you be displaying?", [
          { id: 'packaged', label: 'Packaged goods' },
          { id: 'bulk', label: 'Bulk items' },
          { id: 'mixed', label: 'Mix of products' }
        ]);
        // Reset uncertainty counter since they want to continue
        setConversationState(prev => ({ ...prev, uncertaintyCount: 0 }));
      }, 500);
    }
  };

  const handleTimeline = (timelineId) => {
    const labels = {
      'asap': 'ASAP / this month',
      'soon': '1-3 months',
      'planning': 'Just planning'
    };
    
    addMessage('user', labels[timelineId]);
    setConversationState(prev => ({ ...prev, timeline: timelineId }));
    
    setTimeout(() => {
      provideRecommendation();
    }, 800);
  };

  const provideRecommendation = () => {
    const { location, items, displayType, businessType } = conversationState;
    
    let primaryProducts = [];
    let whyFits = [];
    let catalogPages = '';
    let recommendationText = '';
    
    if (location === 'cooler' || location === 'freezer' || location === 'both_cf') {
      primaryProducts = [PRODUCT_CATALOG.cooler];
      whyFits = [
        'Specialized coating resists moisture and temperature extremes',
        'NSF certified for food service',
        'Corrosion-resistant construction',
        'Available in reach-in and walk-in configurations'
      ];
      catalogPages = 'Section 12, pages 12-1 to 12-4';
    }
    else if (location === 'endcaps' || displayType === 'standard_end' || displayType === 'promotional' || displayType === 'both_ends') {
      primaryProducts = [PRODUCT_CATALOG.endUnit];
      whyFits = [
        'Perfect for end-of-aisle promotional displays',
        'Increases product visibility and impulse sales',
        'Dual back paneling for complete end display',
        'Can be ordered fully assembled'
      ];
      catalogPages = 'Section 8, pages 8-1 to 8-6';
    }
    else if (location === 'corners') {
      if (displayType === 'inside_corner' || displayType === 'not_sure_corner') {
        primaryProducts = [PRODUCT_CATALOG.insideCorner];
        whyFits = [
          'Provides excellent merchandise transition',
          'Adds drama to troublesome corner areas',
          'Adjustable shelves for flexibility'
        ];
      } else if (displayType === 'box_corner') {
        primaryProducts = [PRODUCT_CATALOG.boxCorner];
        whyFits = [
          'Best method for eliminating dead space',
          'Creates elegant corner display solution',
          'Multiple assembly configurations available'
        ];
      }
      catalogPages = 'Section 9-10, pages 9-1 to 10-6';
    }
    else if (location === 'checkout') {
      if (displayType === 'counter_system' || displayType === 'both_checkout') {
        primaryProducts.push(PRODUCT_CATALOG.merchandisingCounter);
      }
      if (displayType === 'impulse_displays' || displayType === 'both_checkout') {
        primaryProducts.push(PRODUCT_CATALOG.fourSided);
      }
      whyFits = [
        'Increases impulse sales at checkout',
        'Combines wood countertops with gondola shelving',
        'Mobile displays perfect for seasonal products'
      ];
      catalogPages = 'Wood Displays section';
    }
    else if (businessType === 'pharmacy' || items === 'pharmacy_items') {
      primaryProducts = [PRODUCT_CATALOG.rxPharmacy, PRODUCT_CATALOG.gondola];
      whyFits = [
        'Specialized Rx Bay Units for pharmacy environments',
        'Secure display options for controlled substances',
        'Perfect for both OTC and prescription areas'
      ];
      catalogPages = 'Pharmacy Fixtures & Section 1-7';
    }
    else if (location === 'aisles' || location === 'multiple' || location === 'not_sure') {
      if (items === 'bulk') {
        primaryProducts = [PRODUCT_CATALOG.widespan];
        whyFits = [
          'Designed for heavier items and bulk storage',
          'Strong beam construction supports cases',
          'Ideal for warehouse-style retail'
        ];
        catalogPages = 'Section 11, pages 11-1 to 11-8';
      } else {
        primaryProducts = [PRODUCT_CATALOG.gondola];
        whyFits = [
          'Perfect for double-sided aisle displays',
          'Adjustable shelves accommodate various product sizes',
          'Industry standard with 24,000 inch-pound load rating'
        ];
        catalogPages = 'Section 1-7, pages 1-1 to 7-6';
        
        if (location === 'multiple') {
          primaryProducts.push(PRODUCT_CATALOG.wall);
        }
      }
    }
    else if (location === 'wall') {
      primaryProducts = [PRODUCT_CATALOG.wall];
      whyFits = [
        'Designed specifically for wall mounting',
        'Maximizes vertical space along perimeter',
        'Adjustable shelves for flexibility'
      ];
      catalogPages = 'Section 8-10, pages 8-1 to 10-6';
    }
    
    // Safety check - if no products matched, provide a default
    if (primaryProducts.length === 0) {
      primaryProducts = [PRODUCT_CATALOG.allProducts];
      whyFits = [
        'Let us help you find the perfect solution',
        'Wide variety of options available',
        'Factory-direct pricing and fast lead times'
      ];
      recommendationText = `Based on your needs, let me connect you with our product catalog:`;
    } else if (primaryProducts.length === 1) {
      recommendationText = `Based on your needs, I recommend:\n\n**${primaryProducts[0].name}**`;
    } else {
      recommendationText = `Based on your needs, I recommend these solutions:`;
    }
    
    if (catalogPages) {
      recommendationText += `\n\n📖 **Catalog Reference:** ${catalogPages}`;
    }
    
    // Pass whyFits as separate parameter for the "Why This Fits" card
    addMessage('bot', recommendationText, null, primaryProducts, whyFits);
    
    setTimeout(() => {
      addMessage('bot', "Would you like a detailed quote, or browse all our products?", [
        { id: 'yes', label: 'Yes, get me a quote' },
        { id: 'browse', label: 'Browse all products' },
        { id: 'no', label: 'Just call me' }
      ]);
    }, 1000);
  };

  const handleSupportRequest = (supportId) => {
    const responses = {
      assembly: {
        text: "I can help with assembly! What product do you need instructions for?",
        options: [
          { id: 'gondola_asm', label: 'Gondola shelving' },
          { id: 'wall_asm', label: 'Wall units' },
          { id: 'cooler_asm', label: 'Walk-in cooler/freezer' },
          { id: 'display_asm', label: 'Display fixtures' },
          { id: 'other_asm', label: 'Other product' }
        ]
      },
      parts: {
        text: "I can help you identify the right replacement parts.",
        options: [
          { id: 'have_part', label: 'I have a part number' },
          { id: 'describe', label: 'Need help identifying' },
          { id: 'photo', label: 'Can send a photo' }
        ]
      },
      identify: {
        text: "I'll help you identify the component! Please describe what you're looking at. For example:\n\n• What does it look like? (shelf, bracket, post, corner piece, etc.)\n• What part of the fixture is it on? (top, bottom, side, corner)\n• Any visible markings or features?\n\nJust type your description below.",
        options: null // Will use text input instead
      },
      troubleshoot: {
        text: "What issue are you experiencing?",
        options: [
          { id: 'stability', label: 'Stability/wobbling' },
          { id: 'assembly_issue', label: 'Assembly difficulty' },
          { id: 'damage', label: 'Damage or wear' },
          { id: 'other_issue', label: 'Other issue' }
        ]
      }
    };
    
    const response = responses[supportId];
    addMessage('user', supportId === 'assembly' ? 'Assembly instructions' : supportId === 'parts' ? 'Missing or replacement parts' : supportId === 'identify' ? 'Identify a component' : 'Troubleshooting');
    setConversationState(prev => ({ ...prev, supportType: supportId }));
    
    setTimeout(() => {
      addMessage('bot', response.text, response.options);
    }, 500);
  };

  // COMPREHENSIVE CATALOG-BASED COMPONENT IDENTIFICATION SYSTEM
  // Phase 1: Brackets & Shelves (Full Implementation with NLP)
  // Based on Storflex 14-section catalog structure
  const identifyComponent = (description) => {
    const desc = description.toLowerCase();
    
    // STEP 1: Extract contextual information from natural language
    const context = extractContextFromDescription(desc);
    
    // Detect primary component category
    const componentCategories = {
      bracket: ['bracket', 'arm', 'support', 'holder', 'clip', 'mount', 'cantilever', 'hang', 'attach'],
      shelf: ['shelf', 'shelve', 'shelving', 'deck', 'board', 'surface', 'decking', 'level', 'tier'],
      upright: ['upright', 'post', 'column', 'vertical', 'standard', 'frame', 'pole', 'tower'],
      base: ['base', 'foot', 'feet', 'bottom', 'shoe', 'leg', 'foundation'],
      panel: ['panel', 'back', 'backing', 'pegboard', 'slatwall', 'wire grid', 'backboard'],
      accessory: ['hook', 'peg', 'divider', 'fence', 'basket', 'bin', 'sign holder', 'price', 'retainer'],
      cooler: ['cooler', 'freezer', 'walk-in', 'walk in', 'refrigerat', 'cold storage', 'camlock', 'cam lock'],
      corner: ['corner', 'angle', 'radius', 'turn', 'l-shape', 'box corner'],
      canopy: ['canopy', 'fascia', 'gondola guard', 'valance', 'header'],
      pharmacy: ['pharmacy', 'rx', 'prescription', 'pharmacist', 'pharma'],
      mobile: ['mobile', 'caster', 'wheel', 'rolling', 'portable', 'four-sided', 'four sided'],
      specialty: ['kickplate', 'kick plate', 'spreader', 'top cap', 'end cap', 'closer'],
      other: []
    };
    
    let detectedCategory = null;
    
    for (const [category, keywords] of Object.entries(componentCategories)) {
      if (keywords.some(keyword => desc.includes(keyword))) {
        detectedCategory = category;
        break;
      }
    }
    
    // If category detected and we have enough context, provide smart identification
    if (detectedCategory && (context.systemType || context.material || context.depth || context.height)) {
      provideSmartIdentification(detectedCategory, context);
      return;
    }
    
    // If no category detected, ask user
    if (!detectedCategory) {
      addMessage('bot', "I'd like to help identify that component! What general type is it?", [
        { id: 'cat_bracket', label: 'Bracket/Mount' },
        { id: 'cat_shelf', label: 'Shelf/Deck' },
        { id: 'cat_upright', label: 'Upright/Post' },
        { id: 'cat_base', label: 'Base/Foot' },
        { id: 'cat_panel', label: 'Panel/Backing' },
        { id: 'cat_accessory', label: 'Accessory' },
        { id: 'cat_other', label: 'Something else' }
      ]);
      return;
    }
    
    // Start progressive clarification based on category
    setConversationState(prev => ({ 
      ...prev, 
      identifyCategory: detectedCategory,
      identifyDetails: { originalDescription: description, context }
    }));
    
    startProgressiveClarification(detectedCategory);
  };
  
  // Extract context clues from natural language description
  const extractContextFromDescription = (desc) => {
    const context = {};
    
    // SYSTEM TYPE detection
    if (desc.includes('gondola') || desc.includes('center aisle') || desc.includes('double sided') || desc.includes('middle of store')) {
      context.systemType = 'gondola';
    } else if (desc.includes('wall') || desc.includes('perimeter') || desc.includes('against wall') || desc.includes('wall mount')) {
      context.systemType = 'wall';
    } else if (desc.includes('widespan') || desc.includes('heavy duty') || desc.includes('warehouse') || desc.includes('bulk storage')) {
      context.systemType = 'widespan';
    } else if (desc.includes('clearspan') || desc.includes('backroom') || desc.includes('particle board')) {
      context.systemType = 'clearspan';
    } else if (desc.includes('end cap') || desc.includes('endcap') || desc.includes('end of aisle') || desc.includes('aisle end')) {
      context.systemType = 'endcap';
    } else if (desc.includes('canopy') || desc.includes('sign') || desc.includes('header') || desc.includes('fascia')) {
      context.systemType = 'canopy';
    } else if (desc.includes('pharmacy') || desc.includes('rx') || desc.includes('prescription')) {
      context.systemType = 'pharmacy';
    }
    
    // MATERIAL detection
    if (desc.includes('steel') || desc.includes('metal')) {
      context.material = 'steel';
    } else if (desc.includes('wire') || desc.includes('mesh') || desc.includes('grid')) {
      context.material = 'wire';
    } else if (desc.includes('wood') || desc.includes('wooden')) {
      context.material = 'wood';
    } else if (desc.includes('particle') || desc.includes('pressboard') || desc.includes('chipboard')) {
      context.material = 'particle';
    } else if (desc.includes('glass')) {
      context.material = 'glass';
    } else if (desc.includes('melamine') || desc.includes('laminate')) {
      context.material = 'melamine';
    }
    
    // PANEL TYPE detection (for back panels)
    if (desc.includes('pegboard') || desc.includes('peg board') || desc.includes('holes')) {
      context.panelType = 'pegboard';
    } else if (desc.includes('slatwall') || desc.includes('slat wall') || desc.includes('grooves') || desc.includes('slots')) {
      context.panelType = 'slatwall';
    } else if (desc.includes('wire grid') || desc.includes('wire back') || desc.includes('mesh back')) {
      context.panelType = 'wiregrid';
    } else if (desc.includes('solid') || desc.includes('flat') || desc.includes('plain')) {
      context.panelType = 'solid';
    }
    
    // ACCESSORY TYPE detection
    if (desc.includes('hook') || desc.includes('peg') || desc.includes('hanger')) {
      context.accessoryType = 'hook';
    } else if (desc.includes('divider') || desc.includes('fence') || desc.includes('separator')) {
      context.accessoryType = 'divider';
    } else if (desc.includes('basket') || desc.includes('bin') || desc.includes('container')) {
      context.accessoryType = 'basket';
    } else if (desc.includes('sign holder') || desc.includes('sign') || desc.includes('label')) {
      context.accessoryType = 'sign';
    } else if (desc.includes('price') || desc.includes('tag')) {
      context.accessoryType = 'price';
    }
    
    // COOLER/FREEZER TYPE detection
    if (desc.includes('wall panel') || desc.includes('wall section')) {
      context.coolerType = 'wall_panel';
    } else if (desc.includes('ceiling panel') || desc.includes('ceiling section') || desc.includes('roof panel')) {
      context.coolerType = 'ceiling_panel';
    } else if (desc.includes('floor') || desc.includes('flooring')) {
      context.coolerType = 'floor';
    } else if (desc.includes('door') || desc.includes('entry')) {
      context.coolerType = 'door';
    } else if (desc.includes('camlock') || desc.includes('cam lock') || desc.includes('fastener')) {
      context.coolerType = 'camlock';
    } else if (desc.includes('seal') || desc.includes('gasket') || desc.includes('weatherstrip')) {
      context.coolerType = 'seal';
    } else if (desc.includes('ceiling support') || desc.includes('beam') || desc.includes('hanger')) {
      context.coolerType = 'ceiling_support';
    }
    
    // CORNER TYPE detection
    if (desc.includes('inside corner') || desc.includes('90 degree') || desc.includes('l-shaped')) {
      context.cornerType = 'inside';
    } else if (desc.includes('box corner') || desc.includes('enclosed')) {
      context.cornerType = 'box';
    } else if (desc.includes('radius') || desc.includes('curved') || desc.includes('round')) {
      context.cornerType = 'radius';
    } else if (desc.includes('half radius')) {
      context.cornerType = 'half_radius';
    }
    
    // CANOPY TYPE detection
    if (desc.includes('gondola guard') || desc.includes('guard system')) {
      context.canopyType = 'guard';
    } else if (desc.includes('insert') || desc.includes('trim')) {
      context.canopyType = 'insert';
    } else if (desc.includes('fascia support') || desc.includes('fascia bracket')) {
      context.canopyType = 'fascia_support';
    }
    
    // SPECIALTY ITEM detection
    if (desc.includes('kickplate') || desc.includes('kick plate')) {
      context.specialtyType = 'kickplate';
    } else if (desc.includes('top cap')) {
      context.specialtyType = 'top_cap';
    } else if (desc.includes('post end cap')) {
      context.specialtyType = 'post_end_cap';
    } else if (desc.includes('spreader') || desc.includes('cross bar')) {
      context.specialtyType = 'spreader';
    }
    
    // BASE TYPE detection
    if (desc.includes('shoe') || desc.includes('feet') || desc.includes('foot')) {
      context.baseType = 'shoe';
    } else if (desc.includes('leveling') || desc.includes('adjustable')) {
      context.baseType = 'leveling';
    } else if (desc.includes('t-leg') || desc.includes('t leg') || desc.includes('tleg')) {
      context.baseType = 'tleg';
    } else if (desc.includes('mobile') || desc.includes('caster') || desc.includes('wheel') || desc.includes('rolling')) {
      context.baseType = 'mobile';
    }
    
    // UPRIGHT CONFIGURATION detection
    if (desc.includes('double sided') || desc.includes('double-sided') || desc.includes('both sides')) {
      context.uprightConfig = 'double';
    } else if (desc.includes('single sided') || desc.includes('single-sided') || desc.includes('one side')) {
      context.uprightConfig = 'single';
    } else if (desc.includes('welded')) {
      context.uprightConfig = 'welded';
    }
    
    // DEPTH detection (inches) - look for common patterns
    const depthPatterns = [
      { pattern: /(\d+)\s*(?:inch|in|"|')\s*(?:deep|depth)/i, multiplier: 1 },
      { pattern: /(\d+)(?:"|''|in)\s*(?:deep|depth)?/i, multiplier: 1 },
      { pattern: /(\d+)\s*(?:foot|ft|feet)\s*(?:deep|depth)/i, multiplier: 12 },
      { pattern: /twelve\s*(?:inch)/i, value: 12 },
      { pattern: /sixteen\s*(?:inch)/i, value: 16 },
      { pattern: /eighteen\s*(?:inch)/i, value: 18 },
      { pattern: /twenty.?four\s*(?:inch)/i, value: 24 }
    ];
    
    for (const { pattern, multiplier, value } of depthPatterns) {
      const match = desc.match(pattern);
      if (match) {
        context.depth = value || parseInt(match[1]) * (multiplier || 1);
        break;
      }
    }
    
    // Common depth keywords
    if (!context.depth) {
      if (desc.includes('12') || desc.includes('twelve')) context.depth = 12;
      else if (desc.includes('16') || desc.includes('sixteen')) context.depth = 16;
      else if (desc.includes('18') || desc.includes('eighteen')) context.depth = 18;
      else if (desc.includes('24') || desc.includes('twenty-four') || desc.includes('two feet')) context.depth = 24;
    }
    
    // HEIGHT detection (for uprights)
    const heightPatterns = [
      { pattern: /(\d+)\s*(?:inch|in|"|')\s*(?:tall|high|height)/i, multiplier: 1 },
      { pattern: /(\d+)(?:"|''|in)\s*(?:tall|high)?/i, multiplier: 1 },
      { pattern: /(\d+)\s*(?:foot|ft|feet)\s*(?:tall|high)/i, multiplier: 12 }
    ];
    
    for (const { pattern, multiplier } of heightPatterns) {
      const match = desc.match(pattern);
      if (match) {
        context.height = parseInt(match[1]) * (multiplier || 1);
        break;
      }
    }
    
    // Common upright heights
    if (!context.height && (desc.includes('upright') || desc.includes('post') || desc.includes('standard'))) {
      if (desc.includes('48') || desc.includes('four feet')) context.height = 48;
      else if (desc.includes('54')) context.height = 54;
      else if (desc.includes('60') || desc.includes('five feet')) context.height = 60;
      else if (desc.includes('72') || desc.includes('six feet')) context.height = 72;
      else if (desc.includes('84') || desc.includes('seven feet')) context.height = 84;
      else if (desc.includes('96') || desc.includes('eight feet')) context.height = 96;
    }
    
    // DESCRIPTIVE TERMS
    if (desc.includes('adjustable') || desc.includes('movable') || desc.includes('adjust')) {
      context.adjustable = true;
    }
    if (desc.includes('heavy duty') || desc.includes('reinforced') || desc.includes('strong')) {
      context.heavyDuty = true;
    }
    if (desc.includes('chrome') || desc.includes('silver') || desc.includes('stainless')) {
      context.finish = 'chrome';
    }
    if (desc.includes('black') || desc.includes('dark')) {
      context.finish = 'black';
    }
    if (desc.includes('white') || desc.includes('light')) {
      context.finish = 'white';
    }
    
    // LOCATION/POSITION terms
    if (desc.includes('front') || desc.includes('facing')) {
      context.position = 'front';
    }
    if (desc.includes('back') || desc.includes('rear')) {
      context.position = 'back';
    }
    if (desc.includes('top') || desc.includes('upper')) {
      context.position = 'top';
    }
    if (desc.includes('bottom') || desc.includes('lower') || desc.includes('floor')) {
      context.position = 'bottom';
    }
    
    return context;
  };
  
  // Provide smart identification based on extracted context
  const provideSmartIdentification = (category, context) => {
    if (category === 'bracket') {
      let componentName = 'Bracket';
      let details = '';
      let catalogRef = '';
      let products = [];
      
      // Determine specific bracket type from context
      if (context.systemType === 'gondola') {
        if (context.material === 'steel' && context.depth) {
          componentName = `Gondola Steel Deck Bracket - ${context.depth}"`;
          details = `Standard gondola bracket for ${context.depth}" steel deck shelves. Locks into upright slots on 1" centers. Features front lip for shelf retention. Load capacity: 24,000 inch-pounds.`;
          catalogRef = 'Section 5: Gondola Accessories';
          products = ['gondola', 'gondolaAccessories'];
        } else if (context.material === 'wire') {
          componentName = 'Gondola Wire Shelf Brackets';
          details = 'Brackets designed specifically for wire shelving on gondola systems. Feature hooks or clips to secure wire decking.';
          catalogRef = 'Section 5: Gondola Accessories';
          products = ['gondola', 'gondolaAccessories'];
        } else if (context.material === 'wood') {
          componentName = 'Wood Shelf Brackets (Gondola)';
          details = 'Specialized brackets for wood shelving on gondola systems. Provide sturdy support for wood decking.';
          catalogRef = 'Section 5: Gondola Accessories';
          products = ['gondola', 'woodDisplays'];
        } else {
          componentName = 'Gondola Shelf Brackets';
          details = 'Standard gondola brackets that lock into upright slots on 1" centers. Available in various depths (12", 16", 18", 24") and styles for different shelf types.';
          catalogRef = 'Section 5: Gondola Accessories';
          products = ['gondola', 'gondolaAccessories'];
        }
      } else if (context.systemType === 'wall') {
        componentName = `Wall Mount Brackets${context.depth ? ` - ${context.depth}"` : ''}`;
        details = `Wall-mounted brackets attach to standards. Available in multiple depths${context.depth ? ` including ${context.depth}"` : ' (12", 14", 16", 18", 24")'} to match shelf size.`;
        catalogRef = 'Section 8-10: Wall Unit Components';
        products = ['wall'];
      } else if (context.systemType === 'canopy') {
        componentName = 'Canopy Brackets';
        details = 'Brackets for supporting canopy signage and fascia panels. Available in gondola mount, wall mount, floor mount, and telescoping configurations.';
        catalogRef = 'Section 5: Canopy Systems';
        products = ['gondola', 'gondolaAccessories'];
      } else if (context.systemType === 'widespan' || context.heavyDuty) {
        componentName = 'Widespan Brackets/Beams';
        details = 'Heavy-duty beam brackets designed for widespan systems. These support high-capacity shelving (up to 2,000 lbs per level) and attach to widespan uprights.';
        catalogRef = 'Section 11: Widespan Shelving';
        products = ['widespan'];
      } else {
        // Not enough context, ask for system type
        setConversationState(prev => ({ 
          ...prev, 
          identifyCategory: category,
          identifyDetails: { originalDescription: '', context }
        }));
        startProgressiveClarification(category);
        return;
      }
      
      provideIdentificationResult(componentName, details, catalogRef, products);
      
    } else if (category === 'shelf') {
      let componentName = 'Shelf';
      let details = '';
      let catalogRef = '';
      let products = [];
      
      // Determine specific shelf type from context
      if (context.systemType === 'gondola') {
        if (context.material === 'steel' && context.depth) {
          componentName = `Gondola Steel Deck Shelf - ${context.depth}"`;
          details = `Steel deck shelving for gondola systems in ${context.depth}" depth. Heavy-duty construction with 24,000 inch-pound load rating. Available in various lengths and finishes.`;
          catalogRef = 'Section 6: Gondola Shelf Options';
          products = ['gondola'];
        } else if (context.material === 'wire') {
          componentName = 'Gondola Wire Shelves';
          details = 'Wire deck shelving for gondola systems. Allows visibility and air circulation. Common in cooler applications and bulk merchandise.';
          catalogRef = 'Section 6: Gondola Shelf Options';
          products = ['gondola', 'gondolaAccessories'];
        } else if (context.material === 'wood') {
          componentName = 'Wood Shelves (Gondola)';
          details = 'Wood shelving for gondola systems. Premium appearance for specialty retail. Available in various finishes.';
          catalogRef = 'Section 6: Gondola Shelf Options';
          products = ['gondola', 'woodDisplays'];
        } else {
          componentName = 'Gondola Shelves';
          details = 'Gondola shelving available in multiple materials: steel deck, wire, wood, particle board, and glass. Various depths from 12" to 24".';
          catalogRef = 'Section 6: Gondola Shelf Options';
          products = ['gondola'];
        }
      } else if (context.systemType === 'wall') {
        componentName = `Wall Unit Shelves${context.material ? ` - ${context.material}` : ''}`;
        details = `Wall-mounted shelving${context.material ? ` in ${context.material}` : ''}. Available in multiple depths to match your display needs.`;
        catalogRef = 'Section 8-10: Wall Unit Components';
        products = ['wall'];
      } else if (context.systemType === 'widespan' || context.heavyDuty) {
        componentName = 'Widespan Shelves (Heavy Duty)';
        details = 'Heavy-duty steel decking with wire reinforcement for bulk storage. Supports up to 2,000 lbs per level. Ideal for warehouse and backroom applications.';
        catalogRef = 'Section 11: Widespan Shelving';
        products = ['widespan'];
      } else if (context.systemType === 'clearspan') {
        componentName = 'Clearspan Shelves';
        details = 'Particle board shelving designed for warehouse and backroom storage. Economical solution for non-display storage needs.';
        catalogRef = 'Section 12: Clearspan Shelving';
        products = ['clearspan'];
      } else {
        // Not enough context, ask for system type
        setConversationState(prev => ({ 
          ...prev, 
          identifyCategory: category,
          identifyDetails: { originalDescription: '', context }
        }));
        startProgressiveClarification(category);
        return;
      }
      
      provideIdentificationResult(componentName, details, catalogRef, products);
      
    } else if (category === 'upright') {
      let componentName = 'Upright/Standard';
      let details = '';
      let catalogRef = '';
      let products = [];
      
      if (context.systemType === 'gondola') {
        const config = context.uprightConfig === 'double' ? 'Double-Sided' : 
                      context.uprightConfig === 'single' ? 'Single-Sided' : '';
        const heightText = context.height ? ` - ${context.height}"` : '';
        
        componentName = `Gondola ${config} Upright${heightText}`.trim();
        details = `Gondola upright${config ? ` (${config.toLowerCase()})` : ''} with slots on 1" centers for adjustable shelf brackets${context.height ? `. Height: ${context.height}"` : ''}. Available heights: 54", 60", 72", 84".`;
        catalogRef = 'Section 2-3: Gondola Shelving';
        products = ['gondola'];
      } else if (context.systemType === 'wall') {
        const heightText = context.height ? ` - ${context.height}"` : '';
        componentName = `Wall Standard${heightText}`;
        details = `Wall-mounted upright standard${context.height ? ` in ${context.height}" height` : ''}. Slots on 1" centers for bracket adjustment. Common heights: 48", 60", 72", 84", 96".`;
        catalogRef = 'Section 8-10: Wall Unit Components';
        products = ['wall'];
      } else if (context.systemType === 'widespan' || context.heavyDuty) {
        componentName = 'Widespan Uprights';
        details = 'Heavy-duty upright frames for widespan systems. Available in welded or bolted configurations. Heights typically 72" to 144" for warehouse applications.';
        catalogRef = 'Section 11: Widespan Shelving';
        products = ['widespan'];
      } else if (context.systemType === 'clearspan') {
        componentName = 'Clearspan Uprights';
        details = 'Upright frames for clearspan shelving. Available in double-sided (freestanding) or wall-mount configurations.';
        catalogRef = 'Section 12: Clearspan Shelving';
        products = ['clearspan'];
      } else {
        // Ask for system type
        setConversationState(prev => ({ 
          ...prev, 
          identifyCategory: category,
          identifyDetails: { originalDescription: '', context }
        }));
        startProgressiveClarification(category);
        return;
      }
      
      provideIdentificationResult(componentName, details, catalogRef, products);
      
    } else if (category === 'base') {
      let componentName = 'Base Component';
      let details = '';
      let catalogRef = '';
      let products = [];
      
      if (context.baseType === 'shoe') {
        componentName = 'Base Shoes/Feet';
        details = 'Base shoes connect to the bottom of uprights and provide stability. Most include leveling screws for floor adjustment.';
        catalogRef = 'Section 4: Gondola Unit Parts';
        products = ['gondola'];
      } else if (context.baseType === 'mobile') {
        componentName = 'Mobile Base / Casters';
        details = 'Mobile base system with heavy-duty casters for movable fixtures. Includes locking wheels for secure positioning.';
        catalogRef = 'Gondola Accessories - Mobile Bases';
        products = ['gondola', 'gondolaAccessories'];
      } else if (context.baseType === 'tleg') {
        componentName = 'T-Leg Base (Widespan)';
        details = 'T-leg base supports for widespan heavy-duty shelving. Provides stable foundation for high-capacity systems.';
        catalogRef = 'Section 11: Widespan Components';
        products = ['widespan'];
      } else {
        componentName = 'Base Components';
        details = 'Base components include base shoes, end closers, leveling feet, and specialty bases for different fixture types.';
        catalogRef = 'Section 4: Gondola Unit Parts';
        products = ['gondola'];
      }
      
      provideIdentificationResult(componentName, details, catalogRef, products);
      
    } else if (category === 'panel') {
      let componentName = 'Back Panel';
      let details = '';
      let catalogRef = '';
      let products = [];
      
      if (context.panelType === 'pegboard') {
        componentName = 'Pegboard Back Panel';
        details = 'Pegboard panels with evenly-spaced holes for hanging merchandise with hooks and pegs. Standard perforation pattern compatible with all pegboard accessories.';
        catalogRef = 'Section 3: Back Panel Options';
        products = ['gondola', 'wall', 'gondolaAccessories'];
      } else if (context.panelType === 'slatwall') {
        componentName = 'Slatwall Back Panel';
        details = 'Slatwall panels with horizontal grooves for maximum merchandising flexibility. Compatible with wide range of slatwall accessories.';
        catalogRef = 'Section 3: Back Panel Options';
        products = ['gondola', 'wall', 'gondolaAccessories'];
      } else if (context.panelType === 'wiregrid') {
        componentName = 'Wire Grid Back Panel';
        details = 'Wire grid panels provide open visibility while supporting hanging merchandise. Durable welded wire construction.';
        catalogRef = 'Section 3: Back Panel Options';
        products = ['gondola', 'wall', 'gondolaAccessories'];
      } else if (context.panelType === 'solid') {
        componentName = 'Solid Back Panel';
        details = 'Solid panel boards provide clean backdrop for merchandise. Available in various materials and finishes.';
        catalogRef = 'Section 3: Back Panel Options';
        products = ['gondola', 'wall'];
      } else {
        componentName = 'Back Panels';
        details = 'Back panels available in pegboard, slatwall, wire grid, and solid options. Each type accommodates different merchandising accessories.';
        catalogRef = 'Section 3: Back Panel Options';
        products = ['gondola', 'wall'];
      }
      
      provideIdentificationResult(componentName, details, catalogRef, products);
      
    } else if (category === 'accessory') {
      let componentName = 'Accessory';
      let details = '';
      let catalogRef = '';
      let products = [];
      
      if (context.accessoryType === 'hook') {
        componentName = 'Hooks & Pegs';
        details = 'Merchandise hooks and pegs for pegboard or slatwall. Available in various lengths, finishes, and configurations (single, double, waterfall).';
        catalogRef = 'Section 7-8: Merchandising Accessories';
        products = ['gondolaAccessories'];
      } else if (context.accessoryType === 'divider') {
        componentName = 'Shelf Dividers / Fences';
        details = 'Wire or solid dividers that attach to shelves to separate products and prevent items from falling. Adjustable positioning.';
        catalogRef = 'Section 7: Shelf Accessories';
        products = ['gondolaAccessories'];
      } else if (context.accessoryType === 'basket') {
        componentName = 'Wire Baskets & Bins';
        details = 'Wire or plastic baskets for bulk merchandise display. Attach to shelving or pegboard. Various sizes available.';
        catalogRef = 'Section 8: Merchandising Aids';
        products = ['gondolaAccessories'];
      } else if (context.accessoryType === 'sign') {
        componentName = 'Sign Holders';
        details = 'Sign holders and label holders for shelf edge pricing and product information. Multiple mounting options.';
        catalogRef = 'Section 8: Merchandising Aids';
        products = ['gondolaAccessories'];
      } else if (context.accessoryType === 'price') {
        componentName = 'Price Channels / Tag Holders';
        details = 'Price molding and tag holders that attach to shelf front for pricing labels and product tags.';
        catalogRef = 'Section 7: Shelf Accessories';
        products = ['gondolaAccessories'];
      } else {
        componentName = 'Merchandising Accessories';
        details = 'Wide range of accessories including hooks, dividers, baskets, sign holders, and price channels to enhance product display.';
        catalogRef = 'Sections 7-8: Accessories & Merchandising Aids';
        products = ['gondolaAccessories'];
      }
      
      provideIdentificationResult(componentName, details, catalogRef, products);
    }
    
    // PHASE 3B CATEGORIES
    else if (category === 'cooler') {
      let componentName = 'Walk-In Cooler/Freezer Component';
      let details = '';
      let catalogRef = '';
      let products = [];
      
      if (context.coolerType === 'wall_panel') {
        componentName = 'Walk-In Cooler/Freezer Wall Panel';
        details = 'Insulated wall panels that lock together with cam-lock system. Standard 4" thickness with foamed-in-place polyurethane insulation. Available in various heights and widths.';
        catalogRef = 'Section 14: Walk-In Coolers & Freezers';
        products = ['cooler'];
      } else if (context.coolerType === 'ceiling_panel') {
        componentName = 'Walk-In Cooler/Freezer Ceiling Panel';
        details = 'Insulated ceiling panels with cam-lock connections. Designed to interlock with wall panels for complete seal. Supports require proper spacing for units over 16\'x16\'.';
        catalogRef = 'Section 14: Walk-In Coolers & Freezers';
        products = ['cooler'];
      } else if (context.coolerType === 'floor') {
        componentName = 'Walk-In Cooler/Freezer Floor';
        details = 'Insulated floor sections for walk-in units. Essential for freezer applications. Non-slip surface options available.';
        catalogRef = 'Section 14: Walk-In Coolers & Freezers';
        products = ['cooler'];
      } else if (context.coolerType === 'door') {
        componentName = 'Walk-In Cooler/Freezer Door';
        details = 'Pre-hung insulated doors with heavy-duty hinges and latch systems. Includes safety release from inside. Various sizes available.';
        catalogRef = 'Section 14: Walk-In Coolers & Freezers';
        products = ['cooler'];
      } else if (context.coolerType === 'camlock') {
        componentName = 'Cam-Locks (Walk-In Fasteners)';
        details = 'Cam-lock fasteners that connect panels together. Create tight seal between wall and ceiling panels. Essential for proper assembly.';
        catalogRef = 'Section 14: Walk-In Coolers & Freezers - Assembly';
        products = ['cooler'];
      } else if (context.coolerType === 'seal') {
        componentName = 'Door Seals/Gaskets';
        details = 'Replacement seals and gaskets for walk-in doors. Maintain temperature efficiency and prevent air leakage.';
        catalogRef = 'Section 14: Walk-In Coolers & Freezers - Parts';
        products = ['cooler'];
      } else if (context.coolerType === 'ceiling_support') {
        componentName = 'Ceiling Supports (C-Beam/I-Beam/Hangers)';
        details = 'Ceiling support beams and hangers for units over 16\'x16\'. C-beam or I-beam rests on wall top. Ceiling hangers suspend from building structure using threaded rods.';
        catalogRef = 'Section 14: Walk-In Coolers & Freezers - Installation';
        products = ['cooler'];
      } else {
        // General cooler/freezer - needs clarification
        setConversationState(prev => ({ 
          ...prev, 
          identifyCategory: category,
          identifyDetails: { originalDescription: '', context }
        }));
        startProgressiveClarification(category);
        return;
      }
      
      provideIdentificationResult(componentName, details, catalogRef, products);
      
    } else if (category === 'corner') {
      let componentName = 'Corner Unit';
      let details = '';
      let catalogRef = '';
      let products = [];
      
      if (context.cornerType === 'inside') {
        componentName = 'Inside Corner Shelving (90°)';
        details = 'Inside corner units designed to utilize 90-degree corner spaces. Maximizes corner merchandising in L-shaped layouts. Integrates with gondola runs.';
        catalogRef = 'Corner Solutions';
        products = ['insideCorner'];
      } else if (context.cornerType === 'box') {
        componentName = 'Box Corner Shelving';
        details = 'Enclosed box corner units for corner merchandising. Four-sided display capability. Creates focal point at store corners.';
        catalogRef = 'Corner Solutions';
        products = ['boxCorner'];
      } else if (context.cornerType === 'radius') {
        componentName = 'Radius Corner (Z-Line)';
        details = 'Curved radius corner for smooth gondola transitions. Premium appearance with no sharp edges. Part of Z-Line gondola system.';
        catalogRef = 'Section 3: Gondola Options - Z-Line Radius Corner';
        products = ['gondola'];
      } else if (context.cornerType === 'half_radius') {
        componentName = 'Half Radius Corner (Z-Line)';
        details = 'Half-radius curved corner for tighter spaces. Provides smooth transition with smaller footprint than full radius.';
        catalogRef = 'Section 3: Gondola Options - Z-Line Half Radius';
        products = ['gondola'];
      } else {
        setConversationState(prev => ({ 
          ...prev, 
          identifyCategory: category,
          identifyDetails: { originalDescription: '', context }
        }));
        startProgressiveClarification(category);
        return;
      }
      
      provideIdentificationResult(componentName, details, catalogRef, products);
      
    } else if (category === 'canopy') {
      let componentName = 'Canopy System Component';
      let details = '';
      let catalogRef = '';
      let products = [];
      
      if (context.canopyType === 'guard') {
        componentName = 'Gondola Guard System';
        details = 'Protective canopy system that runs along the top of gondola. Provides professional finished appearance and can support signage. Available with various insert options.';
        catalogRef = 'Section 3: Gondola Options - Gondola Guard System';
        products = ['gondola', 'gondolaAccessories'];
      } else if (context.canopyType === 'insert') {
        componentName = 'Gondola Guard Insert/Trim';
        details = 'Decorative inserts for gondola guard system. Options include stainless steel, colored inserts, and custom trim. Enhances visual appeal.';
        catalogRef = 'Section 3: Gondola Options - Guard Insert Trim';
        products = ['gondola', 'gondolaAccessories'];
      } else if (context.canopyType === 'fascia_support') {
        componentName = 'Fascia Support Bracket (Shelf Mount)';
        details = 'Bracket that mounts to shelf to support fascia panels and signage. Adjustable height for flexible sign positioning.';
        catalogRef = 'Section 5: Gondola Accessories - Canopy Brackets';
        products = ['gondolaAccessories'];
      } else {
        setConversationState(prev => ({ 
          ...prev, 
          identifyCategory: category,
          identifyDetails: { originalDescription: '', context }
        }));
        startProgressiveClarification(category);
        return;
      }
      
      provideIdentificationResult(componentName, details, catalogRef, products);
      
    } else if (category === 'pharmacy') {
      componentName = 'Pharmacy Fixtures';
      details = 'Specialized pharmacy fixtures including Rx bay units for prescription storage, pharmacy counters, and secure displays for controlled substances. Designed specifically for pharmacy environments with compliance in mind.';
      catalogRef = 'Section 13: RX Pharmacy Displays';
      products = ['rxPharmacy'];
      
      provideIdentificationResult(componentName, details, catalogRef, products);
      
    } else if (category === 'mobile') {
      let componentName = 'Mobile Display';
      let details = '';
      let catalogRef = '';
      let products = [];
      
      if (desc.includes('four-sided') || desc.includes('four sided')) {
        componentName = 'Four-Sided Displayer';
        details = 'Mobile four-sided display unit with casters. Perfect for impulse merchandise and promotional displays. Can be positioned anywhere in store. Lockable wheels for stability.';
        catalogRef = 'Four-Sided Displayers';
        products = ['fourSided'];
      } else {
        componentName = 'Mobile Base System';
        details = 'Mobile base with heavy-duty casters for movable gondola fixtures. Includes locking wheels for secure positioning. Allows flexible store layouts.';
        catalogRef = 'Gondola Accessories - Mobile Bases';
        products = ['gondola', 'gondolaAccessories'];
      }
      
      provideIdentificationResult(componentName, details, catalogRef, products);
      
    } else if (category === 'specialty') {
      let componentName = 'Specialty Component';
      let details = '';
      let catalogRef = '';
      let products = [];
      
      if (context.specialtyType === 'kickplate') {
        componentName = 'Kickplate';
        details = 'Kickplates run along the bottom of gondola sections to protect the base and provide a finished look. Available in various lengths to match section sizes.';
        catalogRef = 'Section 4: Gondola Unit Parts';
        products = ['gondola'];
      } else if (context.specialtyType === 'top_cap') {
        componentName = 'Top Cap';
        details = 'Top caps finish the top of gondola uprights. Provides clean appearance and protects upright tops. Snap-on installation.';
        catalogRef = 'Section 4: Gondola Unit Parts';
        products = ['gondola'];
      } else if (context.specialtyType === 'post_end_cap') {
        componentName = 'Post End Caps';
        details = 'End caps that finish the ends of gondola posts/uprights. Sold in pairs. Creates professional finished appearance.';
        catalogRef = 'Section 4: Gondola Unit Parts';
        products = ['gondola'];
      } else if (context.specialtyType === 'spreader') {
        componentName = 'Bottom Spreader';
        details = 'Bottom spreader bars connect between uprights at the base level to provide structural rigidity and stability.';
        catalogRef = 'Section 4: Gondola Unit Parts';
        products = ['gondola'];
      } else {
        setConversationState(prev => ({ 
          ...prev, 
          identifyCategory: category,
          identifyDetails: { originalDescription: '', context }
        }));
        startProgressiveClarification(category);
        return;
      }
      
      provideIdentificationResult(componentName, details, catalogRef, products);
    }
  };
  
  // Start progressive clarification flow
  const startProgressiveClarification = (category) => {
    switch(category) {
      case 'bracket':
        addMessage('bot', "I can help identify that bracket! **What type of shelving system** is it for?", [
          { id: 'sys_gondola', label: 'Gondola (center aisle)' },
          { id: 'sys_wall', label: 'Wall unit' },
          { id: 'sys_widespan', label: 'Widespan (heavy duty)' },
          { id: 'sys_clearspan', label: 'Clearspan (warehouse)' },
          { id: 'sys_endcap', label: 'End cap/End unit' },
          { id: 'sys_canopy', label: 'Canopy/Sign system' },
          { id: 'sys_unsure', label: 'Not sure' }
        ]);
        break;
        
      case 'shelf':
        addMessage('bot', "I can help identify that shelf! **What type of shelving system** is it for?", [
          { id: 'sys_gondola', label: 'Gondola (center aisle)' },
          { id: 'sys_wall', label: 'Wall unit' },
          { id: 'sys_widespan', label: 'Widespan (heavy duty)' },
          { id: 'sys_clearspan', label: 'Clearspan (warehouse)' },
          { id: 'sys_pharmacy', label: 'Pharmacy display' },
          { id: 'sys_unsure', label: 'Not sure' }
        ]);
        break;
        
      case 'upright':
        addMessage('bot', "I can help identify that upright/post! **What type of shelving system** is it for?", [
          { id: 'sys_gondola', label: 'Gondola (center aisle)' },
          { id: 'sys_wall', label: 'Wall unit' },
          { id: 'sys_widespan', label: 'Widespan (heavy duty)' },
          { id: 'sys_clearspan', label: 'Clearspan (warehouse)' },
          { id: 'sys_unsure', label: 'Not sure' }
        ]);
        break;
        
      case 'base':
        addMessage('bot', "I can help identify that base component! **What type is it?**", [
          { id: 'base_shoe', label: 'Base shoe/foot' },
          { id: 'base_closer', label: 'Base end closer' },
          { id: 'base_spreader', label: 'Bottom spreader' },
          { id: 'base_kickplate', label: 'Kickplate' },
          { id: 'base_tleg', label: 'T-leg (widespan)' },
          { id: 'base_mobile', label: 'Mobile/caster base' },
          { id: 'base_unsure', label: 'Not sure' }
        ]);
        break;
        
      case 'panel':
        addMessage('bot', "I can help identify that panel! **What type is it?**", [
          { id: 'panel_pegboard', label: 'Pegboard (holes)' },
          { id: 'panel_slatwall', label: 'Slatwall (grooves)' },
          { id: 'panel_wiregrid', label: 'Wire grid' },
          { id: 'panel_solid', label: 'Solid/flat panel' },
          { id: 'panel_end', label: 'End panel' },
          { id: 'panel_unsure', label: 'Not sure' }
        ]);
        break;
        
      case 'accessory':
        addMessage('bot', "I can help identify that accessory! **What type is it?**", [
          { id: 'acc_hook', label: 'Hook or peg' },
          { id: 'acc_divider', label: 'Divider or fence' },
          { id: 'acc_basket', label: 'Basket or bin' },
          { id: 'acc_sign', label: 'Sign holder' },
          { id: 'acc_price', label: 'Price channel/tag' },
          { id: 'acc_retainer', label: 'Product retainer' },
          { id: 'acc_cover', label: 'Shelf cover' },
          { id: 'acc_other', label: 'Something else' }
        ]);
        break;
        
      case 'cooler':
        addMessage('bot', "I can help identify that cooler/freezer component! **What type?**", [
          { id: 'cooler_wall', label: 'Wall panel' },
          { id: 'cooler_ceiling', label: 'Ceiling panel' },
          { id: 'cooler_floor', label: 'Floor section' },
          { id: 'cooler_door', label: 'Door component' },
          { id: 'cooler_camlock', label: 'Cam-lock/fastener' },
          { id: 'cooler_seal', label: 'Seal/gasket' },
          { id: 'cooler_support', label: 'Ceiling support' },
          { id: 'cooler_other', label: 'Something else' }
        ]);
        break;
        
      case 'corner':
        addMessage('bot', "I can help identify that corner component! **What type?**", [
          { id: 'corner_inside', label: 'Inside corner (90°)' },
          { id: 'corner_box', label: 'Box corner (enclosed)' },
          { id: 'corner_radius', label: 'Radius (curved)' },
          { id: 'corner_half', label: 'Half radius' },
          { id: 'corner_unsure', label: 'Not sure' }
        ]);
        break;
        
      case 'canopy':
        addMessage('bot', "I can help identify that canopy component! **What is it?**", [
          { id: 'canopy_guard', label: 'Gondola guard system' },
          { id: 'canopy_insert', label: 'Guard insert/trim' },
          { id: 'canopy_bracket', label: 'Canopy bracket' },
          { id: 'canopy_fascia', label: 'Fascia support' },
          { id: 'canopy_other', label: 'Something else' }
        ]);
        break;
        
      case 'pharmacy':
        provideIdentificationResult(
          'Pharmacy Fixtures',
          'Specialized pharmacy fixtures including Rx bay units for prescription storage, pharmacy counters, and secure displays for controlled substances. Designed specifically for pharmacy environments with compliance in mind.',
          'Section 13: RX Pharmacy Displays',
          ['rxPharmacy']
        );
        break;
        
      case 'mobile':
        addMessage('bot', "I can help identify that mobile component! **What is it?**", [
          { id: 'mobile_foursided', label: 'Four-sided displayer' },
          { id: 'mobile_base', label: 'Mobile base (casters for gondola)' },
          { id: 'mobile_caster', label: 'Individual caster/wheel' },
          { id: 'mobile_unsure', label: 'Not sure' }
        ]);
        break;
        
      case 'specialty':
        addMessage('bot', "I can help identify that component! **What type?**", [
          { id: 'spec_kickplate', label: 'Kickplate' },
          { id: 'spec_topcap', label: 'Top cap' },
          { id: 'spec_postcap', label: 'Post end cap' },
          { id: 'spec_spreader', label: 'Spreader bar' },
          { id: 'spec_other', label: 'Something else' }
        ]);
        break;
        
      // Simplified handling for other categories (future phases)
      case 'other':
        addMessage('bot', `To ensure accuracy, let me connect you with our support team:\n\n📞 **Phone:** (800) 869-2040\n📧 **Email:** customerservice@storflex.com\n\nThey can identify any component from photos or detailed descriptions.`, [
          { id: 'contact_support', label: 'Contact support' },
          { id: 'describe_again', label: 'Try describing differently' }
        ]);
        break;
    }
  };
  
  // Handle bracket clarification (FULL IMPLEMENTATION)
  const handleBracketClarification = (systemType) => {
    const systemLabels = {
      sys_gondola: 'Gondola (center aisle)',
      sys_wall: 'Wall unit',
      sys_widespan: 'Widespan (heavy duty)',
      sys_clearspan: 'Clearspan (warehouse)',
      sys_endcap: 'End cap/End unit',
      sys_canopy: 'Canopy/Sign system',
      sys_unsure: 'Not sure'
    };
    
    addMessage('user', systemLabels[systemType]);
    
    setConversationState(prev => ({
      ...prev,
      identifyDetails: { ...prev.identifyDetails, systemType }
    }));
    
    setTimeout(() => {
      if (systemType === 'sys_gondola') {
        addMessage('bot', "What **type of shelf** does this bracket hold?", [
          { id: 'shelftype_steel', label: 'Steel deck' },
          { id: 'shelftype_wire', label: 'Wire shelf' },
          { id: 'shelftype_wood', label: 'Wood shelf' },
          { id: 'shelftype_particle', label: 'Particle board' },
          { id: 'shelftype_glass', label: 'Glass' },
          { id: 'shelftype_unsure', label: 'Not sure' }
        ]);
      } else if (systemType === 'sys_wall') {
        addMessage('bot', "What **type of shelf** does this bracket hold?", [
          { id: 'shelftype_steel', label: 'Steel/metal shelf' },
          { id: 'shelftype_wire', label: 'Wire shelf' },
          { id: 'shelftype_wood', label: 'Wood shelf' },
          { id: 'shelftype_glass', label: 'Glass shelf' },
          { id: 'shelftype_unsure', label: 'Not sure' }
        ]);
      } else if (systemType === 'sys_widespan') {
        provideIdentificationResult(
          'Widespan Brackets/Beams',
          'Heavy-duty beam brackets designed for widespan systems. These support high-capacity shelving (up to 2,000 lbs per level) and attach to widespan uprights.',
          'Section 11: Widespan Shelving',
          ['widespan']
        );
      } else if (systemType === 'sys_clearspan') {
        provideIdentificationResult(
          'Clearspan Brackets',
          'Brackets specifically designed for particle board shelving in warehouse and backroom applications.',
          'Section 12: Clearspan Shelving',
          ['clearspan']
        );
      } else if (systemType === 'sys_endcap') {
        provideIdentificationResult(
          'End Cap Brackets',
          'Specialized brackets for end unit displays at aisle ends. Available in straight or angled configurations.',
          'Section 2: End Unit Displays',
          ['endUnit']
        );
      } else if (systemType === 'sys_canopy') {
        addMessage('bot', "What **mounting type** is the canopy bracket?", [
          { id: 'canopy_gondola', label: 'Gondola mount' },
          { id: 'canopy_wall', label: 'Wall mount' },
          { id: 'canopy_floor', label: 'Floor mount' },
          { id: 'canopy_telescoping', label: 'Telescoping/adjustable' }
        ]);
      } else {
        addMessage('bot', "No problem! Please provide any additional details:\n\n• Approximate depth or size\n• Material (metal, chrome, etc.)\n• Any part numbers or markings\n\nOr I can connect you with support who can help identify it:", [
          { id: 'describe_again', label: 'Provide more details' },
          { id: 'contact_support', label: 'Contact support' }
        ]);
      }
    }, 300);
  };
  
  // Handle bracket shelf type clarification
  const handleBracketShelfType = (shelfType, systemType) => {
    const shelfLabels = {
      shelftype_steel: 'Steel deck',
      shelftype_wire: 'Wire shelf',
      shelftype_wood: 'Wood shelf',
      shelftype_particle: 'Particle board',
      shelftype_glass: 'Glass',
      shelftype_unsure: 'Not sure'
    };
    
    addMessage('user', shelfLabels[shelfType]);
    
    setTimeout(() => {
      if (systemType === 'sys_gondola') {
        if (shelfType === 'shelftype_steel') {
          addMessage('bot', "What **depth** is the shelf?\n\n(Common gondola depths)", [
            { id: 'depth_12', label: '12"' },
            { id: 'depth_16', label: '16"' },
            { id: 'depth_18', label: '18"' },
            { id: 'depth_24', label: '24"' },
            { id: 'depth_unsure', label: 'Not sure' }
          ]);
        } else if (shelfType === 'shelftype_wire') {
          provideIdentificationResult(
            'Gondola Wire Shelf Brackets',
            'Brackets designed specifically for wire shelving on gondola systems. Feature hooks or clips to secure wire decking.',
            'Section 5: Gondola Accessories',
            ['gondola', 'gondolaAccessories']
          );
        } else if (shelfType === 'shelftype_wood') {
          provideIdentificationResult(
            'Wood Shelf Brackets (Gondola)',
            'Specialized brackets for wood shelving on gondola systems. Provide sturdy support for wood decking.',
            'Section 5: Gondola Accessories',
            ['gondola', 'woodDisplays']
          );
        } else {
          provideIdentificationResult(
            'Gondola Shelf Brackets',
            'Standard gondola brackets that lock into upright slots on 1" centers. Available in various depths and styles.',
            'Section 5: Gondola Accessories',
            ['gondola', 'gondolaAccessories']
          );
        }
      } else if (systemType === 'sys_wall') {
        provideIdentificationResult(
          `Wall Mount Brackets - ${shelfLabels[shelfType]}`,
          'Wall-mounted brackets attach to standards. Available in multiple depths (12", 14", 16", 18", 24") to match shelf size.',
          'Section 8-10: Wall Unit Components',
          ['wall']
        );
      }
    }, 300);
  };
  
  // Handle bracket depth clarification
  const handleBracketDepth = (depth) => {
    const depthLabels = {
      depth_12: '12"',
      depth_16: '16"',
      depth_18: '18"',
      depth_24: '24"',
      depth_unsure: 'Not sure'
    };
    
    addMessage('user', depthLabels[depth]);
    
    setTimeout(() => {
      const depthText = depth === 'depth_unsure' ? 'various depths' : depthLabels[depth];
      provideIdentificationResult(
        `Gondola Steel Deck Bracket - ${depthText}`,
        `Standard gondola bracket for ${depthText} steel deck shelves. Locks into upright slots on 1" centers. Features front lip for shelf retention. Load capacity: 24,000 inch-pounds.`,
        'Section 5: Gondola Accessories',
        ['gondola', 'gondolaAccessories']
      );
    }, 300);
  };
  
  // Handle canopy bracket type clarification
  const handleCanopyBracketType = (canopyType) => {
    const canopyLabels = {
      canopy_gondola: 'Gondola mount',
      canopy_wall: 'Wall mount',
      canopy_floor: 'Floor mount',
      canopy_telescoping: 'Telescoping/adjustable'
    };
    
    addMessage('user', canopyLabels[canopyType]);
    
    setTimeout(() => {
      if (canopyType === 'canopy_gondola') {
        provideIdentificationResult(
          'Gondola Mount Adjustable Canopy Bracket',
          'Mounts to gondola uprights to support canopy signage and fascia panels. Adjustable height for flexible positioning.',
          'Section 5: Gondola Accessories - Canopy Systems',
          ['gondola', 'gondolaAccessories']
        );
      } else if (canopyType === 'canopy_wall') {
        provideIdentificationResult(
          'Wall Mount Adjustable Canopy Bracket',
          'Mounts to wall standards to support canopy signage. Adjustable for various sign heights.',
          'Section 5: Canopy Systems',
          ['wall', 'gondolaAccessories']
        );
      } else if (canopyType === 'canopy_floor') {
        provideIdentificationResult(
          'Floor Mount Bracket',
          'Floor-mounted bracket for freestanding signage and canopy systems. Provides stable base support.',
          'Section 5: Canopy Systems',
          ['gondolaAccessories']
        );
      } else if (canopyType === 'canopy_telescoping') {
        provideIdentificationResult(
          'Telescoping Canopy Bracket',
          'Adjustable telescoping bracket system for flexible canopy and sign positioning. Extends and retracts as needed.',
          'Section 5: Canopy Systems',
          ['gondolaAccessories']
        );
      }
    }, 300);
  };
  
  // Handle shelf clarification (FULL IMPLEMENTATION)
  const handleShelfClarification = (systemType) => {
    const systemLabels = {
      sys_gondola: 'Gondola (center aisle)',
      sys_wall: 'Wall unit',
      sys_widespan: 'Widespan (heavy duty)',
      sys_clearspan: 'Clearspan (warehouse)',
      sys_pharmacy: 'Pharmacy display',
      sys_unsure: 'Not sure'
    };
    
    addMessage('user', systemLabels[systemType]);
    
    setConversationState(prev => ({
      ...prev,
      identifyDetails: { ...prev.identifyDetails, systemType }
    }));
    
    setTimeout(() => {
      if (systemType === 'sys_gondola') {
        addMessage('bot', "What **material** is the shelf?", [
          { id: 'shelfmat_steel', label: 'Steel deck' },
          { id: 'shelfmat_wire', label: 'Wire' },
          { id: 'shelfmat_wood', label: 'Wood' },
          { id: 'shelfmat_particle', label: 'Particle board' },
          { id: 'shelfmat_glass', label: 'Glass' },
          { id: 'shelfmat_unsure', label: 'Not sure' }
        ]);
      } else if (systemType === 'sys_wall') {
        addMessage('bot', "What **material** is the shelf?", [
          { id: 'shelfmat_steel', label: 'Steel/metal' },
          { id: 'shelfmat_wire', label: 'Wire' },
          { id: 'shelfmat_wood', label: 'Wood' },
          { id: 'shelfmat_glass', label: 'Glass' },
          { id: 'shelfmat_melamine', label: 'Melamine/laminate' },
          { id: 'shelfmat_unsure', label: 'Not sure' }
        ]);
      } else if (systemType === 'sys_widespan') {
        provideIdentificationResult(
          'Widespan Shelves (Heavy Duty)',
          'Heavy-duty steel decking with wire reinforcement for bulk storage. Supports up to 2,000 lbs per level. Ideal for warehouse and backroom applications.',
          'Section 11: Widespan Shelving',
          ['widespan']
        );
      } else if (systemType === 'sys_clearspan') {
        provideIdentificationResult(
          'Clearspan Shelves',
          'Particle board shelving designed for warehouse and backroom storage. Economical solution for non-display storage needs.',
          'Section 12: Clearspan Shelving',
          ['clearspan']
        );
      } else if (systemType === 'sys_pharmacy') {
        provideIdentificationResult(
          'Pharmacy Display Shelves',
          'Specialized shelving for pharmacy environments including Rx bay shelves and prescription storage. Available in various materials and configurations.',
          'Section 13: RX Pharmacy Displays',
          ['rxPharmacy']
        );
      } else {
        addMessage('bot', "No problem! Please provide any additional details:\n\n• Approximate size or depth\n• Color or finish\n• Any part numbers or markings\n\nOr I can connect you with support:", [
          { id: 'describe_again', label: 'Provide more details' },
          { id: 'contact_support', label: 'Contact support' }
        ]);
      }
    }, 300);
  };
  
  // Handle shelf material clarification
  const handleShelfMaterial = (material, systemType) => {
    const materialLabels = {
      shelfmat_steel: 'Steel deck',
      shelfmat_wire: 'Wire',
      shelfmat_wood: 'Wood',
      shelfmat_particle: 'Particle board',
      shelfmat_glass: 'Glass',
      shelfmat_melamine: 'Melamine/laminate',
      shelfmat_unsure: 'Not sure'
    };
    
    addMessage('user', materialLabels[material]);
    
    setTimeout(() => {
      if (systemType === 'sys_gondola') {
        if (material === 'shelfmat_steel') {
          addMessage('bot', "What **depth** is the steel deck shelf?\n\n(Common gondola depths)", [
            { id: 'shelfdepth_12', label: '12"' },
            { id: 'shelfdepth_16', label: '16"' },
            { id: 'shelfdepth_18', label: '18"' },
            { id: 'shelfdepth_24', label: '24"' },
            { id: 'shelfdepth_unsure', label: 'Not sure' }
          ]);
        } else if (material === 'shelfmat_wire') {
          provideIdentificationResult(
            'Gondola Wire Shelves',
            'Wire deck shelving for gondola systems. Allows visibility and air circulation. Common in cooler applications and bulk merchandise.',
            'Section 6: Gondola Shelf Options',
            ['gondola', 'gondolaAccessories']
          );
        } else if (material === 'shelfmat_wood') {
          provideIdentificationResult(
            'Wood Shelves (Gondola)',
            'Wood shelving for gondola systems. Premium appearance for specialty retail. Available in various finishes.',
            'Section 6: Gondola Shelf Options',
            ['gondola', 'woodDisplays']
          );
        } else if (material === 'shelfmat_particle') {
          provideIdentificationResult(
            'Particle Board Shelves (Gondola)',
            'Economical particle board shelving for gondola systems. Good for lighter merchandise.',
            'Section 6: Gondola Shelf Options',
            ['gondola']
          );
        } else if (material === 'shelfmat_glass') {
          provideIdentificationResult(
            'Glass Shelves (Gondola)',
            'Glass shelving for premium display. Common in cosmetics, jewelry, and high-end retail.',
            'Section 6: Gondola Shelf Options',
            ['gondola']
          );
        } else {
          provideIdentificationResult(
            'Gondola Shelves',
            'Gondola shelving available in multiple materials: steel deck, wire, wood, particle board, and glass. Various depths from 12" to 24".',
            'Section 6: Gondola Shelf Options',
            ['gondola']
          );
        }
      } else if (systemType === 'sys_wall') {
        provideIdentificationResult(
          `Wall Unit Shelves - ${materialLabels[material]}`,
          `Wall-mounted shelving in ${materialLabels[material]}. Available in multiple depths to match your display needs.`,
          'Section 8-10: Wall Unit Components',
          ['wall']
        );
      }
    }, 300);
  };
  
  // Handle shelf depth clarification
  const handleShelfDepth = (depth) => {
    const depthLabels = {
      shelfdepth_12: '12"',
      shelfdepth_16: '16"',
      shelfdepth_18: '18"',
      shelfdepth_24: '24"',
      shelfdepth_unsure: 'Not sure'
    };
    
    addMessage('user', depthLabels[depth]);
    
    setTimeout(() => {
      const depthText = depth === 'shelfdepth_unsure' ? 'various depths' : depthLabels[depth];
      provideIdentificationResult(
        `Gondola Steel Deck Shelf - ${depthText}`,
        `Steel deck shelving for gondola systems in ${depthText} depth. Heavy-duty construction with 24,000 inch-pound load rating. Available in various lengths and finishes.`,
        'Section 6: Gondola Shelf Options',
        ['gondola']
      );
    }, 300);
  };
  
  // UPRIGHT PROGRESSIVE CLARIFICATION HANDLERS
  const handleUprightClarification = (systemType) => {
    const systemLabels = {
      sys_gondola: 'Gondola (center aisle)',
      sys_wall: 'Wall unit',
      sys_widespan: 'Widespan (heavy duty)',
      sys_clearspan: 'Clearspan (warehouse)',
      sys_unsure: 'Not sure'
    };
    
    addMessage('user', systemLabels[systemType]);
    
    setConversationState(prev => ({
      ...prev,
      identifyDetails: { ...prev.identifyDetails, systemType }
    }));
    
    setTimeout(() => {
      if (systemType === 'sys_gondola') {
        addMessage('bot', "Is it **double-sided** (for center aisles) or **single-sided**?", [
          { id: 'upright_double', label: 'Double-sided' },
          { id: 'upright_single', label: 'Single-sided' },
          { id: 'upright_unsure', label: 'Not sure' }
        ]);
      } else if (systemType === 'sys_wall') {
        addMessage('bot', "What **height** approximately?\n\n(Wall standards are typically single-sided)", [
          { id: 'height_48', label: '48"' },
          { id: 'height_60', label: '60"' },
          { id: 'height_72', label: '72"' },
          { id: 'height_84', label: '84"' },
          { id: 'height_96', label: '96"' },
          { id: 'height_unsure', label: 'Not sure' }
        ]);
      } else if (systemType === 'sys_widespan') {
        provideIdentificationResult(
          'Widespan Uprights',
          'Heavy-duty upright frames for widespan systems. Available in welded or bolted configurations. Heights typically 72" to 144" for warehouse applications.',
          'Section 11: Widespan Shelving',
          ['widespan']
        );
      } else if (systemType === 'sys_clearspan') {
        provideIdentificationResult(
          'Clearspan Uprights',
          'Upright frames for clearspan shelving. Available in double-sided (freestanding) or wall-mount configurations.',
          'Section 12: Clearspan Shelving',
          ['clearspan']
        );
      } else {
        addMessage('bot', "No problem! Can you provide:\n\n• Approximate height\n• Double-sided or single-sided?\n• Any part numbers or markings\n\nOr I can connect you with support:", [
          { id: 'describe_again', label: 'Provide more details' },
          { id: 'contact_support', label: 'Contact support' }
        ]);
      }
    }, 300);
  };
  
  const handleUprightConfig = (config) => {
    const configLabels = {
      upright_double: 'Double-sided',
      upright_single: 'Single-sided',
      upright_unsure: 'Not sure'
    };
    
    addMessage('user', configLabels[config]);
    
    setTimeout(() => {
      addMessage('bot', "What **height** is the upright?\n\n(Common gondola heights)", [
        { id: 'height_54', label: '54"' },
        { id: 'height_60', label: '60"' },
        { id: 'height_72', label: '72"' },
        { id: 'height_84', label: '84"' },
        { id: 'height_unsure', label: 'Not sure' }
      ]);
    }, 300);
  };
  
  const handleUprightHeight = (height, systemType) => {
    const heightLabels = {
      height_48: '48"',
      height_54: '54"',
      height_60: '60"',
      height_72: '72"',
      height_84: '84"',
      height_96: '96"',
      height_unsure: 'Not sure'
    };
    
    addMessage('user', heightLabels[height]);
    
    setTimeout(() => {
      const uprightConfig = conversationState.identifyDetails?.uprightConfig || '';
      const config = uprightConfig === 'upright_double' ? 'Double-Sided' : 
                    uprightConfig === 'upright_single' ? 'Single-Sided' : '';
      const heightText = height === 'height_unsure' ? '' : ` - ${heightLabels[height]}`;
      
      if (systemType === 'sys_wall' || conversationState.identifyDetails?.systemType === 'sys_wall') {
        provideIdentificationResult(
          `Wall Standard${heightText}`,
          `Wall-mounted upright standard${heightText ? ` in ${heightLabels[height]} height` : ''}. Slots on 1" centers for bracket adjustment. Common heights: 48", 60", 72", 84", 96".`,
          'Section 8-10: Wall Unit Components',
          ['wall']
        );
      } else {
        provideIdentificationResult(
          `Gondola ${config} Upright${heightText}`.trim(),
          `Gondola upright${config ? ` (${config.toLowerCase()})` : ''} with slots on 1" centers for adjustable shelf brackets${heightText ? `. Height: ${heightLabels[height]}` : ''}. Available heights: 54", 60", 72", 84".`,
          'Section 2-3: Gondola Shelving',
          ['gondola']
        );
      }
    }, 300);
  };
  
  // BASE PROGRESSIVE CLARIFICATION HANDLERS
  const handleBaseClarification = (baseType) => {
    const baseLabels = {
      base_shoe: 'Base shoe/foot',
      base_closer: 'Base end closer',
      base_spreader: 'Bottom spreader',
      base_kickplate: 'Kickplate',
      base_tleg: 'T-leg (widespan)',
      base_mobile: 'Mobile/caster base',
      base_unsure: 'Not sure'
    };
    
    addMessage('user', baseLabels[baseType]);
    
    setTimeout(() => {
      if (baseType === 'base_shoe') {
        provideIdentificationResult(
          'Base Shoes/Feet',
          'Base shoes connect to the bottom of uprights and provide stability. Most include leveling screws for floor adjustment. Available for gondola, wall, and specialty fixtures.',
          'Section 4: Gondola Unit Parts',
          ['gondola']
        );
      } else if (baseType === 'base_closer') {
        provideIdentificationResult(
          'Base End Closers',
          'Base end closers cap off the ends of gondola base sections. Sold in pairs, they provide a finished look and structural support.',
          'Section 4: Gondola Unit Parts',
          ['gondola']
        );
      } else if (baseType === 'base_spreader') {
        provideIdentificationResult(
          'Bottom Spreader',
          'Bottom spreader bars connect between uprights at the base level to provide structural rigidity and stability.',
          'Section 4: Gondola Unit Parts',
          ['gondola']
        );
      } else if (baseType === 'base_kickplate') {
        provideIdentificationResult(
          'Kickplate',
          'Kickplates run along the bottom of gondola sections to protect the base and provide a finished look. Available in various lengths to match section sizes.',
          'Section 4: Gondola Unit Parts',
          ['gondola']
        );
      } else if (baseType === 'base_tleg') {
        provideIdentificationResult(
          'T-Leg Base (Widespan)',
          'T-leg base supports for widespan heavy-duty shelving. Provides stable foundation for high-capacity systems supporting up to 2,000 lbs per level.',
          'Section 11: Widespan Components',
          ['widespan']
        );
      } else if (baseType === 'base_mobile') {
        provideIdentificationResult(
          'Mobile Base / Casters',
          'Mobile base system with heavy-duty casters for movable fixtures. Includes locking wheels for secure positioning. Available for gondola and specialty displays.',
          'Gondola Accessories - Mobile Bases',
          ['gondola', 'gondolaAccessories']
        );
      } else {
        addMessage('bot', "No problem! Can you describe:\n\n• Where it's located (bottom of upright, end of base, etc.)\n• Does it have wheels or leveling screws?\n• Any part numbers or markings\n\nOr I can connect you with support:", [
          { id: 'describe_again', label: 'Provide more details' },
          { id: 'contact_support', label: 'Contact support' }
        ]);
      }
    }, 300);
  };
  
  // PANEL PROGRESSIVE CLARIFICATION HANDLERS
  const handlePanelClarification = (panelType) => {
    const panelLabels = {
      panel_pegboard: 'Pegboard (holes)',
      panel_slatwall: 'Slatwall (grooves)',
      panel_wiregrid: 'Wire grid',
      panel_solid: 'Solid/flat panel',
      panel_end: 'End panel',
      panel_unsure: 'Not sure'
    };
    
    addMessage('user', panelLabels[panelType]);
    
    setTimeout(() => {
      if (panelType === 'panel_pegboard') {
        provideIdentificationResult(
          'Pegboard Back Panel',
          'Pegboard panels with evenly-spaced holes (typically 1" on center) for hanging merchandise with hooks and pegs. Standard perforation pattern compatible with all pegboard accessories. Available for gondola and wall units.',
          'Section 3: Back Panel Options',
          ['gondola', 'wall', 'gondolaAccessories']
        );
      } else if (panelType === 'panel_slatwall') {
        provideIdentificationResult(
          'Slatwall Back Panel',
          'Slatwall panels with horizontal grooves for maximum merchandising flexibility. Compatible with wide range of slatwall accessories including hooks, shelves, and baskets.',
          'Section 3: Back Panel Options',
          ['gondola', 'wall', 'gondolaAccessories']
        );
      } else if (panelType === 'panel_wiregrid') {
        provideIdentificationResult(
          'Wire Grid Back Panel',
          'Wire grid panels provide open visibility while supporting hanging merchandise. Durable welded wire construction. Ideal for cooler applications and areas requiring airflow.',
          'Section 3: Back Panel Options',
          ['gondola', 'wall', 'gondolaAccessories']
        );
      } else if (panelType === 'panel_solid') {
        provideIdentificationResult(
          'Solid Back Panel',
          'Solid panel boards provide clean backdrop for merchandise. Available in various materials (particle board, melamine) and finishes. Creates professional appearance.',
          'Section 3: Back Panel Options',
          ['gondola', 'wall']
        );
      } else if (panelType === 'panel_end') {
        addMessage('bot', "What **style** of end panel?", [
          { id: 'endpanel_flush', label: 'Flush (flat)' },
          { id: 'endpanel_contoured', label: 'Contoured/curved' },
          { id: 'endpanel_wiregrid', label: 'Wire grid' },
          { id: 'endpanel_unsure', label: 'Not sure' }
        ]);
      } else {
        addMessage('bot', "No problem! Can you describe:\n\n• Does it have holes, grooves, or is it flat?\n• Is it for the back or the end of a unit?\n• Approximate size\n\nOr I can connect you with support:", [
          { id: 'describe_again', label: 'Provide more details' },
          { id: 'contact_support', label: 'Contact support' }
        ]);
      }
    }, 300);
  };
  
  const handleEndPanelStyle = (style) => {
    const styleLabels = {
      endpanel_flush: 'Flush (flat)',
      endpanel_contoured: 'Contoured/curved',
      endpanel_wiregrid: 'Wire grid',
      endpanel_unsure: 'Not sure'
    };
    
    addMessage('user', styleLabels[style]);
    
    setTimeout(() => {
      if (style === 'endpanel_flush') {
        provideIdentificationResult(
          'Flush End Panel',
          'Flat end panel that sits flush with the gondola end. Provides clean, finished appearance at aisle ends. Available in various heights.',
          'Section 5: Gondola Accessories',
          ['gondola', 'gondolaAccessories']
        );
      } else if (style === 'endpanel_contoured') {
        provideIdentificationResult(
          'Contoured End Panel',
          'Curved or contoured end panel for decorative finish. Creates eye-catching display at gondola ends. Premium appearance for specialty retail.',
          'Section 5: Gondola Accessories',
          ['gondola', 'gondolaAccessories']
        );
      } else if (style === 'endpanel_wiregrid') {
        provideIdentificationResult(
          'Wire Grid End Panel',
          'Wire grid end panel allows merchandising at gondola ends. Compatible with wire grid accessories for flexible product display.',
          'Section 5: Gondola Accessories',
          ['gondola', 'gondolaAccessories']
        );
      } else {
        provideIdentificationResult(
          'End Panels',
          'End panels finish the sides of gondola units. Available in flush, contoured, and wire grid styles. Various heights to match gondola uprights.',
          'Section 5: Gondola Accessories',
          ['gondola', 'gondolaAccessories']
        );
      }
    }, 300);
  };
  
  // ACCESSORY PROGRESSIVE CLARIFICATION HANDLERS
  const handleAccessoryClarification = (accType) => {
    const accLabels = {
      acc_hook: 'Hook or peg',
      acc_divider: 'Divider or fence',
      acc_basket: 'Basket or bin',
      acc_sign: 'Sign holder',
      acc_price: 'Price channel/tag',
      acc_retainer: 'Product retainer',
      acc_cover: 'Shelf cover',
      acc_other: 'Something else'
    };
    
    addMessage('user', accLabels[accType]);
    
    setTimeout(() => {
      if (accType === 'acc_hook') {
        addMessage('bot', "What is the hook for?", [
          { id: 'hook_pegboard', label: 'Pegboard' },
          { id: 'hook_slatwall', label: 'Slatwall' },
          { id: 'hook_wire', label: 'Wire grid' },
          { id: 'hook_shelf', label: 'Shelf front' },
          { id: 'hook_unsure', label: 'Not sure' }
        ]);
      } else if (accType === 'acc_divider') {
        provideIdentificationResult(
          'Shelf Dividers / Fences',
          'Wire or solid dividers that attach to shelves to separate products and prevent items from falling. Adjustable positioning. Available in various heights (4", 6", 8", 10").',
          'Section 7: Shelf Accessories',
          ['gondolaAccessories']
        );
      } else if (accType === 'acc_basket') {
        provideIdentificationResult(
          'Wire Baskets & Bins',
          'Wire or plastic baskets for bulk merchandise display. Attach to shelving, pegboard, or slatwall. Various sizes available (small, medium, large, extra-large).',
          'Section 8: Merchandising Aids',
          ['gondolaAccessories']
        );
      } else if (accType === 'acc_sign') {
        provideIdentificationResult(
          'Sign Holders',
          'Sign holders and label holders for shelf edge pricing and product information. Multiple mounting options including clip-on, adhesive, and magnetic.',
          'Section 8: Merchandising Aids',
          ['gondolaAccessories']
        );
      } else if (accType === 'acc_price') {
        provideIdentificationResult(
          'Price Channels / Tag Holders',
          'Price molding and tag holders that attach to shelf front for pricing labels and product tags. Standard sizes fit most pricing systems.',
          'Section 7: Shelf Accessories',
          ['gondolaAccessories']
        );
      } else if (accType === 'acc_retainer') {
        provideIdentificationResult(
          'Product Retainers',
          'Metal or plastic retainers that attach to shelf edge to prevent products from falling forward. Especially useful for shelves with small or unstable items.',
          'Section 7: Shelf Accessories',
          ['gondolaAccessories']
        );
      } else if (accType === 'acc_cover') {
        provideIdentificationResult(
          'Shelf Covers',
          'Stainless steel or plastic shelf covers that protect and enhance shelf appearance. Popular in food service and specialty retail applications.',
          'Section 7: Shelf Accessories',
          ['gondolaAccessories']
        );
      } else {
        addMessage('bot', "No problem! Can you describe:\n\n• What it does or where it attaches\n• Approximate size\n• Material (wire, plastic, metal)\n\nOr I can connect you with support:", [
          { id: 'describe_again', label: 'Provide more details' },
          { id: 'contact_support', label: 'Contact support' }
        ]);
      }
    }, 300);
  };
  
  const handleHookType = (hookType) => {
    const hookLabels = {
      hook_pegboard: 'Pegboard',
      hook_slatwall: 'Slatwall',
      hook_wire: 'Wire grid',
      hook_shelf: 'Shelf front',
      hook_unsure: 'Not sure'
    };
    
    addMessage('user', hookLabels[hookType]);
    
    setTimeout(() => {
      if (hookType === 'hook_pegboard') {
        provideIdentificationResult(
          'Pegboard Hooks',
          'Hooks designed for pegboard with standard 1" spacing. Available in various styles: single, double, waterfall, scanner, and specialty hooks. Lengths from 2" to 12".',
          'Section 8: Merchandising Aids',
          ['gondolaAccessories']
        );
      } else if (hookType === 'hook_slatwall') {
        provideIdentificationResult(
          'Slatwall Hooks',
          'Hooks that insert into slatwall grooves. Available in single, double, and waterfall configurations. Compatible with standard slatwall panel systems.',
          'Section 8: Merchandising Aids',
          ['gondolaAccessories']
        );
      } else if (hookType === 'hook_wire') {
        provideIdentificationResult(
          'Wire Grid Hooks',
          'Hooks designed to attach to wire grid panels. Clip-on design for easy repositioning. Various lengths and styles for different merchandise.',
          'Section 8: Merchandising Aids',
          ['gondolaAccessories']
        );
      } else if (hookType === 'hook_shelf') {
        provideIdentificationResult(
          'Shelf Front Hooks',
          'Hooks that clip onto the front edge of shelves. Ideal for hanging bags, small items, or impulse merchandise. No tools required for installation.',
          'Section 7: Shelf Accessories',
          ['gondolaAccessories']
        );
      } else {
        provideIdentificationResult(
          'Hooks & Pegs',
          'Merchandise hooks and pegs for pegboard, slatwall, or wire grid. Available in various lengths, finishes, and configurations (single, double, waterfall).',
          'Section 8: Merchandising Aids',
          ['gondolaAccessories']
        );
      }
    }, 300);
  };
  
  // COOLER/FREEZER PROGRESSIVE CLARIFICATION HANDLERS
  const handleCoolerClarification = (coolerType) => {
    const coolerLabels = {
      cooler_wall: 'Wall panel',
      cooler_ceiling: 'Ceiling panel',
      cooler_floor: 'Floor section',
      cooler_door: 'Door component',
      cooler_camlock: 'Cam-lock/fastener',
      cooler_seal: 'Seal/gasket',
      cooler_support: 'Ceiling support',
      cooler_other: 'Something else'
    };
    
    addMessage('user', coolerLabels[coolerType]);
    
    setTimeout(() => {
      if (coolerType === 'cooler_wall') {
        provideIdentificationResult(
          'Walk-In Cooler/Freezer Wall Panel',
          'Insulated wall panels that lock together with cam-lock system. Standard 4" thickness with foamed-in-place polyurethane insulation. Available in various heights and widths.',
          'Section 14: Walk-In Coolers & Freezers',
          ['cooler']
        );
      } else if (coolerType === 'cooler_ceiling') {
        provideIdentificationResult(
          'Walk-In Cooler/Freezer Ceiling Panel',
          'Insulated ceiling panels with cam-lock connections. Designed to interlock with wall panels for complete seal. Coolers/freezers over 16\'x16\' require ceiling supports (C-beam, I-beam, or hangers).',
          'Section 14: Walk-In Coolers & Freezers',
          ['cooler']
        );
      } else if (coolerType === 'cooler_floor') {
        provideIdentificationResult(
          'Walk-In Cooler/Freezer Floor',
          'Insulated floor sections for walk-in units. Essential for freezer applications to prevent ground freeze. Non-slip surface options available.',
          'Section 14: Walk-In Coolers & Freezers',
          ['cooler']
        );
      } else if (coolerType === 'cooler_door') {
        provideIdentificationResult(
          'Walk-In Cooler/Freezer Door',
          'Pre-hung insulated doors with heavy-duty hinges and latch systems. Includes safety release mechanism from inside for safety compliance. Various sizes available.',
          'Section 14: Walk-In Coolers & Freezers',
          ['cooler']
        );
      } else if (coolerType === 'cooler_camlock') {
        provideIdentificationResult(
          'Cam-Locks (Walk-In Fasteners)',
          'Cam-lock fasteners that connect panels together. Create tight seal between wall and ceiling panels. Essential hardware for proper walk-in assembly. Check all cam-locks after installation.',
          'Section 14: Walk-In Coolers & Freezers - Assembly Hardware',
          ['cooler']
        );
      } else if (coolerType === 'cooler_seal') {
        provideIdentificationResult(
          'Door Seals/Gaskets',
          'Replacement seals and gaskets for walk-in doors. Maintain temperature efficiency and prevent air leakage. Regular inspection and replacement recommended.',
          'Section 14: Walk-In Coolers & Freezers - Replacement Parts',
          ['cooler']
        );
      } else if (coolerType === 'cooler_support') {
        provideIdentificationResult(
          'Ceiling Supports (C-Beam/I-Beam/Hangers)',
          'Ceiling support systems for units over 16\'x16\'. Options: C-beam or I-beam (rests on wall tops) or ceiling hangers (suspend from building structure). Includes bearing angles, brackets, and hardware.',
          'Section 14: Walk-In Coolers & Freezers - Ceiling Supports',
          ['cooler']
        );
      } else {
        addMessage('bot', "No problem! Can you describe:\n\n• Where it's located on the walk-in\n• Approximate size or any part numbers\n• Is it metal, plastic, or insulated panel\n\nOr I can connect you with our walk-in specialist:", [
          { id: 'describe_again', label: 'Provide more details' },
          { id: 'contact_support', label: 'Contact specialist' }
        ]);
      }
    }, 300);
  };
  
  // CORNER PROGRESSIVE CLARIFICATION HANDLERS
  const handleCornerClarification = (cornerType) => {
    const cornerLabels = {
      corner_inside: 'Inside corner (90°)',
      corner_box: 'Box corner (enclosed)',
      corner_radius: 'Radius (curved)',
      corner_half: 'Half radius',
      corner_unsure: 'Not sure'
    };
    
    addMessage('user', cornerLabels[cornerType]);
    
    setTimeout(() => {
      if (cornerType === 'corner_inside') {
        provideIdentificationResult(
          'Inside Corner Shelving (90°)',
          'Inside corner units designed to utilize 90-degree corner spaces effectively. Maximizes corner merchandising in L-shaped store layouts. Integrates seamlessly with standard gondola runs.',
          'Corner Solutions',
          ['insideCorner']
        );
      } else if (cornerType === 'corner_box') {
        provideIdentificationResult(
          'Box Corner Shelving',
          'Enclosed box corner units for corner merchandising. Provides four-sided display capability. Creates focal merchandising point at store corners.',
          'Corner Solutions',
          ['boxCorner']
        );
      } else if (cornerType === 'corner_radius') {
        provideIdentificationResult(
          'Radius Corner (Z-Line)',
          'Curved radius corner for smooth gondola transitions. Premium appearance with no sharp edges. Part of Z-Line gondola system. Creates flowing store layout.',
          'Section 3: Gondola Options - Z-Line Radius Corner',
          ['gondola']
        );
      } else if (cornerType === 'corner_half') {
        provideIdentificationResult(
          'Half Radius Corner (Z-Line)',
          'Half-radius curved corner for tighter spaces. Provides smooth transition with smaller footprint than full radius. Ideal for compact store layouts.',
          'Section 3: Gondola Options - Z-Line Half Radius',
          ['gondola']
        );
      } else {
        provideIdentificationResult(
          'Corner Solutions',
          'Corner shelving units available in multiple styles: inside corner (90°), box corner (enclosed), radius (curved), and half-radius. Each designed to maximize corner space utilization.',
          'Corner Solutions & Section 3',
          ['insideCorner', 'boxCorner', 'gondola']
        );
      }
    }, 300);
  };
  
  // CANOPY PROGRESSIVE CLARIFICATION HANDLERS
  const handleCanopyClarification = (canopyType) => {
    const canopyLabels = {
      canopy_guard: 'Gondola guard system',
      canopy_insert: 'Guard insert/trim',
      canopy_bracket: 'Canopy bracket',
      canopy_fascia: 'Fascia support',
      canopy_other: 'Something else'
    };
    
    addMessage('user', canopyLabels[canopyType]);
    
    setTimeout(() => {
      if (canopyType === 'canopy_guard') {
        provideIdentificationResult(
          'Gondola Guard System',
          'Protective canopy system that runs along the top of gondola runs. Provides professional finished appearance and protects merchandise from overhead lighting. Can support signage. Available with various decorative insert options.',
          'Section 3: Gondola Options - Gondola Guard System',
          ['gondola', 'gondolaAccessories']
        );
      } else if (canopyType === 'canopy_insert') {
        provideIdentificationResult(
          'Gondola Guard Insert/Trim',
          'Decorative inserts for gondola guard system. Options include stainless steel inserts, colored trim pieces, and custom designs. Enhances visual appeal and brand identity.',
          'Section 3: Gondola Options - Guard Insert Trim',
          ['gondola', 'gondolaAccessories']
        );
      } else if (canopyType === 'canopy_bracket') {
        // Re-route to bracket clarification
        setConversationState(prev => ({
          ...prev,
          identifyCategory: 'bracket',
          identifyDetails: { ...prev.identifyDetails, systemType: 'sys_canopy' }
        }));
        handleCanopyBracketType('canopy_gondola'); // Default to asking for mount type
      } else if (canopyType === 'canopy_fascia') {
        provideIdentificationResult(
          'Fascia Support Bracket (Shelf Mount)',
          'Bracket that mounts to gondola shelf to support fascia panels and signage. Adjustable height for flexible sign positioning. Essential for elevated signage displays.',
          'Section 5: Gondola Accessories - Canopy Brackets',
          ['gondolaAccessories']
        );
      } else {
        addMessage('bot', "No problem! Can you describe:\n\n• Is it for mounting, decoration, or structure?\n• Location (top of gondola, shelf-mounted, etc.)\n• Any part numbers or markings\n\nOr I can connect you with support:", [
          { id: 'describe_again', label: 'Provide more details' },
          { id: 'contact_support', label: 'Contact support' }
        ]);
      }
    }, 300);
  };
  
  // MOBILE PROGRESSIVE CLARIFICATION HANDLERS
  const handleMobileClarification = (mobileType) => {
    const mobileLabels = {
      mobile_foursided: 'Four-sided displayer',
      mobile_base: 'Mobile base (casters for gondola)',
      mobile_caster: 'Individual caster/wheel',
      mobile_unsure: 'Not sure'
    };
    
    addMessage('user', mobileLabels[mobileType]);
    
    setTimeout(() => {
      if (mobileType === 'mobile_foursided') {
        provideIdentificationResult(
          'Four-Sided Displayer',
          'Mobile four-sided display unit with heavy-duty casters. Perfect for impulse merchandise, seasonal displays, and promotional items. Can be positioned anywhere in store. Features lockable wheels for stability when positioned.',
          'Four-Sided Displayers',
          ['fourSided']
        );
      } else if (mobileType === 'mobile_base') {
        provideIdentificationResult(
          'Mobile Base System',
          'Mobile base with heavy-duty locking casters for movable gondola fixtures. Converts standard gondola into mobile unit. Includes locking wheels for secure positioning. Allows flexible store layout changes.',
          'Gondola Accessories - Mobile Bases',
          ['gondola', 'gondolaAccessories']
        );
      } else if (mobileType === 'mobile_caster') {
        provideIdentificationResult(
          'Replacement Casters/Wheels',
          'Individual replacement casters and wheels for mobile bases and displayers. Various load capacities and wheel sizes available. Includes both swivel and fixed caster options.',
          'Gondola Accessories - Mobile Components',
          ['gondolaAccessories']
        );
      } else {
        provideIdentificationResult(
          'Mobile Display Solutions',
          'Mobile display options include four-sided displayers, mobile gondola bases with casters, and replacement wheels. All feature locking mechanisms for secure positioning.',
          'Mobile Display Solutions',
          ['fourSided', 'gondolaAccessories']
        );
      }
    }, 300);
  };
  
  // SPECIALTY ITEM PROGRESSIVE CLARIFICATION HANDLERS
  const handleSpecialtyClarification = (specType) => {
    const specLabels = {
      spec_kickplate: 'Kickplate',
      spec_topcap: 'Top cap',
      spec_postcap: 'Post end cap',
      spec_spreader: 'Spreader bar',
      spec_other: 'Something else'
    };
    
    addMessage('user', specLabels[specType]);
    
    setTimeout(() => {
      if (specType === 'spec_kickplate') {
        provideIdentificationResult(
          'Kickplate',
          'Kickplates run along the bottom of gondola sections to protect the base and provide a finished look. Available in various lengths to match section sizes (3\', 4\', etc.). Snap-in installation.',
          'Section 4: Gondola Unit Parts',
          ['gondola']
        );
      } else if (specType === 'spec_topcap') {
        provideIdentificationResult(
          'Top Cap',
          'Top caps finish the top of gondola uprights. Provides clean professional appearance and protects upright tops from damage. Simple snap-on installation.',
          'Section 4: Gondola Unit Parts',
          ['gondola']
        );
      } else if (specType === 'spec_postcap') {
        provideIdentificationResult(
          'Post End Caps',
          'End caps that finish the ends of gondola posts/uprights. Sold in pairs (one for each end). Creates professional finished appearance. Available in various colors to match upright finish.',
          'Section 4: Gondola Unit Parts',
          ['gondola']
        );
      } else if (specType === 'spec_spreader') {
        provideIdentificationResult(
          'Bottom Spreader',
          'Bottom spreader bars connect between uprights at the base level. Provides structural rigidity and stability to gondola sections. Essential for proper gondola assembly.',
          'Section 4: Gondola Unit Parts',
          ['gondola']
        );
      } else {
        addMessage('bot', "No problem! Can you describe:\n\n• Where it's located on the fixture\n• What it does or covers\n• Approximate size\n\nOr I can connect you with support:", [
          { id: 'describe_again', label: 'Provide more details' },
          { id: 'contact_support', label: 'Contact support' }
        ]);
      }
    }, 300);
  };
  
  // Final identification result display
  const provideIdentificationResult = (componentName, description, catalogRef, productKeys) => {
    const products = productKeys.map(key => PRODUCT_CATALOG[key]).filter(Boolean);
    
    const resultText = `**${componentName}**\n\n${description}\n\n📖 **Catalog Reference:** ${catalogRef}`;
    
    addMessage('bot', resultText, null, products.slice(0, 2));
    
    setTimeout(() => {
      addMessage('bot', "Does this match what you're looking for?", [
        { id: 'yes_match', label: 'Yes, that\'s it!' },
        { id: 'not_quite', label: 'Not quite, let me clarify' },
        { id: 'contact_support', label: 'Contact support for confirmation' }
      ]);
    }, 1000);
  };
  
  const handleComponentIdentification = (optionId) => {
    // Handle category selection
    if (optionId.startsWith('cat_')) {
      const categoryMap = {
        cat_bracket: 'bracket',
        cat_shelf: 'shelf',
        cat_upright: 'upright',
        cat_base: 'base',
        cat_panel: 'panel',
        cat_accessory: 'accessory',
        cat_other: 'other'
      };
      const category = categoryMap[optionId];
      if (category) {
        startProgressiveClarification(category);
      }
      return;
    }
    
    // Handle system type selection (brackets, shelves, uprights)
    if (optionId.startsWith('sys_')) {
      const category = conversationState.identifyCategory;
      if (category === 'bracket') {
        handleBracketClarification(optionId);
      } else if (category === 'shelf') {
        handleShelfClarification(optionId);
      } else if (category === 'upright') {
        handleUprightClarification(optionId);
      }
      return;
    }
    
    // Handle base type selection
    if (optionId.startsWith('base_')) {
      handleBaseClarification(optionId);
      return;
    }
    
    // Handle panel type selection
    if (optionId.startsWith('panel_')) {
      handlePanelClarification(optionId);
      return;
    }
    
    // Handle accessory type selection
    if (optionId.startsWith('acc_')) {
      handleAccessoryClarification(optionId);
      return;
    }
    
    // Handle shelf type selection (for brackets)
    if (optionId.startsWith('shelftype_')) {
      const systemType = conversationState.identifyDetails?.systemType;
      handleBracketShelfType(optionId, systemType);
      return;
    }
    
    // Handle bracket depth selection
    if (optionId.startsWith('depth_')) {
      handleBracketDepth(optionId);
      return;
    }
    
    // Handle canopy bracket type
    if (optionId.startsWith('canopy_')) {
      handleCanopyBracketType(optionId);
      return;
    }
    
    // Handle shelf material selection
    if (optionId.startsWith('shelfmat_')) {
      const systemType = conversationState.identifyDetails?.systemType;
      handleShelfMaterial(optionId, systemType);
      return;
    }
    
    // Handle shelf depth selection
    if (optionId.startsWith('shelfdepth_')) {
      handleShelfDepth(optionId);
      return;
    }
    
    // Handle upright configuration
    if (optionId.startsWith('upright_')) {
      setConversationState(prev => ({
        ...prev,
        identifyDetails: { ...prev.identifyDetails, uprightConfig: optionId }
      }));
      handleUprightConfig(optionId);
      return;
    }
    
    // Handle height selection (uprights)
    if (optionId.startsWith('height_')) {
      const systemType = conversationState.identifyDetails?.systemType;
      handleUprightHeight(optionId, systemType);
      return;
    }
    
    // Handle end panel style
    if (optionId.startsWith('endpanel_')) {
      handleEndPanelStyle(optionId);
      return;
    }
    
    // Handle hook type
    if (optionId.startsWith('hook_')) {
      handleHookType(optionId);
      return;
    }
    
    // Handle cooler type selection
    if (optionId.startsWith('cooler_')) {
      handleCoolerClarification(optionId);
      return;
    }
    
    // Handle corner type selection
    if (optionId.startsWith('corner_')) {
      handleCornerClarification(optionId);
      return;
    }
    
    // Handle canopy type selection
    if (optionId.startsWith('canopy_') && !optionId.includes('gondola') && !optionId.includes('wall') && !optionId.includes('floor') && !optionId.includes('telescoping')) {
      handleCanopyClarification(optionId);
      return;
    }
    
    // Handle mobile type selection
    if (optionId.startsWith('mobile_')) {
      handleMobileClarification(optionId);
      return;
    }
    
    // Handle specialty type selection
    if (optionId.startsWith('spec_')) {
      handleSpecialtyClarification(optionId);
      return;
    }
    
    // Handle final confirmation options
    if (optionId === 'more_info' || optionId === 'yes_match') {
      addMessage('user', 'See product details');
      setTimeout(() => {
        addMessage('bot', "Here's our complete product catalog where you can find this component:", null, [PRODUCT_CATALOG.allProducts]);
        setTimeout(() => {
          addMessage('bot', "Need to order or have questions?\n\n📞 Call: (800) 869-2040\n📧 Email: customerservice@storflex.com");
        }, 1000);
      }, 500);
    } else if (optionId === 'describe_again' || optionId === 'provide_detail' || optionId === 'not_quite') {
      addMessage('user', 'Provide more details');
      setTimeout(() => {
        addMessage('bot', "No problem! Please describe the component with as much detail as possible:\n\n• Type of fixture (gondola, wall, etc.)\n• Material and finish\n• Size or measurements\n• Location on the fixture\n• Any part numbers or markings");
      }, 500);
    } else if (optionId === 'contact_support' || optionId === 'skip_to_contact') {
      handleSupportContact();
    }
  };
  
  const handleSupportContact = () => {
    addMessage('user', 'Contact support');
    
    const contactInfo = `Perfect! Here's how to reach our support team:\n\nPhone: (800) 869-2040\nEmail: customerservice@storflex.com\nHours: Monday-Friday, 8 AM - 5 PM ET\n\nAssembly Instructions available at:`;
    
    addMessage('bot', contactInfo, null, [{
      url: 'https://www.storflex.com/assembly-instructions/',
      title: 'Assembly Instructions',
      name: 'View Assembly Instructions & Videos'
    }]);
  };

  const handleQuoteRequest = (requestId) => {
    if (requestId === 'yes') {
      addMessage('user', 'Yes, get me a quote');
      
      setTimeout(() => {
        // Soft lead capture - ask permission first
        addMessage('bot', "Perfect! I can connect you with a Storflex specialist who'll prepare a custom quote.\n\n**Would you like me to send your information to them?**", [
          { id: 'send_to_specialist', label: 'Yes, send to specialist' },
          { id: 'call_instead', label: 'I\'ll just call instead' }
        ]);
      }, 500);
    } else if (requestId === 'send_to_specialist') {
      addMessage('user', 'Yes, send to specialist');
      
      setTimeout(() => {
        // Show confirmation summary before form
        showConfirmationSummary();
      }, 500);
    } else if (requestId === 'confirm_and_continue') {
      addMessage('user', 'Looks good, continue');
      
      setTimeout(() => {
        addMessage('bot', "Great! Just a few details so we can prepare your quote:");
        setShowLeadForm(true);
      }, 500);
    } else if (requestId === 'edit_details') {
      addMessage('user', 'Let me change something');
      
      setTimeout(() => {
        addMessage('bot', "No problem! Click any of your previous answers above to make changes, then come back here.");
      }, 500);
    } else if (requestId === 'call_instead') {
      addMessage('user', 'I\'ll just call instead');
      
      setTimeout(() => {
        addMessage('bot', "Perfect! Give us a call:\n\n📞 **(800) 869-2040**\n\nMention you spoke with the Storflex Assistant and we'll have your information ready!");
      }, 500);
    } else if (requestId === 'browse') {
      addMessage('user', 'Browse all products');
      
      setTimeout(() => {
        addMessage('bot', "Here's our complete product catalog:", null, [PRODUCT_CATALOG.allProducts]);
      }, 500);
    } else {
      addMessage('user', 'Just call me');
      
      setTimeout(() => {
        addMessage('bot', "Perfect! Give us a call:\n\n📞 **(800) 869-2040**\n\nMention you spoke with the Storflex Assistant!");
      }, 500);
    }
  };
  
  // Show confirmation summary before lead form
  const showConfirmationSummary = () => {
    const businessTypeLabels = {
      retail: 'Retail Store',
      convenience: 'Convenience Store',
      grocery: 'Grocery Store',
      pharmacy: 'Pharmacy',
      liquor: 'Liquor Store',
      hardware: 'Hardware Store',
      other: 'Other Business'
    };
    
    const locationLabels = {
      aisles: 'Center Aisles',
      wall: 'Wall/Perimeter',
      checkout: 'Checkout Area',
      corner: 'Corner Spaces',
      endcap: 'End Caps',
      cooler: 'Walk-In Cooler',
      freezer: 'Walk-In Freezer',
      both_cf: 'Cooler & Freezer',
      multiple: 'Multiple Areas',
      not_sure: 'Not Sure Yet'
    };
    
    const itemsLabels = {
      packaged: 'Packaged Goods',
      bulk: 'Bulk Items',
      hanging: 'Hanging Merchandise',
      mixed: 'Mixed Products'
    };
    
    const timelineLabels = {
      immediate: 'ASAP (1-2 weeks)',
      month: 'Within a month',
      quarter: 'Next 3 months',
      planning: 'Just planning'
    };
    
    let summaryText = "**Here's what we'll send to our specialist:**\n\n";
    
    // Always show business type and location
    if (conversationState.businessType) {
      summaryText += `🏢 **Business Type:** ${businessTypeLabels[conversationState.businessType] || conversationState.businessType}\n`;
    }
    
    if (conversationState.location) {
      summaryText += `📍 **Location Needs:** ${locationLabels[conversationState.location] || conversationState.location}\n`;
    }
    
    // Only show items if it was collected
    if (conversationState.items) {
      summaryText += `📦 **Products:** ${itemsLabels[conversationState.items] || conversationState.items}\n`;
    }
    
    // Only show display type if it was collected
    if (conversationState.displayType) {
      summaryText += `🎯 **Display Type:** ${conversationState.displayType}\n`;
    }
    
    // Only show section count if it was collected (but prioritize calculated sections)
    if (conversationState.calculatedSections) {
      summaryText += `📏 **Recommended Sections:** ${conversationState.calculatedSections}\n`;
    } else if (conversationState.sectionCount) {
      summaryText += `📏 **Sections:** ${conversationState.sectionCount}\n`;
    }
    
    // ENHANCED: Show space calculation details if available
    if (conversationState.spaceDetails) {
      if (conversationState.spaceDetails.squareFootage) {
        summaryText += `📐 **Square Footage:** ${conversationState.spaceDetails.squareFootage}\n`;
      }
      if (conversationState.spaceDetails.linearFootage) {
        summaryText += `📐 **Linear Footage:** ${conversationState.spaceDetails.linearFootage}\n`;
      }
      if (conversationState.spaceDetails.areaSize) {
        summaryText += `📐 **Area Size:** ${conversationState.spaceDetails.areaSize}\n`;
      }
    } else if (conversationState.spaceInfo && !conversationState.calculatedSections) {
      // Fallback to basic space info if no detailed calculation
      summaryText += `📐 **Space Info:** ${conversationState.spaceInfo}\n`;
    }
    
    // Only show adjustability if it was collected
    if (conversationState.adjustability) {
      summaryText += `🔧 **Adjustability:** ${conversationState.adjustability}\n`;
    }
    
    // Always show timeline if available
    if (conversationState.timeline) {
      summaryText += `⏰ **Timeline:** ${timelineLabels[conversationState.timeline] || conversationState.timeline}\n`;
    }
    
    summaryText += "\n*This helps us provide the most accurate quote for your needs.*";
    
    addMessage('bot', summaryText, [
      { id: 'confirm_and_continue', label: 'Looks good, continue' },
      { id: 'edit_details', label: 'Let me change something' }
    ]);
  };

  // CONFIDENCE SCORING SYSTEM
  const calculateConfidenceScore = () => {
    let score = 0;
    let factors = [];
    
    // Base score for completing the flow (30 points)
    if (conversationState.businessType && conversationState.location && conversationState.timeline) {
      score += 30;
      factors.push('Completed core questions');
    }
    
    // Business Type Clarity (15 points)
    if (conversationState.businessType && conversationState.businessType !== 'other') {
      score += 15;
      factors.push('Clear business type');
    } else if (conversationState.businessType === 'other') {
      score += 7;
      factors.push('General business type');
    }
    
    // Location Specificity (15 points)
    if (conversationState.location && conversationState.location !== 'not_sure' && conversationState.location !== 'multiple') {
      score += 15;
      factors.push('Specific location identified');
    } else if (conversationState.location === 'multiple') {
      score += 10;
      factors.push('Multiple locations (complex)');
    } else if (conversationState.location === 'not_sure') {
      score += 5;
      factors.push('Location uncertain');
    }
    
    // Timeline Urgency (20 points - critical for prioritization)
    const timelineScores = {
      immediate: 20, // Hot lead
      month: 15,     // Warm lead
      quarter: 10,   // Medium lead
      planning: 5    // Early stage
    };
    if (conversationState.timeline) {
      const timelineScore = timelineScores[conversationState.timeline] || 5;
      score += timelineScore;
      if (conversationState.timeline === 'immediate') factors.push('URGENT: Immediate need');
      else if (conversationState.timeline === 'month') factors.push('Warm: Within 30 days');
      else if (conversationState.timeline === 'quarter') factors.push('Planning: 3 month horizon');
      else factors.push('Early stage: Still planning');
    }
    
    // Product Detail Completeness (10 points)
    if (conversationState.items) {
      score += 10;
      factors.push('Product type specified');
    }
    
    // Space Information (10 points + bonus for calculations)
    if (conversationState.spaceDetails || conversationState.calculatedSections) {
      score += 12; // Bonus for using calculator
      factors.push('Space calculated with recommendation');
    } else if (conversationState.spaceInfo || conversationState.sectionCount || 
        conversationState.palletPositions || conversationState.hangingFootage) {
      score += 10;
      factors.push('Space details provided');
    }
    
    // Uncertainty Penalty (-5 points per "not sure")
    if (conversationState.uncertaintyCount > 0) {
      const penalty = Math.min(conversationState.uncertaintyCount * 5, 15); // Max 15 point penalty
      score -= penalty;
      factors.push(`Uncertainty: ${conversationState.uncertaintyCount} unclear answers`);
    }
    
    // Bonus: Specialty/Complex Needs (adds value, not urgency)
    if (conversationState.pharmacyType || conversationState.hardwareDisplay || 
        conversationState.palletAccess === 'pallet_yes') {
      score += 5;
      factors.push('Specialty requirements');
    }
    
    // Bonus: Complete Contact Info
    if (leadFormData.company && leadFormData.phone) {
      score += 5;
      factors.push('Complete contact info');
    }
    
    // Ensure score stays in 0-100 range
    score = Math.max(0, Math.min(100, score));
    
    // Determine category
    let category, priority;
    if (score >= 85) {
      category = 'Hot / Ready';
      priority = '🔥 HIGH';
    } else if (score >= 60) {
      category = 'Warm / Needs Follow-up';
      priority = '⚡ MEDIUM';
    } else {
      category = 'Early / Educational';
      priority = '💡 LOW';
    }
    
    return { score, category, priority, factors };
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    
    // Calculate confidence score
    const confidence = calculateConfidenceScore();
    
    // Structure the lead data for Google Sheets
    const leadData = {
      timestamp: new Date().toLocaleString(),
      name: leadFormData.name,
      company: leadFormData.company || 'N/A',
      email: leadFormData.email,
      phone: leadFormData.phone || 'N/A',
      city: leadFormData.city,
      state: leadFormData.state,
      businessType: conversationState.businessType || 'N/A',
      location: conversationState.location || 'N/A',
      items: conversationState.items || 'N/A',
      displayType: conversationState.displayType || 'N/A',
      adjustability: conversationState.adjustability || 'N/A',
      
      // ENHANCED SPACE INFORMATION
      spaceInfoType: conversationState.spaceInfo || 'N/A',
      calculatedSections: conversationState.calculatedSections || conversationState.sectionCount || 'N/A',
      squareFootage: conversationState.spaceDetails?.squareFootage || 'N/A',
      linearFootage: conversationState.spaceDetails?.linearFootage || 'N/A',
      areaSize: conversationState.spaceDetails?.areaSize || 'N/A',
      spaceReasoning: conversationState.spaceDetails?.reasoning || 'N/A',
      
      timeline: conversationState.timeline || 'N/A',
      notes: leadFormData.notes || 'None',
      
      // CONFIDENCE SCORING DATA (for sales team)
      confidenceScore: confidence.score,
      leadCategory: confidence.category,
      priority: confidence.priority,
      confidenceFactors: confidence.factors.join('; '),
      uncertaintyCount: conversationState.uncertaintyCount || 0,
      skippedQuestions: conversationState.skippedQuestions.join(', ') || 'None'
    };

    try {
      // Send to Google Sheets via Google Apps Script Web App
      const response = await fetch('https://script.google.com/macros/s/AKfycby0ODn9FNvfScnk5Dd0kNHxojgLj5mE67ObXON1ZWwwi9g9xIyogW6yz_j1PoY669TR/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(leadData)
      });

      console.log('Lead submitted successfully:', leadData);
      console.log('Confidence Score:', confidence);
      
      setShowLeadForm(false);
      
      const summary = `Quote Request Summary\n\nBusiness Type: ${conversationState.businessType || 'N/A'}\nLocation: ${conversationState.location || 'N/A'}\nTimeline: ${conversationState.timeline || 'N/A'}\n\nContact: ${leadFormData.name}\nEmail: ${leadFormData.email}\nPhone: ${leadFormData.phone || 'N/A'}\nLocation: ${leadFormData.city}, ${leadFormData.state}`;
      
      addMessage('bot', `Thanks, ${leadFormData.name}! Your request has been submitted:\n\n${summary}`);
      
      setTimeout(() => {
        addMessage('bot', "A Storflex specialist will reach out within 1 business day!");
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting lead:', error);
      
      // Fallback: Log to console and still show success message
      console.log('Lead data (fallback):', leadData);
      
      setShowLeadForm(false);
      addMessage('bot', `Thanks, ${leadFormData.name}! We've received your information. A Storflex specialist will reach out within 1 business day!`);
    }
  };

  const handleOptionClick = (messageIndex, optionId, isRetry = false) => {
    // Check if clicking on an old message (not the latest one with options)
    const lastMessageIndex = messages.length - 1;
    const isOldMessage = messageIndex < lastMessageIndex && !isRetry;
    
    if (isOldMessage) {
      // Close the lead form if it's open
      setShowLeadForm(false);
      
      // User is clicking on a previous question to change their answer
      // Truncate all messages after this one
      const newMessages = messages.slice(0, messageIndex + 1);
      setMessages(newMessages);
      
      // Determine what stage this message represents and reset state accordingly
      const message = messages[messageIndex];
      let newState = { ...conversationState };
      
      // CRITICAL: Reset all state that comes AFTER this question
      if (message.text?.includes("What are you working on today")) {
        // First question - reset EVERYTHING as if starting fresh
        newState = {
          mode: null,
          intent: null,
          businessType: null,
          location: null,
          items: null,
          displayType: null,
          adjustability: null,
          spaceInfo: null,
          sectionCount: null,
          timeline: null,
          supportType: null,
          leadData: {}
        };
      } else if (message.text?.includes("What type of business")) {
        // Business type question - keep mode/intent, reset everything else
        newState.businessType = null;
        newState.location = null;
        newState.items = null;
        newState.displayType = null;
        newState.adjustability = null;
        newState.spaceInfo = null;
        newState.sectionCount = null;
        newState.timeline = null;
      } else if (message.text?.includes("Where will the shelving be located") || message.text?.includes("What type of refrigeration")) {
        // Location question - keep business type, reset location and everything after
        newState.location = null;
        newState.items = null;
        newState.displayType = null;
        newState.adjustability = null;
        newState.spaceInfo = null;
        newState.sectionCount = null;
        newState.timeline = null;
      } else if (message.text?.includes("What will you be displaying")) {
        // Items question - reset items and everything after
        newState.items = null;
        newState.displayType = null;
        newState.adjustability = null;
        newState.spaceInfo = null;
        newState.sectionCount = null;
        newState.timeline = null;
      } else if (message.text?.includes("end cap display") || message.text?.includes("corner solution") || message.text?.includes("at checkout")) {
        // Display type question - reset display type and everything after
        newState.displayType = null;
        newState.adjustability = null;
        newState.spaceInfo = null;
        newState.sectionCount = null;
        newState.timeline = null;
      } else if (message.text?.includes("adjustable shelves")) {
        // Adjustability question - reset adjustability and everything after
        newState.adjustability = null;
        newState.spaceInfo = null;
        newState.sectionCount = null;
        newState.timeline = null;
      } else if (message.text?.includes("describe your space")) {
        // Space info question - reset space info and everything after
        newState.spaceInfo = null;
        newState.sectionCount = null;
        newState.timeline = null;
      } else if (message.text?.includes("How many sections")) {
        // Section count question - reset section count and timeline
        newState.sectionCount = null;
        newState.timeline = null;
      } else if (message.text?.includes("timeline") || message.text?.includes("What's your timeline")) {
        // Timeline question - reset only timeline
        newState.timeline = null;
      }
      
      // Update state synchronously
      setConversationState(newState);
      
      // Process with the new reset state after a delay
      // This will trigger the conversation to continue naturally from this point
      setTimeout(() => {
        processOptionSelectionWithState(optionId, newState);
      }, 100);
      return;
    }
    
    // Normal flow - process the selection
    processOptionSelection(optionId);
  };

  const processOptionSelectionWithState = (optionId, state) => {
    // Process selection with explicit state (used after reset)
    if (!state.mode) {
      handleIntentSelection(optionId);
    } else if (state.mode === 'custom') {
      // Handle custom "Something else" flow
      handleCustomResponse(optionId);
    } else if (state.mode === 'support') {
      if (!state.supportType) {
        handleSupportRequest(optionId);
      } else if (optionId.startsWith('cat_') || optionId.startsWith('sys_') || 
                 optionId.startsWith('base_') || optionId.startsWith('panel_') || 
                 optionId.startsWith('acc_') || optionId.startsWith('shelftype_') || 
                 optionId.startsWith('depth_') || optionId.startsWith('canopy_') || 
                 optionId.startsWith('shelfmat_') || optionId.startsWith('shelfdepth_') ||
                 optionId.startsWith('upright_') || optionId.startsWith('height_') ||
                 optionId.startsWith('endpanel_') || optionId.startsWith('hook_') ||
                 optionId.startsWith('cooler_') || optionId.startsWith('corner_') ||
                 optionId.startsWith('mobile_') || optionId.startsWith('spec_') ||
                 optionId === 'more_info' || optionId === 'describe_again' || 
                 optionId === 'contact_support' || optionId === 'provide_detail' || 
                 optionId === 'yes_match' || optionId === 'not_quite' || 
                 optionId === 'skip_to_contact') {
        // Handle component identification flow
        handleComponentIdentification(optionId);
      } else {
        handleSupportContact();
      }
    } else if (state.mode === 'sales') {
      if (!state.businessType) {
        handleBusinessType(optionId);
      } else if (!state.location) {
        handleLocation(optionId);
      } else if ((state.location === 'cooler' || state.location === 'freezer' || state.location === 'both_cf') && !state.timeline) {
        handleTimeline(optionId);
      } else if (state.location && !state.items && !state.displayType) {
        // ADAPTIVE PATH ROUTING
        if (optionId === 'yes' || optionId === 'no' || optionId === 'browse' || 
            optionId === 'send_to_specialist' || optionId === 'call_instead' || 
            optionId === 'confirm_and_continue' || optionId === 'edit_details') {
          handleQuoteRequest(optionId);
        } else if (optionId === 'yes_connect' || optionId === 'continue_chatbot') {
          handleUncertaintyEscalation(optionId);
        } else if (optionId.includes('_end') || optionId.includes('_corner') || optionId.includes('_checkout')) {
          handleDisplayType(optionId);
        } else if (optionId.startsWith('pallet_')) {
          handlePalletAccess(optionId);
        } else if (optionId.startsWith('pallets_')) {
          handlePalletPositions(optionId);
        } else if (optionId === 'faceout' || optionId === 'waterfall' || optionId === 'straight_arm' || optionId === 'mixed_hanging') {
          handleHangingDisplay(optionId);
        } else if (optionId.startsWith('hanging_')) {
          handleHangingFootage(optionId);
        } else if (optionId.startsWith('rx_')) {
          handlePharmacyType(optionId);
        } else if (optionId.includes('_hw')) {
          handleHardwareDisplay(optionId);
        } else {
          handleItems(optionId);
        }
      } else if (state.displayType && !state.timeline) {
        handleTimeline(optionId);
      } else if (state.timeline && (optionId === 'yes' || optionId === 'no' || optionId === 'browse')) {
        // After recommendation is shown, handle quote request
        handleQuoteRequest(optionId);
      } else if (!state.adjustability) {
        handleAdjustability(optionId);
      } else if (!state.spaceInfo) {
        handleSpaceInfo(optionId);
      } 
      // SPACE CALCULATION ROUTING
      else if (optionId.startsWith('sqft_')) {
        handleSquareFootage(optionId);
      } else if (optionId.startsWith('linear_')) {
        handleLinearFootage(optionId);
      } else if (optionId.startsWith('wall_')) {
        handleLinearFootage(optionId.replace('wall_', 'linear_')); // Reuse linear logic
      } else if (optionId.includes('_area') || optionId === 'whole_store') {
        handleAreaSize(optionId);
      } else if (optionId === 'space_good' || optionId === 'space_more' || optionId === 'space_less' || 
                 optionId === 'space_unsure' || optionId === 'space_adjust' || 
                 optionId === 'continue_more' || optionId === 'continue_anyway') {
        handleSpaceConfirmation(optionId);
      } else if (state.spaceInfo === 'sections' && !state.sectionCount) {
        handleSectionCount(optionId);
      } else if (!state.timeline) {
        handleTimeline(optionId);
      } else {
        handleQuoteRequest(optionId);
      }
    }
  };

  const processOptionSelection = (optionId) => {
    // Normal flow - clicking on the current active message
    processOptionSelectionWithState(optionId, conversationState);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addMessage('user', inputValue);
      
      // If in identify support mode, analyze for component identification
      if (conversationState.mode === 'support' && conversationState.supportType === 'identify') {
        identifyComponent(inputValue);
      }
      // If in custom mode, analyze the message for keywords
      else if (conversationState.mode === 'custom') {
        analyzeCustomRequest(inputValue);
      } else {
        // Default response for other modes
        addMessage('bot', "Thanks! Contact us:\n\n(800) 869-2040\ncustomerservice@storflex.com");
      }
      
      setInputValue('');
    }
  };

  return (
    <>
      {/* Floating Launcher Button - Only visible when widget is closed */}
      {!isWidgetOpen && (
        <button
          onClick={() => setIsWidgetOpen(true)}
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full p-4 shadow-2xl smooth-transition hover-scale focus:outline-none focus:ring-4 focus:ring-blue-300 animate-scale-in"
          aria-label="Open Storflex Product Specialist"
        >
          <div className="relative">
            <Package className="w-6 h-6" />
            {/* Online indicator */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
          </div>
        </button>
      )}

      {/* Main Chat Widget - Only visible when open */}
      {isWidgetOpen && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-30 sm:hidden"
            onClick={() => setIsWidgetOpen(false)}
            aria-hidden="true"
          />
          
          {/* Widget Container */}
          <div 
            className="fixed bottom-0 right-0 left-0 sm:left-auto sm:bottom-6 sm:right-6 w-full sm:w-[440px] h-[85vh] sm:h-[700px] flex flex-col bg-white shadow-2xl rounded-t-2xl sm:rounded-2xl z-40 transition-all duration-300"
            style={{ maxHeight: '100vh' }}
          >
          {/* Header with Close Button */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white p-3 sm:p-4 shadow-lg flex-shrink-0 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-white bg-opacity-20 p-1.5 sm:p-2 rounded-lg backdrop-blur-sm">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-lg font-bold">Storflex Assistant</h1>
                  <p className="text-xs text-blue-100">Product Specialist</p>
                </div>
              </div>
              <button
                onClick={() => setIsWidgetOpen(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Progress Indicator - Only show in sales flow */}
          {conversationState.mode === 'sales' && !showLeadForm && (() => {
            const getCurrentStep = () => {
              if (!conversationState.businessType) return 1;
              if (!conversationState.location) return 2;
              if ((conversationState.location === 'cooler' || conversationState.location === 'freezer' || conversationState.location === 'both_cf') && !conversationState.timeline) return 3;
              if (!conversationState.items && !conversationState.displayType) return 3;
              if (conversationState.location === 'checkout' && !conversationState.sectionCount) return 4;
              if (!conversationState.spaceInfo) return 4;
              if (!conversationState.timeline) return 5;
              return 6;
            };
            
            const getStepLabels = () => {
              const location = conversationState.location;
              if (location === 'cooler' || location === 'freezer' || location === 'both_cf') {
                return ['Business', 'Location', 'Timeline', 'Quote'];
              } else if (location === 'checkout') {
                return ['Business', 'Location', 'Items', 'Sections', 'Quote'];
              } else {
                return ['Business', 'Location', 'Details', 'Space', 'Timeline', 'Quote'];
              }
            };
            
            const currentStep = getCurrentStep();
            const stepLabels = getStepLabels();
            
            return (
              <div className="bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  {stepLabels.map((label, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;
                    
                    return (
                      <div key={index} className="flex-1 flex items-center">
                        <div className="flex flex-col items-center flex-1">
                          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-300 ${
                            isCompleted ? 'bg-green-500 text-white' : 
                            isCurrent ? 'bg-blue-600 text-white ring-2 sm:ring-4 ring-blue-200' : 
                            'bg-gray-200 text-gray-500'
                          }`}>
                            {isCompleted ? '✓' : stepNumber}
                          </div>
                          <span className={`text-[10px] sm:text-xs mt-1 text-center font-medium hidden sm:block ${
                            isCurrent ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            {label}
                          </span>
                        </div>
                        {index < stepLabels.length - 1 && (
                          <div className={`flex-1 h-0.5 sm:h-1 mx-0.5 sm:mx-1 rounded transition-all duration-300 ${
                            isCompleted ? 'bg-green-500' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 space-y-4 sm:space-y-5 bg-gradient-to-br from-blue-50 to-gray-50 scroll-smooth">
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-5 w-full">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 sm:p-4 smooth-transition ${
                  message.type === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white text-sm sm:text-base shadow-md'
                    : 'bg-white text-gray-900 shadow-lg border border-gray-100 text-sm sm:text-base hover-lift'
                }`}
              >
                {message.text && (
                  <div className="whitespace-pre-line leading-relaxed">{message.text}</div>
                )}
              
              {message.productLinks && (
                <div className="mt-2 sm:mt-3 space-y-2">
                  {/* "Why This Fits" Card - Only show when there are whyFits reasons */}
                  {message.whyFits && message.whyFits.length > 0 && (
                    <div className="mb-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 shadow-md animate-scale-in hover-lift smooth-transition">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-green-900 text-base">Why This Fits Your Needs</h4>
                      </div>
                      <ul className="space-y-2.5">
                        {message.whyFits.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-green-900 leading-relaxed flex-1">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Product Links */}
                  {(Array.isArray(message.productLinks) ? message.productLinks : [message.productLinks]).map((product, idx) => (
                    <a
                      key={idx}
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-blue-50 border-2 border-blue-200 rounded-lg p-3 sm:p-4 hover:bg-blue-100 active:bg-blue-200 transition-colors group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm sm:text-base font-semibold text-blue-800 mb-1 break-words">
                            {product.name}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600 break-words">
                            {product.title}
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 group-hover:text-blue-800 flex-shrink-0" />
                      </div>
                    </a>
                  ))}
                </div>
              )}
              
              {message.options && (
                <div className="mt-2 sm:mt-3 space-y-2">
                  {message.options.map((option) => {
                    const isCurrentQuestion = index === messages.length - 1;
                    const isPreviousQuestion = index < messages.length - 1;
                    
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleOptionClick(index, option.id)}
                        className={`w-full text-left px-4 py-3.5 sm:px-4 sm:py-3.5 border-2 rounded-xl smooth-transition flex items-center gap-2.5 group text-sm sm:text-base font-medium touch-manipulation min-h-[48px] hover-scale ${
                          isCurrentQuestion 
                            ? 'bg-white hover:bg-blue-50 active:bg-blue-100 border-blue-200 hover:border-blue-400 text-gray-900 hover:shadow-lg' 
                            : 'bg-gray-50 hover:bg-gray-100 active:bg-gray-200 border-gray-300 text-gray-700 opacity-80 hover:opacity-100'
                        }`}
                        title={isPreviousQuestion ? "Click to change this answer" : ""}
                      >
                        <span className="flex-1 break-words">{option.label}</span>
                        <ChevronRight className={`w-4 h-4 flex-shrink-0 ${
                          isCurrentQuestion 
                            ? 'text-gray-400 group-hover:text-blue-600' 
                            : 'text-gray-500'
                        }`} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {showLeadForm && (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-300 p-5 sm:p-6 animate-scale-in">
            <h3 className="text-lg sm:text-xl font-bold mb-1 flex items-center gap-2.5 text-gray-900">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
              Contact Information
            </h3>
            <p className="text-sm text-gray-600 mb-4">We'll prepare a custom quote for you</p>
            <form onSubmit={handleLeadSubmit} className="space-y-3.5">
              <input
                type="text"
                placeholder="Name *"
                required
                value={leadFormData.name}
                onChange={(e) => setLeadFormData({...leadFormData, name: e.target.value})}
                className="w-full px-4 py-3 text-sm sm:text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 smooth-transition min-h-[48px]"
              />
              <input
                type="text"
                placeholder="Company"
                value={leadFormData.company}
                onChange={(e) => setLeadFormData({...leadFormData, company: e.target.value})}
                className="w-full px-4 py-3 text-sm sm:text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 smooth-transition min-h-[48px]"
              />
              <input
                type="email"
                placeholder="Email *"
                required
                value={leadFormData.email}
                onChange={(e) => setLeadFormData({...leadFormData, email: e.target.value})}
                className="w-full px-4 py-3 text-sm sm:text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 smooth-transition min-h-[48px]"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={leadFormData.phone}
                onChange={(e) => setLeadFormData({...leadFormData, phone: e.target.value})}
                className="w-full px-4 py-3 text-sm sm:text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 smooth-transition min-h-[48px]"
              />
              <div className="flex gap-2 sm:gap-3">
                <input
                  type="text"
                  placeholder="City *"
                  required
                  value={leadFormData.city}
                  onChange={(e) => setLeadFormData({...leadFormData, city: e.target.value})}
                  className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="State *"
                  required
                  value={leadFormData.state}
                  onChange={(e) => setLeadFormData({...leadFormData, state: e.target.value})}
                  className="w-20 sm:w-24 px-2 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <textarea
                placeholder="Notes"
                value={leadFormData.notes}
                onChange={(e) => setLeadFormData({...leadFormData, notes: e.target.value})}
                className="w-full px-4 py-3 text-sm sm:text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 smooth-transition h-24 resize-none"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl text-sm sm:text-base font-semibold hover:from-blue-700 hover:to-blue-800 active:scale-98 smooth-transition flex items-center justify-center gap-2.5 touch-manipulation min-h-[52px] shadow-md hover:shadow-lg"
              >
                <CheckCircle className="w-5 h-5" />
                Submit Request
              </button>
            </form>
          </div>
        )}
        </div>
      </div>

      {/* Footer - Always visible with human escape hatch */}
      {!showLeadForm && (
        <div className="border-t border-gray-200 bg-white flex-shrink-0">
          {/* Human Escape Hatch - Always visible, low pressure */}
          <div className="px-3 sm:px-4 pt-3 pb-2 border-b border-gray-100">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
              <span>Prefer to talk to someone?</span>
              <a 
                href="tel:+18008692040" 
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium smooth-transition hover-lift"
              >
                <Phone className="w-3 h-3" />
                Call us
              </a>
              <span className="text-gray-400">or</span>
              <a 
                href="mailto:customerservice@storflex.com" 
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium smooth-transition hover-lift"
              >
                <Mail className="w-3 h-3" />
                Email
              </a>
            </div>
          </div>
          
          {/* Input area - Sticky for mobile */}
          <div className="p-3 sm:p-4">
            <form onSubmit={handleTextSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 text-sm sm:text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 smooth-transition min-h-[44px]"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 active:scale-95 smooth-transition flex-shrink-0 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center shadow-md hover:shadow-lg"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            
            {/* Subtle branding */}
            <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-2.5">
              Storflex Holdings Inc. • Corning, NY
            </p>
          </div>
        </div>
      )}
          </div>
        </>
      )}
    </>
  );
};

export default StorflexAssistant;
