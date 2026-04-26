import React, { useState } from 'react';
import { Send, ChevronRight, CheckCircle, Package, Wrench, Mail, Phone, MessageCircle, X } from 'lucide-react';

const StorflexAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "👋 Welcome! I'm the Storflex Assistant. I can help you choose the right shelving or fixtures and get you to a quote quickly.",
      timestamp: new Date()
    },
    {
      type: 'bot',
      text: "What are you working on today?",
      options: [
        { id: 'A', label: 'New store / remodel', icon: '🏪' },
        { id: 'B', label: 'Add or replace shelving', icon: '📦' },
        { id: 'C', label: 'Walk-in cooler / freezer', icon: '❄️' },
        { id: 'D', label: 'Parts, install, or instructions', icon: '🔧' },
        { id: 'E', label: 'Something else', icon: '💬' }
      ],
      timestamp: new Date()
    }
  ]);
  
  const [conversationState, setConversationState] = useState({
    mode: null, // 'sales' or 'support'
    intent: null,
    businessType: null,
    location: null,
    items: null,
    adjustability: null,
    spaceInfo: null,
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

  const getComponentDiagram = (component) => {
    const diagrams = {
      gondola: `
┌─────────────────────────┐
│    GONDOLA SHELVING     │
│  (Double-Sided Aisle)   │
├─────────────────────────┤
│ ┌─┐ Adjustable ┌─┐     │
│ │ │  Shelves    │ │     │
│ │ ├──────────┬──┤ │     │
│ │ │ Products │  │ │     │
│ │ ├──────────┼──┤ │     │
│ │ │ Products │  │ │     │
│ └─┴──────────┴──┴─┘     │
│   Base Shelf (Both)     │
└─────────────────────────┘
    Back Panel Options:
    • Solid • Pegboard
    • Slatwall • Wire Grid`,
      
      wall: `
┌─────────────────────────┐
│   WALL UNIT SHELVING    │
│   (Single-Sided Wall)   │
├─────────────────────────┤
│ ║                       │
│ ║ ┌──────────┐ Shelves  │
│ ║ │ Products │          │
│ ║ ├──────────┤          │
│ ║ │ Products │          │
│ ║ └──────────┘          │
│ ║  Base Shelf           │
└─┴───────────────────────┘
   Wall Mount
   Back Panel to Wall`,
      
      widespan: `
┌─────────────────────────┐
│   WIDESPAN SHELVING     │
│    (Heavy Duty Beam)    │
├─────────────────────────┤
│ ┌───Beam───┐            │
│ │ Shelf    │            │
│ ├──────────┤ Upright    │
│ │ Shelf    │            │
│ ├──────────┤            │
│ │ Shelf    │            │
│ └──────────┘            │
└─────────────────────────┘
    Load Capacity Varies
    by Span & Shelf Type`
    };
    
    return diagrams[component] || '';
  };

  const addMessage = (type, text, options = null) => {
    setMessages(prev => [...prev, {
      type,
      text,
      options,
      timestamp: new Date()
    }]);
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
            { id: 'grocery', label: 'Grocery' },
            { id: 'convenience', label: 'Convenience store' },
            { id: 'hardware', label: 'Hardware' },
            { id: 'pharmacy', label: 'Pharmacy' },
            { id: 'pet', label: 'Pet store' },
            { id: 'retail', label: 'Other retail' },
            { id: 'nonretail', label: 'Other (non-retail)' }
          ]);
        }, 800);
      }, 500);
    }
  };

  const handleBusinessType = (typeId) => {
    const labels = {
      'grocery': 'Grocery',
      'convenience': 'Convenience store',
      'hardware': 'Hardware',
      'pharmacy': 'Pharmacy',
      'pet': 'Pet store',
      'retail': 'Other retail',
      'nonretail': 'Other (non-retail)'
    };
    
    addMessage('user', labels[typeId]);
    setConversationState(prev => ({ ...prev, businessType: typeId }));
    
    setTimeout(() => {
      if (conversationState.intent === 'C') {
        addMessage('bot', "Walk-in coolers and freezers are a specialty. I'll connect you with our cooler/freezer team for sizing and configuration.");
        setTimeout(() => {
          addMessage('bot', "Want to get a quote or speak with a specialist?", [
            { id: 'yes', label: 'Yes, get me a quote' },
            { id: 'no', label: 'No, just browsing' }
          ]);
        }, 800);
      } else {
        addMessage('bot', "Where will the shelving go?", [
          { id: 'wall', label: 'Wall perimeter' },
          { id: 'aisles', label: 'Aisles' },
          { id: 'both', label: 'Both' }
        ]);
      }
    }, 500);
  };

  const handleLocation = (locationId) => {
    const labels = {
      'wall': 'Wall perimeter',
      'aisles': 'Aisles',
      'both': 'Both'
    };
    
    addMessage('user', labels[locationId]);
    setConversationState(prev => ({ ...prev, location: locationId }));
    
    setTimeout(() => {
      addMessage('bot', "What will you be shelving?", [
        { id: 'light', label: 'Mostly light retail items (snacks, cosmetics, small boxes)' },
        { id: 'mixed', label: 'Mixed items' },
        { id: 'bulk', label: 'Bulk/heavier items (cases, tools, large jugs)' },
        { id: 'long', label: 'Long/awkward items' },
        { id: 'unsure', label: 'Not sure' }
      ]);
    }, 500);
  };

  const handleItems = (itemsId) => {
    const labels = {
      'light': 'Mostly light retail items',
      'mixed': 'Mixed items',
      'bulk': 'Bulk/heavier items',
      'long': 'Long/awkward items',
      'unsure': 'Not sure'
    };
    
    addMessage('user', labels[itemsId]);
    setConversationState(prev => ({ ...prev, items: itemsId }));
    
    setTimeout(() => {
      addMessage('bot', "Do you need adjustable shelving?", [
        { id: 'yes', label: 'Yes, adjustable' },
        { id: 'no', label: 'No, fixed is fine' },
        { id: 'unsure', label: 'Not sure' }
      ]);
    }, 500);
  };

  const handleAdjustability = (adjId) => {
    const labels = {
      'yes': 'Yes, adjustable',
      'no': 'No, fixed is fine',
      'unsure': 'Not sure'
    };
    
    addMessage('user', labels[adjId]);
    setConversationState(prev => ({ ...prev, adjustability: adjId }));
    
    setTimeout(() => {
      addMessage('bot', "Do you know your space dimensions?", [
        { id: 'dimensions', label: 'I know rough dimensions' },
        { id: 'sections', label: 'I can estimate number of sections/bays' },
        { id: 'unsure', label: 'Not sure yet' }
      ]);
    }, 500);
  };

  const handleSpaceInfo = (spaceId) => {
    const labels = {
      'dimensions': 'I know rough dimensions',
      'sections': 'I can estimate number of sections/bays',
      'unsure': 'Not sure yet'
    };
    
    addMessage('user', labels[spaceId]);
    setConversationState(prev => ({ ...prev, spaceInfo: spaceId }));
    
    if (spaceId === 'dimensions') {
      setTimeout(() => {
        addMessage('bot', "Great! You can share rough dimensions in your quote request. One more question—what's your timeline?", [
          { id: 'asap', label: 'ASAP / this month' },
          { id: 'soon', label: '1–3 months' },
          { id: 'planning', label: 'Just planning' }
        ]);
      }, 500);
    } else if (spaceId === 'sections') {
      setTimeout(() => {
        addMessage('bot', "Perfect! About how many 3–4 ft sections do you need?", [
          { id: '1-5', label: '1-5 sections' },
          { id: '6-15', label: '6-15 sections' },
          { id: '16-30', label: '16-30 sections' },
          { id: '30+', label: '30+ sections' }
        ]);
      }, 500);
    } else {
      setTimeout(() => {
        addMessage('bot', "No problem! What's your timeline?", [
          { id: 'asap', label: 'ASAP / this month' },
          { id: 'soon', label: '1–3 months' },
          { id: 'planning', label: 'Just planning' }
        ]);
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
    
    setTimeout(() => {
      addMessage('bot', "What's your timeline?", [
        { id: 'asap', label: 'ASAP / this month' },
        { id: 'soon', label: '1–3 months' },
        { id: 'planning', label: 'Just planning' }
      ]);
    }, 500);
  };

  const handleTimeline = (timelineId) => {
    const labels = {
      'asap': 'ASAP / this month',
      'soon': '1–3 months',
      'planning': 'Just planning'
    };
    
    addMessage('user', labels[timelineId]);
    setConversationState(prev => ({ ...prev, timeline: timelineId }));
    
    setTimeout(() => {
      provideRecommendation();
    }, 800);
  };

  const provideRecommendation = () => {
    const { location, items, adjustability } = conversationState;
    
    let primaryCategory = '';
    let whyFits = [];
    let secondaryCategory = '';
    let visualInfo = '';
    let catalogPages = '';
    let catalogLink = 'https://storflex.com/Catalog.pdf';
    
    // Recommendation logic based on user inputs
    if (location === 'aisles' || location === 'both') {
      if (items === 'bulk') {
        primaryCategory = 'Widespan Shelving';
        whyFits = [
          'Designed for heavier items and bulk storage',
          'Strong beam construction supports cases and large containers',
          'Ideal for warehouse-style retail or backroom storage'
        ];
        visualInfo = 'Widespan uses a beam-and-upright system with particle board, plywood, melamine, or wire shelves.';
        catalogPages = 'Section 11, pages 11-1 to 11-8';
      } else {
        primaryCategory = 'Gondola Shelving';
        whyFits = [
          'Perfect for aisle displays in retail environments',
          'Adjustable shelves let you optimize spacing',
          'Double-sided design maximizes merchandising space'
        ];
        visualInfo = 'Gondolas feature the Z-Line system with back panels (solid, pegboard, slatwall, or wire grid) and adjustable uprights.';
        catalogPages = 'Section 2-3, pages 2-1 to 2-6';
      }
    } else if (location === 'wall') {
      primaryCategory = 'Wall Unit Shelving';
      whyFits = [
        'Designed specifically for perimeter wall displays',
        'Clean, professional look against walls',
        'Adjustable shelving for flexible merchandising'
      ];
      visualInfo = 'Wall units attach to perimeter walls with single-sided shelving and various back panel options.';
      catalogPages = 'Section 2, pages 2-1 to 2-2';
    } else {
      primaryCategory = 'Gondola Shelving';
      whyFits = [
        'Versatile solution for most retail needs',
        'Available in both wall and aisle configurations',
        'Industry-standard adjustability and accessories'
      ];
      visualInfo = 'Gondolas feature the Z-Line system with back panels (solid, pegboard, slatwall, or wire grid) and adjustable uprights.';
      catalogPages = 'Section 2-3, pages 2-1 to 2-6';
    }
    
    if (location === 'both') {
      secondaryCategory = 'Wall Unit Shelving';
    }
    
    addMessage('bot', `Based on your needs, I recommend **${primaryCategory}**`);
    
    setTimeout(() => {
      addMessage('bot', `Why this fits:\n${whyFits.map((reason, i) => `${i + 1}. ${reason}`).join('\n')}`);
      
      setTimeout(() => {
        // Add ASCII diagram
        let diagramType = primaryCategory.toLowerCase().includes('gondola') ? 'gondola' 
          : primaryCategory.toLowerCase().includes('wall') ? 'wall' 
          : primaryCategory.toLowerCase().includes('widespan') ? 'widespan' : '';
        
        if (diagramType) {
          const diagram = getComponentDiagram(diagramType);
          addMessage('bot', `\`\`\`${diagram}\`\`\``);
        }
        
        setTimeout(() => {
          addMessage('bot', `📐 **System Overview:**\n${visualInfo}\n\n📖 See catalog ${catalogPages} for detailed diagrams and component breakdowns.\n\n🔗 View catalog: ${catalogLink}`);
          
          setTimeout(() => {
            if (secondaryCategory) {
              addMessage('bot', `You may also want to consider **${secondaryCategory}** for your wall perimeter.`);
            }
            
            setTimeout(() => {
              // Add visual component breakdown
              let componentInfo = '';
              if (primaryCategory.includes('Gondola') || primaryCategory.includes('Wall')) {
                componentInfo = `
**Key Components (see catalog diagrams):**

🔧 Base Options:
• Extended - Die-formed tag molding with 1" perforations
• Bullnose - Rounded front edge
• Gondola Guard - Aluminum extrusion with uptilt molding
• Radius Corner - Curved corners for endcaps

📏 Heights: 48" to 120" (6" increments)
📐 Widths: 12" to 48" base depths
🎨 Back Panels: Solid, Pegboard, Slatwall, Wire Grid

Source: Storflex Product Catalog (Catalog.pdf), Section 3
🔗 ${catalogLink}`;
              } else if (primaryCategory.includes('Widespan')) {
                componentInfo = `
**Key Components (see catalog diagrams):**

🔧 System Features:
• Front and rear beams (36" to 96" lengths)
• Fixed upright spreaders
• Choice of shelf materials (particle board, plywood, melamine, wire)

📏 Heights: 78" to 120"
📐 Base depths: 12" to 36"
💪 Load capacity varies by span and shelf type

Source: Storflex Product Catalog (Catalog.pdf), Section 11
🔗 ${catalogLink}`;
              }
              
              addMessage('bot', componentInfo);
              
              setTimeout(() => {
                addMessage('bot', "Want a custom quote or layout recommendation?", [
                  { id: 'yes', label: 'Yes, get me a quote' },
                  { id: 'catalog', label: 'Send me the catalog' },
                  { id: 'no', label: 'No, just browsing' }
                ]);
              }, 1000);
            }, 800);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 800);
  };

  const handleQuoteRequest = (response) => {
    if (response === 'yes') {
      addMessage('user', 'Yes, get me a quote');
      setTimeout(() => {
        addMessage('bot', "Great! I can send your answers to a Storflex specialist for a quote or layout suggestion. What's the best way to reach you?");
        setShowLeadForm(true);
      }, 500);
    } else if (response === 'catalog') {
      addMessage('user', 'Send me the catalog');
      setTimeout(() => {
        addMessage('bot', "I can send you the full product catalog! What's the best email address to send it to?");
        setShowLeadForm(true);
      }, 500);
    } else {
      addMessage('user', 'No, just browsing');
      setTimeout(() => {
        addMessage('bot', "No problem! Feel free to explore the Storflex catalog or reach out anytime:\n\n📞 (800) 869-2040\n📧 customerservice@storflex.com\n\nGood luck with your project!");
      }, 500);
    }
  };

  const handleSupportRequest = (supportType) => {
    const labels = {
      'assembly': 'Assembly instructions',
      'parts': 'Missing or replacement parts',
      'identify': 'Identify a component',
      'troubleshoot': 'Troubleshooting'
    };
    
    addMessage('user', labels[supportType]);
    
    setTimeout(() => {
      if (supportType === 'assembly') {
        addMessage('bot', "Storflex provides detailed installation instructions in the product catalog. You can also find video tutorials at:\n\nhttps://www.youtube.com/@storflexholdings2165\n\n📖 Full Catalog: https://storflex.com/Catalog.pdf\n\nSource: Storflex Product Catalog (Catalog.pdf)");
        setTimeout(() => {
          addMessage('bot', "Need help with something else, or want to speak with support?", [
            { id: 'contact', label: 'Contact support' },
            { id: 'done', label: "I'm all set" }
          ]);
        }, 1000);
      } else if (supportType === 'parts') {
        addMessage('bot', "For missing or replacement parts, you'll need to contact Storflex directly:\n\n📞 (607) 962-2137 or (800) 869-2040\n📧 customerservice@storflex.com\n\nThey'll need your order details and can ship replacement parts quickly.\n\n📖 Part numbers are in the catalog: https://storflex.com/Catalog.pdf\n\nSource: Storflex Product Catalog (Catalog.pdf)");
      } else if (supportType === 'identify') {
        addMessage('bot', "I can help identify components! Do you have:\n• Product type (gondola, widespan, pharmacy, etc.)\n• Approximate purchase year\n• Photos or labels/markings\n\nYou can share these details with Storflex support for fastest identification:\n\n📞 (607) 962-2137\n📧 customerservice@storflex.com");
      } else {
        addMessage('bot', "For troubleshooting, I recommend contacting Storflex support directly. They can walk you through solutions:\n\n📞 (607) 962-2137 or (800) 869-2040\n📧 customerservice@storflex.com");
      }
    }, 500);
  };

  const handleSupportContact = (choice) => {
    if (choice === 'contact') {
      addMessage('user', 'Contact support');
      setTimeout(() => {
        addMessage('bot', "I can connect you with support. What's the best email or phone number to reach you?");
        setShowLeadForm(true);
      }, 500);
    } else {
      addMessage('user', "I'm all set");
      setTimeout(() => {
        addMessage('bot', "Glad I could help! Feel free to return if you need anything else. 👍");
      }, 500);
    }
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    
    const summary = `
**Lead Summary**
Name: ${leadFormData.name}
Company: ${leadFormData.company || 'N/A'}
Email: ${leadFormData.email}
Phone: ${leadFormData.phone || 'N/A'}
Location: ${leadFormData.city}, ${leadFormData.state}

**Project Details**
Intent: ${conversationState.intent}
Business Type: ${conversationState.businessType || 'N/A'}
Location: ${conversationState.location || 'N/A'}
Items: ${conversationState.items || 'N/A'}
Timeline: ${conversationState.timeline || 'N/A'}

Notes: ${leadFormData.notes || 'None'}
    `.trim();
    
    setShowLeadForm(false);
    addMessage('bot', `Thanks, ${leadFormData.name}! Here's what I'll send to our team:\n\n${summary}`);
    
    setTimeout(() => {
      addMessage('bot', "A Storflex specialist will reach out within 1 business day. Thanks for considering Storflex! 🎉");
    }, 1000);
  };

  const handleOptionClick = (messageIndex, optionId) => {
    const message = messages[messageIndex];
    
    // Determine which handler to use based on conversation state
    if (!conversationState.mode) {
      handleIntentSelection(optionId);
    } else if (conversationState.mode === 'support') {
      if (!conversationState.businessType) {
        handleSupportRequest(optionId);
      } else {
        handleSupportContact(optionId);
      }
    } else if (conversationState.mode === 'sales') {
      if (!conversationState.businessType) {
        handleBusinessType(optionId);
      } else if (!conversationState.location && conversationState.intent !== 'C') {
        handleLocation(optionId);
      } else if (conversationState.intent === 'C' || (conversationState.location && !conversationState.items)) {
        if (optionId === 'yes' || optionId === 'no') {
          handleQuoteRequest(optionId);
        } else {
          handleItems(optionId);
        }
      } else if (!conversationState.adjustability) {
        handleAdjustability(optionId);
      } else if (!conversationState.spaceInfo) {
        handleSpaceInfo(optionId);
      } else if (conversationState.spaceInfo === 'sections' && !conversationState.timeline) {
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
      addMessage('bot', "Thanks for that info! Let me connect you with a specialist who can help:\n\n📞 (800) 869-2040\n📧 customerservice@storflex.com");
      setInputValue('');
    }
  };

  return (
    <div className="fixed bottom-0 right-0 z-50">
      {/* Chat Widget Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-2xl hover:bg-blue-700 transition-all hover:scale-110 flex items-center gap-2 group"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
            Need help with shelving?
          </span>
        </button>
      )}

      {/* Chat Widget Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[420px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border-2 border-gray-200 animate-slideIn">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8" />
              <div>
                <h1 className="text-lg font-bold">Storflex Assistant</h1>
                <p className="text-xs text-blue-100">Product Finder & Quotes</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-700 rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-blue-50 to-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white shadow-md border border-gray-200'
                  }`}
                >
                  {message.text.includes('```') ? (
                    <pre className="whitespace-pre font-mono text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                      {message.text.replace(/```/g, '')}
                    </pre>
                  ) : (
                    <div className="whitespace-pre-line text-sm">
                      {message.text.split('\n').map((line, i) => {
                        // Check if line contains a URL
                        const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
                        if (urlMatch) {
                          const parts = line.split(urlMatch[0]);
                          return (
                            <p key={i}>
                              {parts[0]}
                              <a 
                                href={urlMatch[0]} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 underline hover:text-blue-800"
                              >
                                {urlMatch[0]}
                              </a>
                              {parts[1]}
                            </p>
                          );
                        }
                        return <p key={i}>{line}</p>;
                      })}
                    </div>
                  )}
                  
                  {message.options && (
                    <div className="mt-3 space-y-2">
                      {message.options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleOptionClick(index, option.id)}
                          className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-blue-50 border border-gray-300 rounded-lg transition-all flex items-center gap-2 group text-sm"
                        >
                          {option.icon && <span className="text-lg">{option.icon}</span>}
                          <span className="flex-1">{option.label}</span>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Lead Form */}
            {showLeadForm && (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-4">
                <h3 className="text-md font-bold mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  Contact Information
                </h3>
                <form onSubmit={handleLeadSubmit} className="space-y-2">
                  <input
                    type="text"
                    placeholder="Name *"
                    required
                    value={leadFormData.name}
                    onChange={(e) => setLeadFormData({...leadFormData, name: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Company (optional)"
                    value={leadFormData.company}
                    onChange={(e) => setLeadFormData({...leadFormData, company: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    required
                    value={leadFormData.email}
                    onChange={(e) => setLeadFormData({...leadFormData, email: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={leadFormData.phone}
                    onChange={(e) => setLeadFormData({...leadFormData, phone: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="City *"
                      required
                      value={leadFormData.city}
                      onChange={(e) => setLeadFormData({...leadFormData, city: e.target.value})}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="State *"
                      required
                      value={leadFormData.state}
                      onChange={(e) => setLeadFormData({...leadFormData, state: e.target.value})}
                      className="w-20 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <textarea
                    placeholder="Any additional notes (optional)"
                    value={leadFormData.notes}
                    onChange={(e) => setLeadFormData({...leadFormData, notes: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-16"
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Submit Request
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Input (hidden when form is shown) */}
          {!showLeadForm && (
            <div className="border-t border-gray-200 p-3 bg-white">
              <form onSubmit={handleTextSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <p className="text-xs text-gray-500 text-center mt-2">
                Storflex Holdings | (800) 869-2040
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add custom animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateY(100%) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StorflexAssistant;