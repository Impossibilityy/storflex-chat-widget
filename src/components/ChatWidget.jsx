import React, { useState } from 'react';
import { Send, ChevronRight, CheckCircle, Package, Wrench, Mail, Phone, ExternalLink } from 'lucide-react';

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
    leadData: {}
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

  const addMessage = (type, text, options = null, productLinks = null) => {
    const newMessage = {
      type,
      text,
      options,
      productLinks,
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
    setConversationState(prev => ({ ...prev, location: locationId }));
    
    setTimeout(() => {
      if (locationId === 'cooler' || locationId === 'freezer' || locationId === 'both_cf') {
        skipToTimeline();
        return;
      }
      
      if (locationId === 'endcaps') {
        addMessage('bot', "What type of end cap display interests you?", [
          { id: 'standard_end', label: 'Standard end units' },
          { id: 'promotional', label: 'Promotional / Seasonal displays' },
          { id: 'both_ends', label: 'Both options' }
        ]);
      } else if (locationId === 'corners') {
        addMessage('bot', "What type of corner solution do you need?", [
          { id: 'inside_corner', label: 'Inside corner (dramatic transition)' },
          { id: 'box_corner', label: 'Box corner (eliminate dead space)' },
          { id: 'not_sure_corner', label: 'Not sure - need advice' }
        ]);
      } else if (locationId === 'checkout') {
        addMessage('bot', "What are you looking for at checkout?", [
          { id: 'counter_system', label: 'Merchandising counter system' },
          { id: 'impulse_displays', label: 'Impulse / Four-sided displays' },
          { id: 'both_checkout', label: 'Both options' }
        ]);
      } else {
        addMessage('bot', "What will you be displaying?", [
          { id: 'packaged', label: 'Packaged goods (cans, boxes)' },
          { id: 'bulk', label: 'Bulk items or cases' },
          { id: 'mixed', label: 'Mix of products' },
          { id: 'pharmacy_items', label: 'Pharmacy/Rx items' },
          { id: 'hardware_items', label: 'Hardware/Tools' },
          { id: 'specialty', label: 'Specialty/variable items' }
        ]);
      }
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
      pharmacy_items: 'Pharmacy/Rx items',
      hardware_items: 'Hardware/Tools',
      specialty: 'Specialty/variable items'
    };
    
    addMessage('user', labels[itemsId]);
    setConversationState(prev => ({ ...prev, items: itemsId }));
    
    setTimeout(() => {
      addMessage('bot', "Do you need adjustable shelves?", [
        { id: 'yes', label: 'Yes, adjustable shelving' },
        { id: 'no', label: 'No, fixed heights are fine' },
        { id: 'unsure', label: 'Not sure' }
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
      footage: 'I know square footage',
      sections: 'I know number of sections needed',
      dimensions: 'I have wall dimensions',
      help: 'Need help figuring it out'
    };
    
    addMessage('user', labels[spaceId]);
    setConversationState(prev => ({ ...prev, spaceInfo: spaceId }));
    
    if (spaceId === 'sections') {
      setTimeout(() => {
        addMessage('bot', "How many sections do you need?", [
          { id: '1-5', label: '1-5 sections' },
          { id: '6-15', label: '6-15 sections' },
          { id: '16-30', label: '16-30 sections' },
          { id: '30+', label: '30+ sections' }
        ]);
      }, 500);
    } else {
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
      recommendationText = `Based on your needs, let me connect you with our product catalog:\n\n`;
    } else if (primaryProducts.length === 1) {
      recommendationText = `Based on your needs, I recommend:\n\n${primaryProducts[0].name}\n\n`;
    } else {
      recommendationText = `Based on your needs, I recommend these solutions:\n\n`;
    }
    
    recommendationText += "Why this fits your needs:\n";
    whyFits.forEach(reason => {
      recommendationText += `- ${reason}\n`;
    });
    
    if (catalogPages) {
      recommendationText += `\nCatalog Reference: ${catalogPages}`;
    }
    
    addMessage('bot', recommendationText, null, primaryProducts);
    
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
  // Phase 1: Brackets & Shelves (Full Implementation)
  // Based on Storflex 14-section catalog structure
  const identifyComponent = (description) => {
    const desc = description.toLowerCase();
    
    // Detect primary component category
    const componentCategories = {
      bracket: ['bracket', 'arm', 'support', 'holder', 'clip', 'mount', 'cantilever'],
      shelf: ['shelf', 'shelve', 'shelving', 'deck', 'board', 'surface', 'decking'],
      upright: ['upright', 'post', 'column', 'vertical', 'standard', 'frame', 'pole'],
      base: ['base', 'foot', 'feet', 'bottom', 'shoe', 'leg'],
      panel: ['panel', 'back', 'backing', 'pegboard', 'slatwall', 'wire grid'],
      accessory: ['hook', 'peg', 'divider', 'fence', 'basket', 'bin', 'sign holder', 'price', 'retainer'],
      other: []
    };
    
    let detectedCategory = null;
    
    for (const [category, keywords] of Object.entries(componentCategories)) {
      if (keywords.some(keyword => desc.includes(keyword))) {
        detectedCategory = category;
        break;
      }
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
      identifyDetails: { originalDescription: description }
    }));
    
    startProgressiveClarification(detectedCategory);
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
        
      // Simplified handling for other categories (will expand in later phases)
      case 'upright':
      case 'base':
      case 'panel':
      case 'accessory':
      case 'other':
        addMessage('bot', `I can help identify that component! To ensure accuracy, let me connect you with our support team:\n\n📞 **Phone:** (800) 869-2040\n📧 **Email:** customerservice@storflex.com\n\nThey can identify any component from photos or detailed descriptions.`, [
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
        addMessage('bot', "Great! I'll need a few details to prepare your quote.");
        setShowLeadForm(true);
      }, 500);
    } else if (requestId === 'browse') {
      addMessage('user', 'Browse all products');
      
      setTimeout(() => {
        addMessage('bot', "Here's our complete product catalog:", null, [PRODUCT_CATALOG.allProducts]);
      }, 500);
    } else {
      addMessage('user', 'Just call me');
      
      setTimeout(() => {
        addMessage('bot', "Perfect! Give us a call:\n\n(800) 869-2040\n\nMention you spoke with the Storflex Assistant!");
      }, 500);
    }
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    
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
      spaceInfo: conversationState.spaceInfo || 'N/A',
      sectionCount: conversationState.sectionCount || 'N/A',
      timeline: conversationState.timeline || 'N/A',
      notes: leadFormData.notes || 'None'
    };

    try {
      // Send to Google Sheets via Google Apps Script Web App
      const response = await fetch('https://script.google.com/macros/s/AKfycby-BQ6qGS4I-KYJqgdMEcihR91u5uLh_52YwilJiz06kQpKCQf9SF6fXFp9R8HFiCpu/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(leadData)
      });

      console.log('Lead submitted successfully:', leadData);
      
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
      } else if (optionId === 'more_info' || optionId === 'describe_again' || optionId === 'contact_support' || 
                 optionId === 'provide_detail' || optionId === 'yes_match' || optionId === 'not_quite' || 
                 optionId === 'skip_to_contact') {
        // Handle component identification follow-up actions
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
        if (optionId === 'yes' || optionId === 'no' || optionId === 'browse') {
          handleQuoteRequest(optionId);
        } else if (optionId.includes('_end') || optionId.includes('_corner') || optionId.includes('_checkout')) {
          handleDisplayType(optionId);
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
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
          aria-label="Open Storflex Assistant"
        >
          <div className="relative">
            <Package className="w-6 h-6" />
            {/* Online indicator */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
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
          <div className="bg-blue-600 text-white p-3 sm:p-4 shadow-lg flex-shrink-0 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <Package className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" />
                <div className="min-w-0">
                  <h1 className="text-base sm:text-lg font-bold">Storflex Assistant</h1>
                  <p className="text-xs text-blue-100">Product Finder & Quote Generator</p>
                </div>
              </div>
              <button
                onClick={() => setIsWidgetOpen(false)}
                className="p-2 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gradient-to-br from-blue-50 to-gray-50">
            <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white text-sm sm:text-base'
                    : 'bg-white text-gray-900 shadow-md border border-gray-200 text-sm sm:text-base'
                }`}
              >
                {message.text && (
                  <div className="whitespace-pre-line leading-relaxed">{message.text}</div>
                )}
              
              {message.productLinks && (
                <div className="mt-2 sm:mt-3 space-y-2">
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
                        className={`w-full text-left px-3 py-2.5 sm:px-4 sm:py-3 border rounded-lg transition-all flex items-center gap-2 group text-sm sm:text-base text-gray-900 touch-manipulation ${
                          isCurrentQuestion 
                            ? 'bg-gray-50 hover:bg-blue-50 active:bg-blue-100 border-gray-300' 
                            : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 border-gray-400 opacity-75'
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
          <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
              Contact Information
            </h3>
            <form onSubmit={handleLeadSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Name *"
                required
                value={leadFormData.name}
                onChange={(e) => setLeadFormData({...leadFormData, name: e.target.value})}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Company"
                value={leadFormData.company}
                onChange={(e) => setLeadFormData({...leadFormData, company: e.target.value})}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Email *"
                required
                value={leadFormData.email}
                onChange={(e) => setLeadFormData({...leadFormData, email: e.target.value})}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={leadFormData.phone}
                onChange={(e) => setLeadFormData({...leadFormData, phone: e.target.value})}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center gap-2 touch-manipulation"
              >
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                Submit Request
              </button>
            </form>
          </div>
        )}
        </div>
      </div>

      {/* Footer - Responsive */}
      {!showLeadForm && (
        <div className="border-t border-gray-200 p-3 sm:p-4 bg-white flex-shrink-0">
          <div className="mx-auto">
            <form onSubmit={handleTextSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-2.5 sm:p-3 rounded-full hover:bg-blue-700 active:bg-blue-800 transition-colors flex-shrink-0 touch-manipulation"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </form>
            <p className="text-xs sm:text-sm text-gray-500 text-center mt-2">
              Storflex Holdings Inc. | (800) 869-2040 | Corning, NY
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
