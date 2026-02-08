import React, { useState } from 'react';
import { Send, ChevronRight, CheckCircle, Package, Wrench, Mail, Phone, ExternalLink } from 'lucide-react';

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
    
    if (primaryProducts.length === 1) {
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
        text: "I can help identify components.",
        options: [
          { id: 'shelf', label: 'Shelf or bracket' },
          { id: 'upright', label: 'Upright or post' },
          { id: 'base', label: 'Base or foot' },
          { id: 'other_part', label: 'Other component' }
        ]
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
    addMessage('user', response.text);
    
    setTimeout(() => {
      addMessage('bot', response.text, response.options);
    }, 500);
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

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    
    const summary = `Quote Request Summary\n\nBusiness Type: ${conversationState.businessType || 'N/A'}\nLocation: ${conversationState.location || 'N/A'}\nTimeline: ${conversationState.timeline || 'N/A'}\n\nContact: ${leadFormData.name}\nEmail: ${leadFormData.email}\nPhone: ${leadFormData.phone || 'N/A'}\nCity: ${leadFormData.city}, ${leadFormData.state}`;

    setShowLeadForm(false);
    addMessage('bot', `Thanks, ${leadFormData.name}! Here's what I'll send to our team:\n\n${summary}`);
    
    setTimeout(() => {
      addMessage('bot', "A Storflex specialist will reach out within 1 business day!");
    }, 1000);
  };

  const handleOptionClick = (messageIndex, optionId) => {
    if (!conversationState.mode) {
      handleIntentSelection(optionId);
    } else if (conversationState.mode === 'support') {
      if (!conversationState.businessType) {
        handleSupportRequest(optionId);
      } else {
        handleSupportContact();
      }
    } else if (conversationState.mode === 'sales') {
      if (!conversationState.businessType) {
        handleBusinessType(optionId);
      } else if (!conversationState.location && conversationState.intent !== 'C') {
        handleLocation(optionId);
      } else if (conversationState.intent === 'C' || (conversationState.location && !conversationState.items && !conversationState.displayType)) {
        if (optionId === 'yes' || optionId === 'no' || optionId === 'browse') {
          handleQuoteRequest(optionId);
        } else if (optionId.includes('_end') || optionId.includes('_corner') || optionId.includes('_checkout')) {
          handleDisplayType(optionId);
        } else {
          handleItems(optionId);
        }
      } else if (conversationState.displayType && !conversationState.timeline) {
        handleTimeline(optionId);
      } else if (!conversationState.adjustability) {
        handleAdjustability(optionId);
      } else if (!conversationState.spaceInfo) {
        handleSpaceInfo(optionId);
      } else if (conversationState.spaceInfo === 'sections' && !conversationState.sectionCount) {
        handleSectionCount(optionId);
      } else if (!conversationState.timeline) {
        handleTimeline(optionId);
      } else {
        handleQuoteRequest(optionId);
      }
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addMessage('user', inputValue);
      addMessage('bot', "Thanks! Contact us:\n\n(800) 869-2040\ncustomerservice@storflex.com");
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold">Storflex Assistant</h1>
            <p className="text-sm text-blue-100">Product Finder & Quote Generator</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white shadow-md border border-gray-200'
              }`}
            >
              {message.text && (
                <div className="whitespace-pre-line">{message.text}</div>
              )}
              
              {message.productLinks && (
                <div className="mt-3 space-y-2">
                  {(Array.isArray(message.productLinks) ? message.productLinks : [message.productLinks]).map((product, idx) => (
                    <a
                      key={idx}
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-blue-50 border-2 border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-blue-800 mb-1">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {product.title}
                          </div>
                        </div>
                        <ExternalLink className="w-5 h-5 text-blue-600 group-hover:text-blue-800 flex-shrink-0 ml-3" />
                      </div>
                    </a>
                  ))}
                </div>
              )}
              
              {message.options && (
                <div className="mt-3 space-y-2">
                  {message.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleOptionClick(index, option.id)}
                      className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 border border-gray-300 rounded-lg transition-all flex items-center gap-2 group"
                    >
                      <span className="flex-1">{option.label}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {showLeadForm && (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Contact Information
            </h3>
            <form onSubmit={handleLeadSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Name *"
                required
                value={leadFormData.name}
                onChange={(e) => setLeadFormData({...leadFormData, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Company"
                value={leadFormData.company}
                onChange={(e) => setLeadFormData({...leadFormData, company: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Email *"
                required
                value={leadFormData.email}
                onChange={(e) => setLeadFormData({...leadFormData, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={leadFormData.phone}
                onChange={(e) => setLeadFormData({...leadFormData, phone: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="City *"
                  required
                  value={leadFormData.city}
                  onChange={(e) => setLeadFormData({...leadFormData, city: e.target.value})}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="State *"
                  required
                  value={leadFormData.state}
                  onChange={(e) => setLeadFormData({...leadFormData, state: e.target.value})}
                  className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <textarea
                placeholder="Notes"
                value={leadFormData.notes}
                onChange={(e) => setLeadFormData({...leadFormData, notes: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Submit Request
              </button>
            </form>
          </div>
        )}
      </div>

      {!showLeadForm && (
        <div className="border-t border-gray-200 p-4 bg-white">
          <form onSubmit={handleTextSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-xs text-gray-500 text-center mt-2">
            Storflex Holdings Inc. | (800) 869-2040 | Corning, NY
          </p>
        </div>
      )}
    </div>
  );
};

export default StorflexAssistant;
